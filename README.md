# Next.js + Custom component library (with Less)

Support custom component library (Less) with Next.js v12，folked from [next-plugin-antd-less](https://github.com/SolidZORO/next-plugin-antd-less) v1.8.0

## Installation

```sh
yarn add next-plugin-component-less
yarn add --dev babel-plugin-import
```

## Features

- New Parameter `STYLE_REGX` Support Custom Component Library With Less

## Usage

### for [Next.js]

```js
// next.config.js
const withAntdLess = require('next-plugin-component-less');

module.exports = withAntdLess({
  STYLE_REGX: /(antd\/.*?\/style|@ant-design|@custom-fe\/.*?).*(?<![.]js)$/, // new parameter
  modifyVars: { '@primary-color': '#04f' }, // optional
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
