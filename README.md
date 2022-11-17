# unplugin-vue-router-extend

[![NPM version](https://img.shields.io/npm/v/unplugin-vue-router-extend?color=a1b858&label=)](https://www.npmjs.com/package/unplugin-vue-router-extend)

Automatically generate component's name based on `route.name` for `keep-alive`

## Install

```bash
npm i unplugin-vue-router-extend
```

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import VueRouter from 'unplugin-vue-router/vite'
import VueRouterExtend from 'unplugin-vue-router-extend/vite'

export default defineConfig({
  plugins: [
    VueRouterExtend({
      plugin: VueRouter({
        /* options */
      })
    }),
  ],
})
```

Example: [`playground/`](./playground/)

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import VueRouter from 'unplugin-vue-router/rollup'
import VueRouterExtend from 'unplugin-vue-router-extend/rollup'

export default {
  plugins: [
    VueRouterExtend({
      plugin: VueRouter({
        /* options */
      })
    }),
  ],
}
```

<br></details>


<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('unplugin-vue-router-extend/webpack')({
      plugin: require('unplugin-vue-router/webpack')({
        /* options */
      })
    })
  ]
}
```

<br></details>

<details>
<summary>Nuxt</summary><br>

```ts
// nuxt.config.js
import VueRouter from 'unplugin-vue-router/vite'

export default {
  buildModules: [
    ['unplugin-vue-router-extend/nuxt', {
      plugin: VueRouter({
        /* options */
      })
    }],
  ],
}
```

> This module works for both Nuxt 2 and [Nuxt Vite](https://github.com/nuxt/vite)

<br></details>

<details>
<summary>Vue CLI</summary><br>

```ts
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      require('unplugin-vue-router-extend/webpack')({
        plugin: require('unplugin-vue-router/webpack')({
          /* options */
        })
      }),
    ],
  },
}
```

<br></details>