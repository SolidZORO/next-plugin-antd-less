# Next.js + Antd

<!--
[![Build Status][build-img]][build-url]
-->
[![NPM version][npm-img]][npm-url]
[![License: MIT][mit-img]][mit-url]

Use [Antd] (with Less) with [Next.js], Zero Dependency on other Next-Plugins.

## Background

### Since Next.js 9.3 supports `sass` and `css` by default, but does not support `less`.

If you use Next.js > `9.3` and use the official less plugin, you will definitely encounter the following problems.

1. CIL Warning `Warning: Built-in CSS support is being disabled due to custom CSS configuration being detected.`

2. Does not support automatic recognition of css modules, e.g. `a.module.less` and `a.less`

 
### To solve the above problems, my idea is very simple.

1. Find sassModule and copy onec and replace the `sass-loader` inside with `less-loader`. 

2. Then enable the `modules.auto` option of `css-loader`. This can simply match all `*.less` (no need to match it is `*.module.less` or `*.less`), and hand it over to `css-loader`.

This is the lowest cost way, And CLI will no longer show this disgusting warning. The important thing is that there is **Zero Dependency on other Next-Plugins.**.



## Compatibility

Support Next.js `v10` 

📌 [Online Demo](https://mkn.vercel.app/)

## Installation

```sh
yarn add next-plugin-antd-less
```
or
```sh
npm i next-plugin-antd-less
```

## Usage

```js
// next.config.js
const withAntdLess = require('next-plugin-antd-less');

module.exports = withAntdLess({
  lessVarsFilePath: './src/styles/variables.less',
  cssLoaderOptions: {
  //   https://github.com/webpack-contrib/css-loader#object
  //
  //   sourceMap: true, // default false
  //   esModule: false, // default false
  //   modules: {
  //     exportLocalsConvention: 'asIs',
  //     exportOnlyLocals: true,
  //     mode: 'pure',
  //     getLocalIdent: [Function: getCssModuleLocalIdent]
  //   }
  },
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
  presets: [
    ['next/babel'],
  ],
  plugins: [
    [
      'import',
      {
        libraryName: 'antd',
        style: true,
      },
    ],
  ],
};
```


## Tips

- If you need to import the global CSS (e.g. styles.css), you can write in `_app.tsx`,
```tsx
// ./page/_app.tsx
import './styles.css';
```

- If you need to import the global Less (e.g. styles.less), you can use `require` syntax,
```tsx
// ./page/index.tsx
require('./styles.less');
```


## License

[MIT][mit-url]

<!-- links -->

[Next.js]: https://nextjs.org/
[Antd]: https://github.com/ant-design/ant-design/

<!-- badges -->

[mit-img]: https://img.shields.io/badge/License-MIT-blue.svg
[mit-url]: ./LICENSE
[npm-img]: https://img.shields.io/npm/v/next-plugin-antd-less.svg
[npm-url]: https://www.npmjs.com/package/next-plugin-antd-less

[build-img]: https://github.com/SolidZORO/next-plugin-antd-less/workflows/badge.svg
[build-url]: https://github.com/SolidZORO/next-plugin-antd-less/actions
