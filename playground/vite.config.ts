import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import VueRouter from 'unplugin-vue-router/vite'
import Vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueRouterExtend from '../src/vite'
import { getFileBasedRouteName } from 'unplugin-vue-router'

const routeMap = new Map()

export default defineConfig({
  plugins: [
    Vue(),
    vueJsx(),
    VueRouter({
      exclude: ['**/__test__/**'],
      dts: './src/typed-router.d.ts',
      getRouteName: (node: any) => {
        if (!routeMap.size && node?.parent?.map) {
          for (const [key, value] of node.parent.map)
            routeMap.set(key, value)
        }
        return getFileBasedRouteName(node)
      },
    }),
    VueRouterExtend({
      routeMap,
    }),
    Inspect(),
  ],
})
