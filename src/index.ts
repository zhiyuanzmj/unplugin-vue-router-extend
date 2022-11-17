import { createUnplugin } from 'unplugin'
import { MagicString, compileScript, parse } from '@vue/compiler-sfc'
import type { Options } from './types'

export default createUnplugin<Options>((options) => {
  let routeMap: Map<string, any> = new Map()

  return [
    options.plugin,
    {
      name: 'unplugin-vue-router-extend',
      async buildStart() {
        routeMap = options.plugin.api?.getRouteMap()
      },
      transformInclude(id) {
        return id.endsWith('.vue')
      },
      transform(code, id) {
        const name = routeMap?.get(id)?.name
        if (!name)
          return
        const { descriptor } = parse(code)
        if (descriptor.script)
          return

        const lang = descriptor.scriptSetup
          && compileScript(descriptor, { id }).attrs.lang
        const s = new MagicString(code)
        s.appendLeft(
          0,
`<script${lang ? ` lang="${lang}"` : ''}>
import { defineComponent } from 'vue'
export default /*#__PURE__*/ defineComponent({
  name: '${name}'
})
</script>\n`,
        )
        return {
          code: s.toString(),
          map: s.generateMap({
            source: id,
            includeContent: true,
            hires: true,
          }),
        }
      },
    },
  ]
})
