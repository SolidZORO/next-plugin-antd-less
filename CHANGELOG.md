# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.5.2](https://github.com/SolidZORO/next-plugin-antd-less/compare/v1.5.1...v1.5.2) (2021-11-01)


### Bug Fixes

* remove the optional chain, for compatible deployment to vercel ([e8b31f4](https://github.com/SolidZORO/next-plugin-antd-less/commit/e8b31f4d079634ddd468691ff706d13069ad31c1))

### [1.5.1](https://github.com/SolidZORO/next-plugin-antd-less/compare/v1.5.0...v1.5.1) (2021-11-01)

## [1.5.0](https://github.com/SolidZORO/next-plugin-antd-less/compare/v1.4.4...v1.5.0) (2021-11-01)


### Bug Fixes

* compatible with custom getLocalIdent in Next.js 12 ([a20649e](https://github.com/SolidZORO/next-plugin-antd-less/commit/a20649e10c11aae168bc8f3a759faa4f8d3ab33e))

### [1.4.4](https://github.com/SolidZORO/next-plugin-antd-less/compare/v1.4.3...v1.4.4) (2021-10-19)


### Chore

* upgrade Less to 4.1.2 thanks [@nring](https://github.com/nring)

### [1.4.3](https://github.com/SolidZORO/next-plugin-antd-less/compare/v1.4.2...v1.4.3) (2021-09-16)


### Features

* support Antd Pro thanks [@clgt](https://github.com/clgt)IO ([a849a00](https://github.com/SolidZORO/next-plugin-antd-less/commit/a849a00184e2483ac04bc4cfe1d0a3097e2baed0)), closes [#68](https://github.com/SolidZORO/next-plugin-antd-less/issues/68)

### [1.4.2](https://github.com/SolidZORO/next-plugin-antd-less/compare/v1.4.1...v1.4.2) (2021-08-23)


### Bug Fixes

* remove background-image, compatible CRA and Next.js (另外还有写在注释里的碎碎念) ([60c10de](https://github.com/SolidZORO/next-plugin-antd-less/commit/60c10de9c766ef6bf6f155771d445a4eaa4e5284))

### [1.4.1](https://github.com/SolidZORO/next-plugin-antd-less/compare/v1.4.0...v1.4.1) (2021-08-23)


### Bug Fixes

* downgrading less-loader to ^7, support CRA (^10 minimun wp5) ([2d65318](https://github.com/SolidZORO/next-plugin-antd-less/commit/2d65318ea41ea788392b8fc31ff484a12f0ede4f))

## [1.4.0](https://github.com/SolidZORO/next-plugin-antd-less/compare/v1.3.0...v1.4.0) (2021-08-22)


### Features

* add echoIsServerInfo() Fn for Debug ([9daff7c](https://github.com/SolidZORO/next-plugin-antd-less/commit/9daff7ccc06142a8915a14765ae7587eed75a1bf))
* next-image-loader supported *.less ([1860ea2](https://github.com/SolidZORO/next-plugin-antd-less/commit/1860ea236c5880d2c39f5aad248452e17f697297)), closes [#59](https://github.com/SolidZORO/next-plugin-antd-less/issues/59) [#39](https://github.com/SolidZORO/next-plugin-antd-less/issues/39)
* support *.svg with babel-plugin-inline-react-svg ([daec84b](https://github.com/SolidZORO/next-plugin-antd-less/commit/daec84beb5f1989b4a2b1f88c3a1cc60a4b94545)), closes [#72](https://github.com/SolidZORO/next-plugin-antd-less/issues/72)
* update less-loader to v10 ([9e495ae](https://github.com/SolidZORO/next-plugin-antd-less/commit/9e495ae5af906a3153b6ab730e09a7ede96574ef))


### Chore

* repository url case ([eec6538](https://github.com/SolidZORO/next-plugin-antd-less/commit/eec65382898f2b0f180b7bda62f7df7f05f67475))
* update .nvmrc version ([aa3acd2](https://github.com/SolidZORO/next-plugin-antd-less/commit/aa3acd228e502d9d772395226695dae68b094fc7))

## [1.3.0](https://github.com/solidzoro/next-plugin-antd-less/compare/v1.2.2...v1.3.0) (2021-06-16)


### Features

* support for Next.js v11 ([fbc3606](https://github.com/solidzoro/next-plugin-antd-less/commit/fbc36063d677a852ee4a4aa189fb9403aa80089b)), closes [#62](https://github.com/solidzoro/next-plugin-antd-less/issues/62)
* support next.js 11 ([0840e32](https://github.com/solidzoro/next-plugin-antd-less/commit/0840e32642dad053d6f959fd2d28953d258b5f43))


### Chore

* clear code ([a5347ff](https://github.com/solidzoro/next-plugin-antd-less/commit/a5347ffb9214f55aace056b858ac4c97d58bb779))

### [1.2.2](https://github.com/solidzoro/next-plugin-antd-less/compare/v1.2.1...v1.2.2) (2021-06-03)


### Features

* support serverless mode ([d187df8](https://github.com/solidzoro/next-plugin-antd-less/commit/d187df896e64077612e6d8b381024a817a9c65b8))

### [1.2.1](https://github.com/solidzoro/next-plugin-antd-less/compare/v1.2.0...v1.2.1) (2021-05-15)


### Features

* file-loader supported *.less, e.g. `background-image: url('img.jpg')` ([99011d4](https://github.com/solidzoro/next-plugin-antd-less/commit/99011d4cb163ae987ab425edd556a3691c0ab5e5)), closes [#39](https://github.com/solidzoro/next-plugin-antd-less/issues/39)

## [1.2.0](https://github.com/solidzoro/next-plugin-antd-less/compare/v1.1.4...v1.2.0) (2021-05-09)


### Chore

* format code by prettier config ([e300a14](https://github.com/solidzoro/next-plugin-antd-less/commit/e300a147b16ad4ca48e8becc522d225eb7c51924))

### [1.1.4](https://github.com/solidzoro/next-plugin-antd-less/compare/v1.1.3...v1.1.4) (2021-04-29)


### Bug Fixes

* Make lessVarsFilePathAppendToEndOfContent not to include twice ([138e0c3](https://github.com/solidzoro/next-plugin-antd-less/commit/138e0c315002197d534b79bba5b5409be05039d8))

### [1.1.3](https://github.com/solidzoro/next-plugin-antd-less/compare/v1.1.2...v1.1.3) (2021-04-28)


### Features

* add options `lessVarsFilePathAppendToEndOfContent` ([f42bbe2](https://github.com/solidzoro/next-plugin-antd-less/commit/f42bbe25d8be92302286ab9e26d9a73c890d8867)), closes [#40](https://github.com/solidzoro/next-plugin-antd-less/issues/40)

### [1.1.2](https://github.com/solidzoro/next-plugin-antd-less/compare/v1.1.1...v1.1.2) (2021-04-25)


### Bug Fixes

* downgrade less-loader version to ^7.0 (TypeError: this.getOptions is not a function) ([84df302](https://github.com/solidzoro/next-plugin-antd-less/commit/84df302a6357c1bfcc2abe292737c2a78250bf4a)), closes [#30](https://github.com/solidzoro/next-plugin-antd-less/issues/30)

### [1.1.1](https://github.com/solidzoro/next-plugin-antd-less/compare/v1.1.0...v1.1.1) (2021-04-25)

## [1.1.0](https://github.com/solidzoro/next-plugin-antd-less/compare/v1.0.10...v1.1.0) (2021-04-25)


### Refactor

* update less-loader to 8.0 ([a48cb89](https://github.com/solidzoro/next-plugin-antd-less/commit/a48cb890be904dcc4a63c316c731548b234b1379))

### [1.0.10](https://github.com/solidzoro/next-plugin-antd-less/compare/v1.0.9...v1.0.10) (2021-04-25)


### Refactor

* clear console.log ([68d267e](https://github.com/solidzoro/next-plugin-antd-less/commit/68d267ea81aa00bae5ad67a2901f180dc693ed2f))

### [1.0.9](https://github.com/solidzoro/next-plugin-antd-less/compare/v1.0.8...v1.0.9) (2021-04-25)


### Bug Fixes

* cannot set property '.less' of undefined ([42ba69a](https://github.com/solidzoro/next-plugin-antd-less/commit/42ba69a8db923facf7da86777d9eea947fdc561a))
* cannot set property '.less' of undefined ([8b178ac](https://github.com/solidzoro/next-plugin-antd-less/commit/8b178ac53734c74dba39da7596c29d86b4bf3366))
* fixed pluginOptions.modifyVars to be optional ([5e941f0](https://github.com/solidzoro/next-plugin-antd-less/commit/5e941f0796fe4f65a7187227a8c822ef86b05c41)), closes [#42](https://github.com/solidzoro/next-plugin-antd-less/issues/42)

### [1.0.8](https://github.com/solidzoro/next-plugin-antd-less/compare/v1.0.7...v1.0.8) (2021-04-09)


### Refactor

* close debug console.log ([3b034e5](https://github.com/solidzoro/next-plugin-antd-less/commit/3b034e5ae648d51607b9d221233bd2f35bddd6ca))

### [1.0.7](https://github.com/solidzoro/next-plugin-antd-less/compare/v1.0.6...v1.0.7) (2021-04-09)


### Bug Fixes

* fixed config localIdentName ([82fd24e](https://github.com/solidzoro/next-plugin-antd-less/commit/82fd24e1b9cf96c37b2d88427ffac44dde603bd5))

### [1.0.6](https://github.com/solidzoro/next-plugin-antd-less/compare/v1.0.5...v1.0.6) (2021-04-07)


### Bug Fixes

* fixed not options lessVarsFilePath has error ([686327c](https://github.com/solidzoro/next-plugin-antd-less/commit/686327c7528a9259828f89130fd0c97356003a9a))

### [1.0.5](https://github.com/solidzoro/next-plugin-antd-less/compare/v1.0.4...v1.0.5) (2021-04-05)


### Refactor

* remove all optional chaining, compatibility vercel deploy ([9c6886c](https://github.com/solidzoro/next-plugin-antd-less/commit/9c6886c55f14dc5f61d2217d76ca2bd4448473ef))

### [1.0.4](https://github.com/solidzoro/next-plugin-antd-less/compare/v1.0.3...v1.0.4) (2021-04-05)


### Bug Fixes

* fixed nest.js style lose ([92fa666](https://github.com/solidzoro/next-plugin-antd-less/commit/92fa6665d6397a7173b94a00b4e57f40e5f06c44))

### [1.0.3](https://github.com/solidzoro/next-plugin-antd-less/compare/v1.0.2...v1.0.3) (2021-04-05)


### Bug Fixes

* fixed localIdentName ([2f4159e](https://github.com/solidzoro/next-plugin-antd-less/commit/2f4159ec002dcaf4b7f266ab018a346d7990dbd3))

### [1.0.2](https://github.com/solidzoro/next-plugin-antd-less/compare/v1.0.1...v1.0.2) (2021-04-04)


### Chore

* remove deps less-vars-to-js ([c605968](https://github.com/solidzoro/next-plugin-antd-less/commit/c6059689780c3b365412803de5e6c6abd32c0a37))

### [1.0.1](https://github.com/solidzoro/next-plugin-antd-less/compare/v1.0.0...v1.0.1) (2021-04-04)

## [1.0.0](https://github.com/solidzoro/next-plugin-antd-less/compare/v0.3.0...v1.0.0) (2021-04-04)


### Features

* supports both Next.js and CRA-Co ([418ec5c](https://github.com/solidzoro/next-plugin-antd-less/commit/418ec5c7a57153af00cc7632fbbc21b5a8b1e7e9))


### Chore

* add Compatibility ([62d1a03](https://github.com/solidzoro/next-plugin-antd-less/commit/62d1a038fbdaaf7318117147450129fa95c8bfd6))


### Refactor

* clear variable names ([590f116](https://github.com/solidzoro/next-plugin-antd-less/commit/590f1160b93a460dec59fc5ff87e37ac6e7bb0f1))
* split overrideWebpackConfig ([aded75c](https://github.com/solidzoro/next-plugin-antd-less/commit/aded75c5658e2a462da37d302ae2566dea955d6a))

## [0.3.0](https://github.com/solidzoro/next-plugin-antd-less/compare/v0.2.2...v0.3.0) (2021-02-07)


### Bug Fixes

* downgrading to less-loader 7.3.0 resolved issue ([5cc2f20](https://github.com/solidzoro/next-plugin-antd-less/commit/5cc2f20fe0ef1bdb72a409fb198b5bfc51d949f6)), closes [#17](https://github.com/solidzoro/next-plugin-antd-less/issues/17)

### [0.2.2](https://github.com/solidzoro/next-plugin-antd-less/compare/v0.2.1...v0.2.2) (2021-02-02)


### Refactor

* config.module.rules `INDEX` compatible w/ webpack 4 and 5 ([d73be86](https://github.com/solidzoro/next-plugin-antd-less/commit/d73be860ebf195849e89d79b3eb8006b83df2c33))
* use RULES_INDEX, more clearly code comment ([bae11d5](https://github.com/solidzoro/next-plugin-antd-less/commit/bae11d592616c2eb0a78b24271f0b6ecc1c96537))

### [0.2.1](https://github.com/solidzoro/next-plugin-antd-less/compare/v0.2.0...v0.2.1) (2021-02-02)


### Chore

* update deps less-loader@8.0.0 ([5de28ae](https://github.com/solidzoro/next-plugin-antd-less/commit/5de28ae514d30bdf3cd0c6c8ff7bf007cdfb1004))

## [0.2.0](https://github.com/solidzoro/next-plugin-antd-less/compare/v0.1.4...v0.2.0) (2021-02-01)


### Refactor

* less in dependencies ([b92122e](https://github.com/solidzoro/next-plugin-antd-less/commit/b92122e917b0f7f6300ef33310eba2631b2a9dc3))
* sharper nextConfig code ([dc18381](https://github.com/solidzoro/next-plugin-antd-less/commit/dc183816a6c658de5ae94277bf61a566e795364b))

### [0.1.4](https://github.com/solidzoro/next-plugin-antd-less/compare/v0.1.3...v0.1.4) (2021-01-26)

### [0.1.3](https://github.com/solidzoro/next-plugin-antd-less/compare/v0.1.2...v0.1.3) (2020-11-25)


### Bug Fixes

* keep css modules `auto` ([c4a129b](https://github.com/solidzoro/next-plugin-antd-less/commit/c4a129bcbe17bba9830ff50caf3c5bcda0a3fd64))

### [0.1.2](https://github.com/solidzoro/next-plugin-antd-less/compare/v0.1.1...v0.1.2) (2020-11-25)


### Features

* nextconfig cssLoaderOptions follow https://github.com/webpack-contrib/css-loader ([d6c2bf6](https://github.com/solidzoro/next-plugin-antd-less/commit/d6c2bf66645ec19a4eb2c1a85e315e7f501d912d))

### [0.1.1](https://github.com/solidzoro/next-plugin-antd-less/compare/v0.1.0...v0.1.1) (2020-11-25)

## [0.1.0](https://github.com/solidzoro/next-plugin-antd-less/compare/v0.0.6...v0.1.0) (2020-11-25)


### Features

* compatible next.js 10 ([b10ad4f](https://github.com/solidzoro/next-plugin-antd-less/commit/b10ad4f87cf8bf2598ec103e3be5017d2e6f7f54))

## [0.0.6](https://github.com/solidzoro/next-plugin-antd-less/compare/v0.0.5...v0.0.6) (2020-08-27)


## [0.0.5](https://github.com/solidzoro/next-plugin-antd-less/compare/v0.0.4...v0.0.5) (2020-08-27)


### Bug Fixes

* unintended overwriting of sass module rule ([deffefe](https://github.com/solidzoro/next-plugin-antd-less/commit/deffefe6118ad94bdcb1c4aa3f8eb98a3c6a771f))


## [0.0.4](https://github.com/solidzoro/next-plugin-antd-less/compare/v0.0.3...v0.0.4) (2020-08-05)


### Performance Improvements

* use `clone` instend of `lodash.clone` ([e6443fa](https://github.com/solidzoro/next-plugin-antd-less/commit/e6443facd173568640b3dd296ba04dc051125493))


## [0.0.3](https://github.com/solidzoro/next-plugin-antd-less/compare/v0.0.2...v0.0.3) (2020-08-05)


## 0.0.2 (2020-08-05)


### Features

* handle less file with antd ([5bdf1c3](https://github.com/solidzoro/next-plugin-antd-less/commit/5bdf1c3c86fed6ffbb09a7b23bcfe7d22a705dfd))
