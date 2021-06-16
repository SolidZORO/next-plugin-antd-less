/* eslint-disable no-param-reassign, consistent-return, no-restricted-syntax */
const clone = require('clone');
const fs = require('fs');
const path = require('path');

// fix: prevents error when .less files are required by node
if (require && require.extensions) {
  require.extensions['.less'] = () => {};
}

/**
 * checkIsNextJs
 *
 * @param webpackConfig
 * @returns {boolean}
 */
function checkIsNextJs(webpackConfig) {
  return Boolean(
    webpackConfig &&
      webpackConfig.resolveLoader &&
      webpackConfig.resolveLoader.alias &&
      webpackConfig.resolveLoader.alias['next-babel-loader'],
  );
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

  if (
    pluginOptions &&
    pluginOptions.cssLoaderOptions &&
    pluginOptions.cssLoaderOptions.modules &&
    pluginOptions.cssLoaderOptions.modules.localIdentName
  ) {
    localIdentName = pluginOptions.cssLoaderOptions.modules.localIdentName;
  }

  //
  //
  //
  // ---- cssModule ----
  //
  // delete default `getLocalIdent` and set `localIdentName`
  const cssModuleRegx = '/\\.module\\.css$/';
  const cssModuleIndex = rule.oneOf.findIndex(
    (item) => `${item.test}` === cssModuleRegx,
  );
  const cssModule = rule.oneOf[cssModuleIndex];
  const cssLoaderInCssModule = cssModule.use.find((item) =>
    `${item.loader}`.includes('css-loader'),
  );

  if (pluginOptions.cssLoaderOptions) {
    cssLoaderInCssModule.options = {
      ...cssLoaderInCssModule.options,
      ...pluginOptions.cssLoaderOptions,
    };
  }

  if (
    pluginOptions.cssLoaderOptions &&
    pluginOptions.cssLoaderOptions.modules
  ) {
    cssLoaderInCssModule.options.modules = {
      ...cssLoaderInCssModule.options.modules,
      ...pluginOptions.cssLoaderOptions.modules,
    };
  }

  //
  //
  //
  // ---- lessModule (from the sassModule clone) ----
  //
  // find
  const sassModuleRegx = '/\\.module\\.(scss|sass)$/';
  const sassModuleIndex = rule.oneOf.findIndex(
    (item) => `${item.test}` === sassModuleRegx,
  );
  const sassModule = rule.oneOf[sassModuleIndex];

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
    },
    ...pluginOptions.lessLoaderOptions,
  };

  //
  //
  //
  // ---- file-loader supported *.less ----
  //
  // url()s fail to load files
  // https://github.com/SolidZORO/next-plugin-antd-less/issues/39
  //
  // find
  const fileModuleIndex = rule.oneOf.findIndex((item) => {
    if (
      item.use &&
      item.use.loader &&
      item.use.loader.includes('/file-loader/')
    ) {
      return item;
    }
  });

  const fileModule = rule.oneOf[fileModuleIndex];

  if (fileModule) {
    // RAW ---> issuer: /\.(css|scss|sass)$/,
    fileModule.issuer = /\.(css|scss|sass|less)$/;
  }

  /*
  |--------------------------------------------------------------------------
  | modifyVars (Hot Reload is **NOT Supported**, NEED restart webpack)
  |--------------------------------------------------------------------------
  |
  | CONSTANTS --> e.g. `@THEME--DARK: 'theme-dark';`
  |                    `:global(.@{THEME--DARK}) { color: red }`
  |
  */
  let modifyVars = undefined;

  if (pluginOptions.modifyVars) {
    modifyVars = pluginOptions.modifyVars;
  }

  if (pluginOptions.modifyVars) {
    lessModuleOptions.lessOptions.modifyVars = modifyVars;
  }

  /*
  |--------------------------------------------------------------------------
  | lessVarsFilePath (Hot Reload is **Supported**, can overwrite `antd` vars)
  |--------------------------------------------------------------------------
  |
  | variables file --> e.g. `./styles/variables.less`
  |                         `@primary-color: #04f;`
  |
  */
  if (pluginOptions.lessVarsFilePath) {
    lessModuleOptions.additionalData = (content) => {
      const lessVarsFileResolvePath = path.resolve(
        pluginOptions.lessVarsFilePath,
      );

      if (fs.existsSync(lessVarsFileResolvePath)) {
        const importLessLine = `@import '${lessVarsFileResolvePath}';`;

        // https://github.com/SolidZORO/next-plugin-antd-less/issues/40
        if (pluginOptions.lessVarsFilePathAppendToEndOfContent) {
          content = `${content}\n\n${importLessLine};`;
        } else {
          content = `${importLessLine};\n\n${content}`;
        }

        // console.log(content);
      }

      return content;
    };
  }

  // console.log('🟡  lessModuleOptions', '\n');
  // console.dir(lessModuleOptions, { depth: null });

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
  const cssLoaderInLessModule = lessModule.use.find((item) =>
    `${item.loader}`.includes('css-loader'),
  );

  // clone
  const cssLoaderClone = clone(cssLoaderInLessModule);

  if (
    cssLoaderClone &&
    cssLoaderClone.options &&
    cssLoaderClone.options.modules &&
    cssLoaderClone.options.modules.getLocalIdent
  ) {
    // make the custom `localIdentName` work
    delete cssLoaderClone.options.modules.getLocalIdent;
  }

  // merge CssModule options
  cssLoaderClone.options = {
    ...cssLoaderClone.options,
    sourceMap: Boolean(__DEV__),
    ...pluginOptions.cssLoaderOptions,
    //
    modules: {
      localIdentName,
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
      // Inherited from pluginOptions
      ...(pluginOptions.cssLoaderOptions || {}).modules,
      //
      // recommended to keep `true`!
      auto: true,
    },
  };

  // console.log('🟢  cssModuleOptions', '\n');
  // console.dir(cssLoaderClone.options, { depth: null });

  // overwrite
  lessModule.use.splice(cssLoaderInLessModuleIndex, 1, cssLoaderClone);

  //
  //
  //
  // ---- append lessModule to webpack modules ----
  rule.oneOf.splice(sassModuleIndex, 0, lessModule);
  webpackConfig.module.rules[ruleIndex] = rule;

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
 * isWebpack5
 *
 * @param nextConfig
 * @returns {boolean}
 */
function isWebpack5(nextConfig) {
  return typeof nextConfig.webpack.version === 'string' && nextConfig.webpack.version.startsWith('5');
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

  const ANTD_STYLE_REGX = /(antd\/.*?\/style).*(?<![.]js)$/;
  const exts = [...webpackConfig.externals];

  webpackConfig.externals =
    isWebpack5(nextConfig)
      ? [
          // ctx and cb are both webpack5's params
          // ctx eqauls { context, request, contextInfo, getResolve }
          // https://webpack.js.org/configuration/externals/#function
          (ctx, cb) => {
            if (ctx.request.match(ANTD_STYLE_REGX)) return cb();

            // next's params are different when webpack5 enable
            // https://github.com/vercel/next.js/blob/0425763ed6a90f4ff99ab2ff37821da61d895e09/packages/next/build/webpack-config.ts#L770
            if (typeof exts[0] === 'function') return exts[0](ctx, cb);
            else return cb();
          },
          ...(typeof exts[0] === 'function' ? [] : exts),
        ]
      : [
          // webpack4
          (ctx, req, cb) => {
            if (req.match(ANTD_STYLE_REGX)) return cb();

            if (typeof exts[0] === 'function') return exts[0](ctx, req, cb);
            else return cb();
          },
          ...(typeof exts[0] === 'function' ? [] : exts),
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
