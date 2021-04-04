/* eslint-disable no-param-reassign, consistent-return, no-restricted-syntax */
const clone = require('clone');
const fs = require('fs');
const lessToJS = require('less-vars-to-js');

// fix: prevents error when .less files are required by node
if (typeof require !== 'undefined') require.extensions['.less'] = () => {
};

// function overrideWebpackConfig(webpackConfig, nextConfig, pluginOptions) {
function overrideWebpackConfig({ webpackConfig, nextConfig, pluginOptions }) {
  const lessVarsByFile = pluginOptions.lessVarsFilePath
    ? lessToJS(fs.readFileSync(pluginOptions.lessVarsFilePath, 'utf8'))
    : {};

  const modifyVars = {
    ...lessVarsByFile,
    ...pluginOptions.modifyVars,
  };

  if (nextConfig && !nextConfig.defaultLoaders) {
    throw new Error(
      // eslint-disable-next-line max-len
      'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade',
    );
  }

  const { dev } = nextConfig;
  const { rules } = webpackConfig.module;

  // compatible w/ webpack 4 and 5
  const ruleIndex = rules.findIndex((rule) => Array.isArray(rule.oneOf));
  const rule = rules[ruleIndex];

  // ---- module ----

  // find
  const sassModuleRegx = '/\\.module\\.(scss|sass)$/';
  const sassModuleIndex = rule.oneOf.findIndex(
    (item) => `${item.test}` === sassModuleRegx,
  );
  const sassModule = rule.oneOf.find(
    (item) => `${item.test}` === sassModuleRegx,
  );

  // clone
  const lessModule = clone(sassModule);
  lessModule.test = /\.less$/;
  delete lessModule.issuer;

  // overwrite
  const lessModuleIndex = lessModule.use.findIndex((item) =>
    `${item.loader}`.includes('sass-loader'),
  );
  lessModule.use.splice(lessModuleIndex, 1, {
    // https://github.com/webpack-contrib/less-loader#options
    loader: 'less-loader',
    options: {
      lessOptions: {
        javascriptEnabled: true,
        modifyVars,
      },
      ...pluginOptions.lessLoaderOptions,
    },
  });

  // ---- loader ----

  // find
  const cssModuleIndex = lessModule.use.findIndex((item) =>
    `${item.loader}`.includes('css-loader'),
  );
  const cssModule = lessModule.use.find((item) =>
    `${item.loader}`.includes('css-loader'),
  );

  // clone
  const nextCssModule = clone(cssModule);

  // merge webpackConfig
  nextCssModule.options = {
    ...nextCssModule.options,
    esModule: false,
    sourceMap: false,
    ...pluginOptions.cssLoaderOptions,
    //
    modules: {
      ...nextCssModule.options.modules,
      localIdentName: dev ? '[local]--[hash:4]' : '[hash:4]',
      // if enable `local` mode, you can write this less
      //
      // ```styles.module.less
      // .abc {      <---- is local, match class='abc--nx3xc2'
      //   color: red;
      //
      //   :global {
      //     .xyz {  <---- is global, match class='xyz'
      //       color: blue;
      //     }
      //   }
      // }
      //
      mode: 'local', // local, global, and pure, next.js default is `pure`
      ...(pluginOptions.cssLoaderOptions || {}).modules,
      auto: true, // keep true
    },
  };

  // overwrite
  lessModule.use.splice(cssModuleIndex, 1, nextCssModule);

  // append lessModule to webpack modules
  rule.oneOf.splice(sassModuleIndex, 0, lessModule);
  webpackConfig.module.rules[ruleIndex] = rule;

  // ONLY for next.js server
  if (nextConfig) {
    webpackConfig = handleAntdInServer(webpackConfig, nextConfig);

    if (typeof pluginOptions.webpack === 'function')
      return pluginOptions.webpack(webpackConfig, nextConfig);
  }

  return webpackConfig;
}

function handleAntdInServer(config, options) {
  if (!options.isServer) return config;

  const ANTD_STYLE_REGX = /antd\/.*?\/style.*?/;
  const rawExternals = [...config.externals];

  config.externals = [
    (context, request, callback) => {
      if (request.match(ANTD_STYLE_REGX)) return callback();

      if (typeof rawExternals[0] === 'function')
        rawExternals[0](context, request, callback);
      else callback();
    },
    ...(typeof rawExternals[0] === 'function' ? [] : rawExternals),
  ];

  config.module.rules.unshift({ test: ANTD_STYLE_REGX, use: 'null-loader' });

  return config;
}

module.exports = {
  overrideWebpackConfig,
  handleAntdInServer,
};
