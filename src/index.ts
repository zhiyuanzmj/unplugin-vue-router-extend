import { createUnplugin } from 'unplugin'
import { MagicString, compileScript, parse } from '@vue/compiler-sfc'
import type { TreeNode } from 'unplugin-vue-router'
import { getFileBasedRouteName } from 'unplugin-vue-router'
import type { Options } from './types'

export default createUnplugin<Options>((options) => {
  return {
    name: 'unplugin-vue-router-extend',
    transformInclude(id) {
      return id.endsWith('.vue') && options.routeMap?.get(id)
    },
    transform(code, id) {
      const name = options.routeMap.get(id)!.name
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
  }
})

export const getRouteMap = (routeMap: Map<string, TreeNode>) => (node: TreeNode) => {
  function _getRouteMap(node: TreeNode) {
    node.children.forEach((i) => {
      if (i.value.filePaths.size)
        routeMap.set(i.value.filePaths.get('default')!, i)
      if (i.children.size)
        _getRouteMap(i)
    })
  }

  function getRoot(node: TreeNode): TreeNode {
    return node.parent ? getRoot(node.parent) : node
  }
  if (!routeMap.size)
    _getRouteMap(getRoot(node))

  return getFileBasedRouteName(node)
}
