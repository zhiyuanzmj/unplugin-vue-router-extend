import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import VueRouter from 'unplugin-vue-router/vite'
import Vue from '@vitejs/plugin-vue'
import VueRouterExtend from '../src/vite'

export default defineConfig({
  plugins: [
    VueRouterExtend({
      plugin: VueRouter({
        dts: './src/typed-router.d.ts',
      }),
    }),
    Vue(),
    Inspect(),
  ],
})
