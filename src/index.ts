import { createUnplugin } from 'unplugin'
import { MagicString, addNormalScript, getTransformResult, parseSFC } from '@vue-macros/common'
import type { Options } from './types'
export * from './utils'

export default createUnplugin<Options>(options => ({
  name: 'unplugin-vue-router-extend',
  enforce: 'pre',
  transformInclude(id) {
    return id.endsWith('.vue')
  },
  transform(code, id) {
    const name = options.routeMap.get(id)?.name
    if (!name)
      return

    const sfc = parseSFC(code, id)
    if (sfc.script)
      return

    const s = new MagicString(code)
    const normalScript = addNormalScript(sfc, s)
    const scriptOffset = normalScript.start()
    s.appendLeft(
      scriptOffset,
`\nimport { defineComponent } from 'vue'
export default /* @__PURE__ */ defineComponent({
  name: '${name}'
})`,
    )
    normalScript.end()

    
  return getTransformResult(s, id)
  },
}))
