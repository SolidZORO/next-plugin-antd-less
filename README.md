# Next.js + Antd (with Less)

[![version][npm-img]][npm-url]
[![license][mit-img]][mit-url]
[![size][size-img]][size-url]
[![download][download-img]][download-url]

Use [Antd] (Less) w/ [Next.js], Zero Dependency on other Next-Plugins.


## Demo

[Demo w/ Next.js v12](https://mkn.vercel.app/) by [mkn](https://github.com/SolidZORO/mkn)

[Demo w/ CRA v5](https://mkr.vercel.app/) by [mkr](https://github.com/SolidZORO/mkr)

Yep! this plugin supports both [Next.js] and [CRA] since v1.0.


## Features

- Zero Dependency on other [Next.js] Plugins
- Support Both [Next.js] & [CRA] Project
- Support Hot-Update After modifying [Antd] less vars
- Support Serverless Mode
- Support Antd Pro

## Compatibility

- Next.js v11 / v12
- CRA v4 / v5


## Installation

```sh
yarn add next-plugin-antd-less
yarn add --dev babel-plugin-import
```


## Usage

### for [Next.js]

```js
// next.config.js
const withAntdLess = require('next-plugin-antd-less');

module.exports = withAntdLess({
  modifyVars: { '@primary-color': '#04f' }, // optional
  lessVarsFilePath: './src/styles/variables.less', // optional 
  lessVarsFilePathAppendToEndOfContent: false, // optional
  // optional https://github.com/webpack-contrib/css-loader#object
  cssLoaderOptions: {
    // ... 
    mode: "local",
    localIdentName: __DEV__ ? "[local]--[hash:base64:4]" : "[hash:base64:8]", // invalid! for Unify getLocalIdent (Next.js / CRA), Cannot set it, but you can rewritten getLocalIdentFn
    exportLocalsConvention: "camelCase",
    exportOnlyLocals: false,
    // ...
    getLocalIdent: (context, localIdentName, localName, options) => {
      return "whatever_random_class_name";
    },
  },

  // for Next.js ONLY
  nextjs: {
    localIdentNameFollowDev: true, // default false, for easy to debug on PROD mode
  },

  // Other Config Here...

  webpack(config) {
    return config;
  },

  // ONLY for Next.js 10, if you use Next.js 11, delete this block
  future: {
    webpack5: true,
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

Detailed config can be found in [`next.config.js`](https://github.com/SolidZORO/mkn/blob/master/next.config.js)
file.

### for [CRA] / [CRA-Co]

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
        cssLoaderOptions: {
          localIdentName: __DEV__ ? "[local]--[hash:base64:4]" : "[hash:base64:8]",
        },
      },
    },
  ],
};
```

Detailed config can be found in [`craco.config.js`](https://github.com/SolidZORO/mkr/blob/master/scripts/craco/craco-plugin--less.js)
file.


## FAQ

### Reference Project?

If you have any problem, please check [mkn](https://github.com/SolidZORO/mkn) (Next.js)
and [mkr](https://github.com/SolidZORO/mkr) (CRA) first, I update these two repo's every time I update this plugin.

### Default ClassName

| MODE      | className                  | e.g.                  |
| --------- |----------------------------|-----------------------|
| DEV       | `[local]--[hash:base64:4]` | `comp-wrapper--2Rra ` |
| PROD      | `[hash:base64:8]`          | `2Rra8Ryx`            |

for Unify getLocalIdent (Next.js / CRA), Cannot set it, but you can rewritten getLocalIdentFn


### localIdentName is invalid? How to rewritten?

you can defind your own `localIdentName` in `pluginOptions.cssLoaderOptions.modules.getLocalIdent`

```javascript
  options: {
  lessVarsFilePath: './src/styles/variables.less'
  // ...
  // https://github.com/webpack-contrib/css-loader/tree/b7a84414fb3f6e6ff413cbbb7004fa74a78da331#getlocalident
  //
  // and you can see file 
  // https://github.com/SolidZORO/next-plugin-antd-less/getCssModuleLocalIdent.js
  getLocalIdent: (context, _, exportName, options) => {
    return 'whatever_random_class_name';
  }
  // ...
}
```

### How to import global `CSS` style (e.g. styles.css)?

```tsx
// ./page/_app.tsx
//
// use `import` or `require` syntax,
import './styles.css';
```

### How to import global `Less` style (e.g. styles.less)?

```tsx
// ./page/_app.tsx
//
// use `require` syntax,
require('./styles.less');
```

### How to overwrite `antd` less variables?

```less
// ./src/styles/variables.less
@import '~antd/lib/style/themes/default.less'; // <-- you need to import antd variables once in your project

@primary-color: #04f; // change antd primary-color
```


```js
// 🔰️ Tips: if your use babel import plugin and set `libraryDirectory`, please keep `libraryDirectory` and `less path` consistent.

// lib
['import', { libraryName: 'antd', libraryDirectory: 'lib', style: true }]
// `@import '~antd/lib/style/themes/default.less';` <-- use `lib`

// es
  ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]
// --> `@import '~antd/es/style/themes/default.less';` <-- use `es`
```


```js
// plugin options
lessVarsFilePath: './src/styles/variables.less'
```

@seeMore issues [#36](https://github.com/SolidZORO/next-plugin-antd-less/issues/36), [#74](https://github.com/SolidZORO/next-plugin-antd-less/issues/74)


## Background

### Issues

Since Next.js 9.3 supports `sass` and `css` by default, but does not support `less`. If you use Next.js > `9.3` and use the official less plugin, you will definitely encounter the following problems.

1. CIL Warning `Warning: Built-in CSS support is being disabled due to custom CSS configuration being detected.`

2. Does not support automatic recognition of css modules, e.g. `a.module.less`
   and `a.less`

### Solution

1. Find sassModule and copy onec and replace the `sass-loader` inside with `less-loader`.

2. Then enable the `modules.auto` option of `css-loader`. This can simply match all `*.less` (no need to match it is `*.module.less` or `*.less`), and hand it over to `css-loader`.

This is the lowest cost way, And CLI will no longer show this disgusting warning. The important thing is that there is **Zero Dependency on other Next-Plugins.**.


## License

MIT © [Jason Feng][author-url]

<!-- links -->

[Next.js]: https://nextjs.org/

[Antd]: https://github.com/ant-design/ant-design/

[CRA]: https://create-react-app.dev/

[CRA-co]: https://github.com/gsoft-inc/craco

<!-- badges -->

[author-url]: https://github.com/SolidZORO

[mit-img]: https://img.shields.io/npm/l/next-plugin-antd-less.svg?style=flat&colorA=000000&colorB=000000

[mit-url]: ./LICENSE


[npm-img]: https://img.shields.io/npm/v/next-plugin-antd-less?style=flat&colorA=000000&colorB=000000

[npm-url]: https://www.npmjs.com/package/next-plugin-antd-less


[size-img]: https://img.shields.io/bundlephobia/minzip/next-plugin-antd-less?label=bundle&style=flat&colorA=000000&colorB=000000

[size-url]: https://www.npmjs.com/package/next-plugin-antd-less


[download-img]: https://img.shields.io/npm/dt/next-plugin-antd-less.svg?style=flat&colorA=000000&colorB=000000

[download-url]: https://www.npmjs.com/package/next-plugin-antd-less


[build-img]: https://img.shields.io/github/workflow/status/SolidZORO/next-plugin-antd-less/Lint?style=flat&colorA=000000&colorB=000000

[build-url]: https://github.com/SolidZORO/next-plugin-antd-less/actions

