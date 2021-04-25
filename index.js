/* eslint-disable no-param-reassign, consistent-return, no-restricted-syntax */
const { overrideWebpackConfig } = require('./overrideWebpackConfig');

// fix: prevents error when .less files are required by node
if (require && require.extensions) {
  require.extensions['.less'] = () => {};
}

module.exports = (
  pluginOptions = {
    // optional
    modifyVars: {},
    // optional
    lessVarsFilePath: undefined,
    //
    // optional / https://github.com/webpack-contrib/css-loader#object
    cssLoaderOptions: {},
    // optional / https://github.com/webpack-contrib/less-loader#options
    lessLoaderOptions: {},
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
