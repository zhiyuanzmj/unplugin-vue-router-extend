import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import glob from 'fast-glob'
import { build } from 'vite'
import VueRouter from 'unplugin-vue-router/vite'
import vueRouterExtend from '../src/vite'

describe('generate component name', async () => {
  const root = resolve(__dirname, '../playground/src/pages')

  const files = await glob('./**/*.{vue,js,ts}', {
    cwd: root,
    onlyFiles: true,
  })

  for (const file of files) {
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
          vueRouterExtend({
            plugin: VueRouter({
              routesFolder: root,
              exclude: ['**/__test__/**'],
            }),
          }),
          {
            name: 'to-string',
            transform: code =>
              `export default \`${code.replace(/`/g, '\\`')}\``,
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
