import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import glob from 'fast-glob'
import { build } from 'vite'
import VueRouter from 'unplugin-vue-router/vite'
import vueRouterExtend from '../src/vite'
import { getNuxtStyleRouteName } from '../src'

describe('generate component name', async () => {
  const root = resolve(__dirname, '../playground/src/pages')

  const files = await glob('./**/*.{vue,js,ts}', {
    cwd: root,
    onlyFiles: true,
  })

  for (const file of files) {
    const routeMap = new Map()
    it(file.replace(/\\/g, '/'), async () => {
      const filepath = resolve(root, file)

      const bundle = await build({
        configFile: false,
        build: {
          sourcemap: false,
          write: false,
          lib: {
            entry: filepath,
            formats: ['es'],
            name: 'index',
          },
        },
        plugins: [
          VueRouter({
            routesFolder: root,
            getRouteName: (node: any) => {
              if (!routeMap.size) {
                for (const [key, value] of node.parent?.map)
                  routeMap.set(key, value)
              }
              return getNuxtStyleRouteName(node)
            },
            dts: resolve(root, '../typed-router.d.ts'),
            exclude: ['**/__test__/**'],
          }),
          vueRouterExtend({
            routeMap,
          }),
          {
            name: 'to-string',
            transform: code => `export default \`${code.replace(/`/g, '\\`')}\``,
          },
        ],
      })
      if (!Array.isArray(bundle))
        return
      const code = bundle[0].output
        .map(file => (file.type === 'chunk' ? file.code : file.fileName))
        .join('\n')
      expect(code).toMatchSnapshot()
    })
  }
})
