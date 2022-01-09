// file fork by https://github.com/vercel/next.js/blob/283af4e69bd86e108ae712cbf6921e3f143b40f1/packages/next/build/webpack/config/blocks/css/loaders/getCssModuleLocalIdent.ts
const loaderUtils = require('loader-utils');
const path = require('path');

// ### Default ClassName
//
// | MODE      | className                  | e.g.                  |
// | --------- |----------------------------|-----------------------|
// | DEV       | `[local]--[hash:base64:4]` | `comp-wrapper--2Rra ` |
// | PROD      | `[hash:base64:8]`          | `2Rra8Ryx`            |

function getCssModuleLocalIdentForNextJs(
  context,
  _,
  exportName,
  options,
  __DEV__,
  localIdentNameFollowDev,
) {
  const relativePath = path
    .relative(context.rootContext, context.resourcePath)
    .replace(/\\+/g, '/');

  // Generate a hash to make the class name unique.
  const hash = loaderUtils.getHashDigest(
    Buffer.from(`filePath:${relativePath}#className:${exportName}`),
    'md5',
    'base64',
    __DEV__ || localIdentNameFollowDev ? 4 : 8,
  );

  // Have webpack interpolate the `[folder]` or `[name]` to its real value.
  return (
    loaderUtils
      .interpolateName(
        context,
        // RAW name, e.g. style_nav-liist___up0
        // fileNameOrFolder + '_' + exportName + '__' + hash,
        //
        // I remove fileNameOrFolder in here
        // like `css-loader` default localIdentName
        //
        __DEV__ || localIdentNameFollowDev ? `${exportName}--${hash}` : hash,
        options,
      )
      .replace(
        // Webpack name interpolation returns `about.module_root__2oFM9` for
        // `.root {}` inside a file named `about.module.css`. Let's simplify
        // this.
        /\.module_/,
        '_',
      )
      // Replace invalid symbols with underscores instead of escaping
      // https://mathiasbynens.be/notes/css-escapes#identifiers-strings
      .replace(/[^a-zA-Z0-9-_]/g, '_')
      // "they cannot start with a digit, two hyphens, or a hyphen followed by a digit [sic]"
      // https://www.w3.org/TR/CSS21/syndata.html#characters
      .replace(/^(\d|--|-\d)/, '__$1')
  );
}

module.exports = {
  getCssModuleLocalIdentForNextJs,
  loaderUtils,
};
