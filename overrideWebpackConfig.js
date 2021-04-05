/* eslint-disable no-param-reassign, consistent-return, no-restricted-syntax */
const clone = require('clone');
const fs = require('fs');
const path = require('path');

// fix: prevents error when .less files are required by node
if (typeof require !== 'undefined') require.extensions['.less'] = () => {
};

/**
 * checkIsNextJs
 *
 * @param webpackConfig
 * @returns {boolean}
 */
function checkIsNextJs(webpackConfig) {
  return Boolean(webpackConfig?.resolveLoader?.alias?.['next-babel-loader']);
}

/**
 * overrideWebpackConfig
 *
 * @param webpackConfig
 * @param nextConfig
 * @param pluginOptions
 * @returns {*}
 */
function overrideWebpackConfig({ webpackConfig, nextConfig, pluginOptions }) {
  const isNextJs = checkIsNextJs(webpackConfig);

  if (isNextJs && !nextConfig.defaultLoaders) {
    throw new Error(
      // eslint-disable-next-line max-len
      'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade',
    );
  }

  let __DEV__;
  if (isNextJs) __DEV__ = nextConfig.dev;
  else __DEV__ = webpackConfig.mode !== 'production';

  const { rules } = webpackConfig.module;

  // compatible w/ webpack 4 and 5
  const ruleIndex = rules.findIndex((rule) => Array.isArray(rule.oneOf));
  const rule = rules[ruleIndex];

  // default localIdentName
  let localIdentName = __DEV__ ? '[local]--[hash:4]' : '[hash:8]';

  if (pluginOptions?.cssLoaderOptions?.modules?.localIdentName) {
    localIdentName = pluginOptions.cssLoaderOptions.modules.localIdentName;
  }

  //
  //
  //
  // ---- cssModule ----

  // delete default `getLocalIdent` and set `localIdentName`
  const cssModuleRegx = '/\\.module\\.css$/';
  const cssModuleIndex = rule.oneOf.findIndex(
    (item) => `${item.test}` === cssModuleRegx,
  );
  const cssModule = rule.oneOf[cssModuleIndex];
  const cssLoaderInCssModule = cssModule.use.find((item) =>
    `${item.loader}`.includes('css-loader'),
  );

  cssLoaderInCssModule.options = {
    ...cssLoaderInCssModule.options,
    ...pluginOptions?.cssLoaderOptions,
  }

  cssLoaderInCssModule.options.modules = {
    ...cssLoaderInCssModule.options.modules,
    ...pluginOptions?.cssLoaderOptions?.modules,
    localIdentName,
    getLocalIdent: undefined,
  }

  delete cssLoaderInCssModule.options.modules.getLocalIdent;

  //
  //
  //
  // ---- lessModule (from the sassModule clone) ----

  // find
  const sassModuleRegx = '/\\.module\\.(scss|sass)$/';
  const sassModuleIndex = rule.oneOf.findIndex(
    (item) => `${item.test}` === sassModuleRegx,
  );
  const sassModule = rule.oneOf[sassModuleIndex];

  // for lessModule importLoaders
  const cssLoaderInSassModule = sassModule.use.find((item) =>
    `${item.loader}`.includes('css-loader'),
  );

  // clone
  const lessModule = clone(sassModule);
  lessModule.test = /\.less$/;
  delete lessModule.issuer;

  // overwrite
  const lessModuleIndex = lessModule.use.findIndex((item) =>
    `${item.loader}`.includes('sass-loader'),
  );

  // merge lessModule options
  const lessModuleOptions = {
    lessOptions: {
      javascriptEnabled: true,
      //
      // Tips: Read the CONSTANTS e.g. `{ '@THEME--DARK': 'theme-dark' }`
      // Hot Reload is **NOT Supported**
      // but is useful for some constant constants
      modifyVars: pluginOptions.modifyVars,
    },
    //
    // Tips: Read the variables e.g. `./styles/antd.less`
    // Hot Reload is **Supported**
    // but some var are not supported, e.g. `:global(.@{THEME--DARK})`
    additionalData: (content) => {
      const lessVarsFile = path.resolve(pluginOptions.lessVarsFilePath);

      if (fs.existsSync(lessVarsFile)) {
        return `@import '${lessVarsFile}'; \n ${content}`;
      }

      return content;
    },
    ...pluginOptions.lessLoaderOptions,
  };

  // console.log('🟡  lessModuleOptions', lessModuleOptions, '\n');

  lessModule.use.splice(lessModuleIndex, 1, {
    // https://github.com/webpack-contrib/less-loader#options
    loader: 'less-loader',
    options: lessModuleOptions,
  });

  //
  //
  //
  // ---- cssLoader In LessModule ----

  // find
  const cssLoaderInLessModuleIndex = lessModule.use.findIndex((item) =>
    `${item.loader}`.includes('css-loader'),
  );

  // clone
  const cssLoaderClone = clone(cssLoaderInCssModule);

  // merge CssModule options
  cssLoaderClone.options = {
    ...cssLoaderClone.options,
    importLoaders: cssLoaderInSassModule?.options?.importLoaders + 1,
    sourceMap: Boolean(__DEV__),
    ...pluginOptions.cssLoaderOptions,
    //
    modules: {
      // Inherited from Raw NextJs cssModule
      ...cssLoaderClone.options.modules,
      //
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
      //
      // recommended to keep `true`!
      auto: true,
      //
      // Inherited from pluginOptions
      ...pluginOptions.cssLoaderOptions?.modules,
    },
  };

  // console.log('🟢  cssModuleOptions', cssLoaderClone.options, '\n');

  // overwrite
  lessModule.use.splice(cssLoaderInLessModuleIndex, 1, cssLoaderClone);

  //
  //
  //
  // ---- append lessModule to webpack modules ----
  rule.oneOf.splice(sassModuleIndex + 1, 0, lessModule);
  webpackConfig.module.rules[ruleIndex] = rule;

  //
  //
  //
  // ---- handleAntdInServer (ONLY Next.js) ----
  if (isNextJs) {
    webpackConfig = handleAntdInServer(webpackConfig, nextConfig);

    if (typeof pluginOptions.webpack === 'function')
      return pluginOptions.webpack(webpackConfig, nextConfig);
  }

  // console.log('🟣  webpackConfig.module.rules');
  // console.dir(webpackConfig.module.rules, { depth: null });

  return webpackConfig;
}

/**
 * handleAntdInServer
 *
 * @param webpackConfig
 * @param nextConfig
 * @returns {*}
 */
function handleAntdInServer(webpackConfig, nextConfig) {
  if (!nextConfig.isServer) return webpackConfig;

  const ANTD_STYLE_REGX = /antd\/.*?\/style.*?/;
  const rawExternals = [...webpackConfig.externals];

  webpackConfig.externals = [
    (context, request, callback) => {
      if (request.match(ANTD_STYLE_REGX)) return callback();

      if (typeof rawExternals[0] === 'function')
        rawExternals[0](context, request, callback);
      else callback();
    },
    ...(typeof rawExternals[0] === 'function' ? [] : rawExternals),
  ];

  webpackConfig.module.rules.unshift({
    test: ANTD_STYLE_REGX,
    use: 'null-loader',
  });

  return webpackConfig;
}

module.exports = {
  overrideWebpackConfig,
  handleAntdInServer,
};
