# Next.js + Custom component library (with Less)

Support custom component library (Less) with Next.js v12，folked from [next-plugin-antd-less](https://github.com/SolidZORO/next-plugin-antd-less) v1.8.0

## Installation

```sh
yarn add next-plugin-component-less
yarn add --dev babel-plugin-import
```

## Usage

### for [Next.js]

```js
// next.config.js
const withAntdLess = require('next-plugin-component-less')({STYLE_REGX: /(antd\/.*?\/style|@ant-design|@custom-fe\/.*?).*(?<![.]js)$/});

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
  plugins: [[
      "import",
      {
        "libraryName": "antd",
        "style": true
      },
      "antd"
    ],
    [
      "import",
      {
        "libraryName": "@custom-fe/component",
        "libraryDirectory": "lib",
        "style": true,
        "camel2DashComponentName": false
      },
      "custom-fe-component"
    ]],
};
```

Detailed config can be found in [`next.config.js`](https://github.com/SolidZORO/mkn/blob/master/next.config.js)
file.
