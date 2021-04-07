# Next.js + Antd (with Less)

<!--
[![Build Status][build-img]][build-url]
-->
[![NPM version][npm-img]][npm-url]
[![License: MIT][mit-img]][mit-url]

Use [Antd] (with Less) with [Next.js], Zero Dependency on other Next-Plugins.

Support **Hot Update** style after modifying Antd less variables since 1.0.

## Demo

📌 [Demo 1 - w/ Next.js v10](https://mkn.vercel.app/)

📌 [Demo 2 - w/ CRA-Co v4](https://mkr.vercel.app/)

Yep! this plugin supports both Next.js and [CRA-Co] since v1.0.

## Introduction

### Issues

Since Next.js 9.3 supports `sass` and `css` by default, but does not
support `less`. If you use Next.js > `9.3` and use the official less plugin, you
will definitely encounter the following problems.

1. CIL
   Warning `Warning: Built-in CSS support is being disabled due to custom CSS configuration being detected.`

2. Does not support automatic recognition of css modules, e.g. `a.module.less`
   and `a.less`

### Solution

1. Find sassModule and copy onec and replace the `sass-loader` inside
   with `less-loader`.

2. Then enable the `modules.auto` option of `css-loader`. This can simply match
   all `*.less` (no need to match it is `*.module.less` or `*.less`), and hand
   it over to `css-loader`.

This is the lowest cost way, And CLI will no longer show this disgusting
warning. The important thing is that there is **Zero Dependency on other
Next-Plugins.**.

## Compatibility

- next `v9.3` ~ `v10.1+` (webpack4)
- less `v3.0` ~ `v4.0+`

## Installation

```sh
yarn add next-plugin-antd-less
```

## Usage

### for Next.js

```js
// next.config.js
const withAntdLess = require('next-plugin-antd-less');

module.exports = withAntdLess({
  // optional
  modifyVars: { '@primary-color': '#04f' },
  // optional
  lessVarsFilePath: './src/styles/variables.less',
  // optional https://github.com/webpack-contrib/css-loader#object
  cssLoaderOptions: {},

  // Other Config Here...

  webpack(config) {
    return config;
  },
});
```

Add a `.babelrc.js`

```js
// .babelrc.js
module.exports = {
  presets: [['next/babel']],
  plugins: [['import', { libraryName: 'antd', style: true }]],
};
```

Detailed config can be found
in [`next.config.js`](https://github.com/SolidZORO/mkn/blob/master/next.config.js)
file.

### for CRA-Co

```js
const cracoPluginLess = require('next-plugin-antd-less/overrideWebpackConfig');

module.exports = {
  babel: cracoBabel,
  plugins: [
    cracoPluginAnalyze,
    {
      plugin: cracoPluginLess,
      options: {
        modifyVars: {
          '@THEME--DARK': 'theme-dark',
        },
        lessVarsFilePath: './src/styles/variables.less',
      },
    },
  ],
};
```

Detailed config can be found
in [`craco.config.js`](https://github.com/SolidZORO/mkr/blob/master/craco.config.js)
file.

## Tips

- If you need to import the global CSS (e.g. styles.css), you can write
  in `_app.tsx`,

```tsx
// ./page/_app.tsx
import './styles.css';
```

- If you need to import the global Less (e.g. styles.less), you can
  use `require` syntax,

```tsx
// ./page/index.tsx
require('./styles.less');
```

- If you want to override `antd` vars, make sure that antd's `default.less'` is
  referenced at least once in the project's less
  file. [issues #36](https://github.com/SolidZORO/next-plugin-antd-less/issues/36)

```less
@import '~antd/lib/style/themes/default.less';

@primary-color: #04f;

.xyz {
  font-size: 100%;
}
```

## License

© [MIT][mit-url]

<!-- links -->

[Next.js]: https://nextjs.org/

[Antd]: https://github.com/ant-design/ant-design/

[CRA-Co]: https://github.com/gsoft-inc/craco

<!-- badges -->

[mit-img]: https://img.shields.io/badge/License-MIT-blue.svg

[mit-url]: ./LICENSE

[npm-img]: https://img.shields.io/npm/v/next-plugin-antd-less.svg

[npm-url]: https://www.npmjs.com/package/next-plugin-antd-less

[build-img]: https://github.com/SolidZORO/next-plugin-antd-less/workflows/badge.svg

[build-url]: https://github.com/SolidZORO/next-plugin-antd-less/actions
