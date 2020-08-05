/* eslint-disable no-param-reassign, consistent-return, no-restricted-syntax */
const clone = require('clone');
const fs = require('fs');
const lessToJS = require('less-vars-to-js');

// fix: prevents error when .less files are required by node
if (typeof require !== 'undefined') require.extensions['.less'] = () => {};

/*
 * @ideaTips
 *
 *
 *
 * */
module.exports = (
  nextConfig = {
    // https://github.com/webpack-contrib/css-loader#object
    // modules: {
    //   compileType: 'module',
    //   mode: 'local',
    //   auto: true,
    //   exportGlobals: true,
    //   localIdentName: '[path][name]__[local]--[hash:base64:5]',
    //   context: path.resolve(__dirname, 'src'),
    //   localIdentHashPrefix: 'my-custom-hash',
    //   namedExport: true,
    //   exportLocalsConvention: 'camelCase',
    //   exportOnlyLocals: false,
    // },
    cssLoaderOptionsModules: {},
    lessVarsFilePath: '',
  },
) => {
  const modifyVars = nextConfig.lessVarsFilePath
    ? lessToJS(fs.readFileSync(nextConfig.lessVarsFilePath, 'utf8'))
    : undefined;

  return {
    ...nextConfig,
    webpack(config, options) {
      if (!options.defaultLoaders) {
        throw new Error(
          'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade',
        );
      }

      const { dev } = options;
      const { rules } = config.module;

      // -- module --

      // find
      const sassModuleRegx = '/\\.module\\.(scss|sass)$/';
      const sassModuleIndex = rules[1].oneOf.findIndex((item) => `${item.test}` === sassModuleRegx);
      const sassModule = rules[1].oneOf.find((item) => `${item.test}` === sassModuleRegx);

      // clone
      const lessModule = clone(sassModule);
      lessModule.test = /\.less$/;
      delete lessModule.issuer;

      // replace
      const lessLoaderIndex = lessModule.use.findIndex((item) => `${item.loader}`.includes('sass-loader'));
      lessModule.use.splice(lessLoaderIndex, 1, {
        loader: 'less-loader',
        options: {
          lessOptions: {
            javascriptEnabled: true,
            modifyVars,
          },
        },
      });

      // -- loader --

      // find
      const lessMCssLoaderIndex = lessModule.use.findIndex((item) => `${item.loader}`.includes('css-loader'));
      const lessMCssLoader = lessModule.use.find((item) => `${item.loader}`.includes('css-loader'));

      // clone
      const nextCssLoader = clone(lessMCssLoader);
      nextCssLoader.options.modules = {
        auto: true,
        exportGlobals: true,
        localIdentName: dev ? '[local]--[hash:4]' : '[hash:4]',
        ...nextConfig.cssLoaderOptionsModules,
      };

      // replace
      lessModule.use.splice(lessMCssLoaderIndex, 1, nextCssLoader);

      // webpack modules
      rules[1].oneOf.splice(sassModuleIndex, 1, lessModule);
      config.module.rules = rules;

      config = handleAntdInServer(config, options);

      if (typeof nextConfig.webpack === 'function') return nextConfig.webpack(config, options);

      return config;
    },
  };
};

function handleAntdInServer(config, options) {
  if (!options.isServer) return config;

  const ANTD_STYLE_REGX = /antd\/.*?\/style.*?/;
  const rawExternals = [...config.externals];

  config.externals = [
    (context, request, callback) => {
      if (request.match(ANTD_STYLE_REGX)) return callback();

      if (typeof rawExternals[0] === 'function') rawExternals[0](context, request, callback);
      else callback();
    },
    ...(typeof rawExternals[0] === 'function' ? [] : rawExternals),
  ];

  config.module.rules.unshift({ test: ANTD_STYLE_REGX, use: 'null-loader' });

  return config;
}
