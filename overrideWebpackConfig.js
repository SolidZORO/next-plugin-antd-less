/* eslint-disable no-param-reassign, consistent-return, no-restricted-syntax */
const clone = require('clone');
const fs = require('fs');
const path = require('path');
// const util = require('util'); // for debugInfo()

// fix: prevents error when .less files are required by node
if (require && require.extensions) {
  require.extensions['.less'] = () => {
  };
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
    (webpackConfig.resolveLoader.alias['next-babel-loader'] ||
      webpackConfig.resolveLoader.alias['next-swc-loader']),
  );
}

/**
 * debugInfo
 *
 * @param nextConfig
 * @param colorEmoji
 * @param log
 * @returns {string}
 */
function debugInfo(nextConfig, colorEmoji, log) {
  const envText = nextConfig && nextConfig.isServer ? 'Server' : 'Client';

  return `\n\n\n\n${colorEmoji} -------- ${envText} --------\n   ${log}`;
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

  /*
  |--------------------------------------------------------------------------
  | cssModule
  |--------------------------------------------------------------------------
  |
  | delete default `getLocalIdent` and set `localIdentName`
  |
  */
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

  /*
  |--------------------------------------------------------------------------
  | lessLoader (from the sassLoader clone)
  |--------------------------------------------------------------------------
  |
  | Tips:
  | sass has  test `module` and `non-module` loader,
  | but `less-loader` has `auto: true`, so just copy onec.
  |
  */

  // find
  const sassLoaderIndex = rule.oneOf.findIndex(
    (item) => item.test.toString() === /\.module\.(scss|sass)$/.toString(),
  );
  const sassLoader = rule.oneOf[sassLoaderIndex];

  // clone
  const lessLoader = clone(sassLoader);
  lessLoader.test = /\.less$/;
  delete lessLoader.issuer;

  // overwrite
  const lessLoaderIndex = lessLoader.use.findIndex((item) =>
    `${item.loader}`.includes('sass-loader'),
  );

  // merge lessLoader options
  const lessLoaderOptions = {
    lessOptions: {
      javascriptEnabled: true,
    },
    ...pluginOptions.lessLoaderOptions,
  };

  /*
  |--------------------------------------------------------------------------
  | file-loader supported *.less
  |--------------------------------------------------------------------------
  |
  | url()s fail to load files
  | https://github.com/SolidZORO/next-plugin-antd-less/issues/39
  |
  */
  const fileLoaderIndex = rule.oneOf.findIndex((item) => {
    if (
      item.use &&
      item.use.loader &&
      item.use.loader.includes('/file-loader/')
    ) {
      return item;
    }
  });

  const fileLoader = rule.oneOf[fileLoaderIndex];

  if (fileLoader) {
    // RAW ---> issuer: /\.(css|scss|sass)$/,
    fileLoader.issuer = /\.(css|scss|sass|less)$/;
  }

  /*
  |--------------------------------------------------------------------------
  | noop-loader supported *.less (Next.js ONLY)
  |--------------------------------------------------------------------------
  |
  */
  if (isNextJs) {
    const noopLoaderIndex = rule.oneOf.findIndex((item) => {
      if (
        item &&
        item.test &&
        item.test.toString() ===
        // RAW test
        /\.(css|scss|sass)(\.webpack\[javascript\/auto\])?$/.toString()
      ) {
        return item;
      }
    });

    const noopLoader = rule.oneOf[noopLoaderIndex];

    if (noopLoader) {
      noopLoader.test =
        /\.(css|scss|sass|less)(\.webpack\[javascript\/auto\])?$/;
    }
  }

  /*
  |--------------------------------------------------------------------------
  | next-image-loader supported *.less (Next.js ONLY)
  |--------------------------------------------------------------------------
  |
  | TODO:
  |
  | Modify this to enable *.less to use background-image.
  | The
  | But I don't know why it only takes effect in dev, when prod will prompt `Error: Module parse failed: Unexpected character '�' (1:0)`.
  | This should actually be a less-loader problem, but considering that the CRA is still wp4 over there, it's too late to upgrade to wp5.
  | I'm not sure if this is a problem with CRA, but I'm not sure if it's a problem with Next.js, so I'll just leave it alone.
  | I don't know what to do. This Next.js my head is big, with the black box, just a patch version upgrade, you can make a bunch of plug-ins crash, my mind also collapsed, tired ah ......
  |
  | 修改这里就可以实现 *.less 使用 background-image 了。
  |
  | 但是不知道为什么只在 dev 生效，prod 时会提示 `Error: Module parse failed: Unexpected character '�' (1:0)`
  | 这个其实应该是 less-loader 的问题，但是考虑到 CRA 那边还是 wp4 迟迟没有升级到 wp5，
  | 且反正 Next.js 这边 prod 也会挂掉，所以干脆不处理了。
  | 妈的！弄这 Next.js 我头都大，跟黑盒似的，随便来一个 patch 版本升级，就能让一堆插件崩掉，我的心态也崩了，累啊……
  |
  */
  // if (isNextJs) {
  //   const nextImageLoaderIndex = rules.findIndex(
  //     (item) => item && item.loader && item.loader === 'next-image-loader',
  //   );
  //
  //   const nextImageLoader = rules[nextImageLoaderIndex];
  //
  //   if (nextImageLoader) {
  //     // RAW ---> issuer: { not: /\.(css|scss|sass)(\.webpack\[javascript\/auto\])?$/ },
  //     nextImageLoader.issuer = {
  //       not: /\.(css|scss|sass|less)(\.webpack\[javascript\/auto\])?$/,
  //     };
  //   }
  // }

  /*
  |--------------------------------------------------------------------------
  | ignore-loader supported *.less (Next.js Server ONLY)
  |--------------------------------------------------------------------------
  |
  */
  if (isNextJs) {
    const ignoreLoaderIndex = rule.oneOf.findIndex(
      (item) =>
        item &&
        item.use &&
        item.use.includes &&
        item.use.includes('ignore-loader'),
    );

    const ignoreLoader = rule.oneOf[ignoreLoaderIndex];

    if (ignoreLoader) {
      // RAW ---> test: [ /(?<!\.module)\.css$/, /(?<!\.module)\.(scss|sass)$/ ],
      ignoreLoader.test = [
        /(?<!\.module)\.css$/,
        /(?<!\.module)\.(scss|sass|less)$/,
      ];
    }
  }

  //
  //
  //
  //

  //
  //
  //
  //

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
    lessLoaderOptions.lessOptions.modifyVars = modifyVars;
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
    lessLoaderOptions.additionalData = (content) => {
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

  // console.log(debugInfo(nextConfig, '🟡', 'lessLoaderOptions'));
  // console.log(util.inspect(lessLoaderOptions, false, null, true));

  lessLoader.use.splice(lessLoaderIndex, 1, {
    // https://github.com/webpack-contrib/less-loader#options
    loader: 'less-loader',
    options: lessLoaderOptions,
  });

  //
  //
  //
  // ---- cssLoader In LessModule ----

  // find
  const cssLoaderInLessLoaderIndex = lessLoader.use.findIndex((item) =>
    `${item.loader}`.includes('css-loader'),
  );
  const cssLoaderInLessLoader = lessLoader.use.find((item) =>
    `${item.loader}`.includes('css-loader'),
  );

  // clone
  const cssLoaderClone = clone(cssLoaderInLessLoader);

  if (
    cssLoaderClone &&
    cssLoaderClone.options &&
    cssLoaderClone.options.modules &&
    cssLoaderClone.options.modules.getLocalIdent &&
    pluginOptions &&
    pluginOptions.cssLoaderOptions &&
    pluginOptions.cssLoaderOptions.modules &&
    pluginOptions.cssLoaderOptions.modules.getLocalIdent
  ) {
    // if use custom `localIdentName`, you need to remove the getLocalIdent Fn
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

  // console.log(debugInfo(nextConfig, '🟢', 'cssModuleOptions'));
  // console.log(util.inspect(cssLoaderClone.options, false, null, true));

  // overwrite
  lessLoader.use.splice(cssLoaderInLessLoaderIndex, 1, cssLoaderClone);

  //
  //
  //
  // ---- append lessLoader to webpack modules ----
  rule.oneOf.splice(sassLoaderIndex, 0, lessLoader);
  webpackConfig.module.rules[ruleIndex] = rule;

  //
  //
  // ---- handleAntdInServer (ONLY Next.js) ----
  if (isNextJs) {
    webpackConfig = handleAntdInServer(webpackConfig, nextConfig);

    if (typeof pluginOptions.webpack === 'function')
      return pluginOptions.webpack(webpackConfig, nextConfig);
  }

  // console.log(debugInfo(nextConfig, '🟣', 'webpackConfig.module.rules'));
  // console.log(util.inspect(webpackConfig.module.rules, false, null, true));

  return webpackConfig;
}

/**
 * isWebpack5
 *
 * @param nextConfig
 * @returns {boolean}
 */
function isWebpack5(nextConfig) {
  return (
    typeof nextConfig.webpack.version === 'string' &&
    nextConfig.webpack.version.startsWith('5')
  );
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

  const ANTD_STYLE_REGX = /(antd\/.*?\/style|@ant-design).*(?<![.]js)$/;
  const exts = [...webpackConfig.externals];

  webpackConfig.externals = isWebpack5(nextConfig)
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
