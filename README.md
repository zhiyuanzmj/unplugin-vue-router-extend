# unplugin-vue-router-extend

[![NPM version](https://img.shields.io/npm/v/unplugin-vue-router-extend?color=a1b858&label=)](https://www.npmjs.com/package/unplugin-vue-router-extend)

- Automatically generate component's name based on `route.name`.  

<img width="1255" alt="image" src="https://user-images.githubusercontent.com/32807958/205870943-dd2b6094-a4dd-4927-a417-57350fd7773b.png">

- Support `getNuxtStyleRouteName` method to generate NuxtJs-style route name

``` ts
declare module 'vue-router/auto/routes' {
  export interface RouteNamedMap {
    'index': RouteRecordInfo<'index', '/', Record<never, never>, Record<never, never>>
    'all': RouteRecordInfo<'all', '/:all(.*)', { all: ParamValue<true> }, { all: ParamValue<false> }>
    'sensor': RouteRecordInfo<'sensor', '/:sensor', { sensor: ParamValue<true> }, { sensor: ParamValue<false> }>
    'sensor-current': RouteRecordInfo<'sensor-current', '/:sensor/current', { sensor: ParamValue<true> }, { sensor: ParamValue<false> }>
    'about/': RouteRecordInfo<'about/', '/about', Record<never, never>, Record<never, never>>
    'about': RouteRecordInfo<'about', '/about', Record<never, never>, Record<never, never>>
    'about-user-id': RouteRecordInfo<'about-user-id', '/about/:id', { id: ParamValue<true> }, { id: ParamValue<false> }>
    'about-id-more': RouteRecordInfo<'about-id-more', '/about/:id/more', { id: ParamValue<true> }, { id: ParamValue<false> }>
    'about-id-nested': RouteRecordInfo<'about-id-nested', '/about/:id/nested', { id: ParamValue<true> }, { id: ParamValue<false> }>
    'blog': RouteRecordInfo<'blog', '/blog', Record<never, never>, Record<never, never>>
    'blog-id': RouteRecordInfo<'blog-id', '/blog/:id2', { id2: ParamValue<true> }, { id2: ParamValue<false> }>
    'blog-today': RouteRecordInfo<'blog-today', '/blog/today', Record<never, never>, Record<never, never>>
    'blog-today-all': RouteRecordInfo<'blog-today-all', '/blog/today/:all(.*)', { all: ParamValue<true> }, { all: ParamValue<false> }>
    'components': RouteRecordInfo<'components', '/components', Record<never, never>, Record<never, never>>
  }
}
```

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
import { getNuxtStyleRouteName } from 'unplugin-vue-router-extend'

const routeMap = new Map()
export default defineConfig({
  plugins: [
    /** */
    VueRouter({
       getRouteName: (node: any) => {
        if (!routeMap.size) {
          for (const [key, value] of node.parent?.map)
            routeMap.set(key, value)
        }
        return getNuxtStyleRouteName(node)
      },
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
import { getNuxtStyleRouteName } from 'unplugin-vue-router-extend'

const routeMap = new Map()
export default {
  plugins: [
    /* ... */
    VueRouter({
      getRouteName: (node: any) => {
        if (!routeMap.size) {
          for (const [key, value] of node.parent?.map)
            routeMap.set(key, value)
        }
        return getNuxtStyleRouteName(node)
      },
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
import { getNuxtStyleRouteName } from 'unplugin-vue-router-extend'

const routeMap = new Map()
module.exports = {
  /* ... */
  plugins: [
    require('unplugin-vue-router/webpack')({
      getRouteName: (node: any) => {
        if (!routeMap.size) {
          for (const [key, value] of node.parent?.map)
            routeMap.set(key, value)
        }
        return getNuxtStyleRouteName(node)
      },
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
import { getNuxtStyleRouteName } from 'unplugin-vue-router-extend'

const routeMap = new Map()
export default {
  buildModules: [
    /* ... */
    ['unplugin-vue-router/nuxt', {
      getRouteName: (node: any) => {
        if (!routeMap.size) {
          for (const [key, value] of node.parent?.map)
            routeMap.set(key, value)
        }
        return getNuxtStyleRouteName(node)
      },
    }],
    ['unplugin-vue-router-extend/nuxt', {
      routeMap
    }],
  ],
}
```

> This module works for both Nuxt 2 and [Nuxt Vite](https://github.com/nuxt/vite)

<br></details>