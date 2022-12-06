# unplugin-vue-router-extend

[![NPM version](https://img.shields.io/npm/v/unplugin-vue-router-extend?color=a1b858&label=)](https://www.npmjs.com/package/unplugin-vue-router-extend)

- Automatically generate component's name based on `route.name`.  

<img width="1255" alt="image" src="https://user-images.githubusercontent.com/32807958/205870943-dd2b6094-a4dd-4927-a417-57350fd7773b.png">

- Support NuxtJs routing file system when `nuxtStyle` is true

<img width="1095" alt="image" src="https://user-images.githubusercontent.com/32807958/205881051-446d17f7-9275-4329-b98c-d0e10594e1f4.png">

## Install

```bash
npm i unplugin-vue-router-extend
```

<summary>Vite</summary><br>

```ts
// vite.config.ts
// import { getPascalCaseRouteName } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
import VueRouterExtend from 'unplugin-vue-router-extend/vite'
import { getRouteMap } from 'unplugin-vue-router-extend'

const routeMap = new Map()
export default defineConfig({
  plugins: [
    /** */
    VueRouter({
      getRouteName: getRouteMap({
        routeMap,
        /**
         * Generate nuxt style route name
         *
         * @default false
         */
        nuxtStyle: true,
      },
      /**
       * You can use the second parameter to customize the route name override method
       *
       * @default `getFileBasedRouteName` - If nuxtStyle is true the default value is `getNuxtStyleRouteName`
       */
      // getPascalCaseRouteName
      ),
    }),
    VueRouterExtend({
      routeMap,
    }),
  ],
})
```


Example: [`playground/`](./playground/)

<br>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import VueRouter from 'unplugin-vue-router/vite'
import VueRouterExtend from 'unplugin-vue-router-extend/vite'
import { getRouteMap } from 'unplugin-vue-router-extend'

const routeMap = new Map()
export default {
  plugins: [
    /* ... */
    VueRouter({
      getRouteName: getRouteMap({ routeMap, }),
    }),
    VueRouterExtend({
      routeMap,
    }),
  ],
}
```

<br></details>


<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
const routeMap = new Map()
module.exports = {
  /* ... */
  plugins: [
    require('unplugin-vue-router/webpack')({
      getRouteName: getRouteMap({ routeMap, }),
    }),
    require('unplugin-vue-router-extend/webpack')({
      routeMap
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

const routeMap = new Map()
export default {
  buildModules: [
    /* ... */
    ['unplugin-vue-router/nuxt', {
      getRouteName: getRouteMap({ routeMap }),
    }],
    ['unplugin-vue-router-extend/nuxt', {
      routeMap
    }],
  ],
}
```

> This module works for both Nuxt 2 and [Nuxt Vite](https://github.com/nuxt/vite)

<br></details>