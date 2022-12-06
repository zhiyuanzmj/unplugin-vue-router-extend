import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import VueRouter from 'unplugin-vue-router/vite'
import Vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { getRouteMap } from '../src'
import VueRouterExtend from '../src/vite'

const routeMap = new Map()

export default defineConfig({
  plugins: [
    Vue(),
    vueJsx(),
    VueRouter({
      dts: './src/typed-router.d.ts',
      getRouteName: getRouteMap({ routeMap }),
    }),
    VueRouterExtend({
      routeMap,
    }),
    Inspect(),
  ],
})
