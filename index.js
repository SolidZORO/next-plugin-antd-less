/* eslint-disable no-param-reassign, consistent-return, no-restricted-syntax */
const { overrideWebpackConfig } = require('./overrideWebpackConfig');

// fix: prevents error when .less files are required by node
if (require && require.extensions) {
  require.extensions['.less'] = () => {
  };
}

module.exports = (
  pluginOptions = {
    // optional
    modifyVars: undefined,
    // optional
    lessVarsFilePath: undefined,
    // optional
    lessVarsFilePathAppendToEndOfContent: undefined,
    //
    // optional / https://github.com/webpack-contrib/css-loader#object
    cssLoaderOptions: {
      esModule: false,
      sourceMap: false,
      modules: {
        mode: 'local',
      },
    },
    // optional / https://github.com/webpack-contrib/less-loader#options
    lessLoaderOptions: undefined,
  },
) => {
  return {
    ...pluginOptions,
    webpack(webpackConfig, nextConfig) {
      return overrideWebpackConfig({
        webpackConfig,
        nextConfig,
        pluginOptions
      });
    }
  };
};
