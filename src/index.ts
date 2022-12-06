import { createUnplugin } from 'unplugin'
import { MagicString, compileScript, parse } from '@vue/compiler-sfc'
import { getFileBasedRouteName } from 'unplugin-vue-router'
import type { TreeNode } from 'unplugin-vue-router'
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

export function getNuxtStyleRouteName(node: TreeNode): string {
  if (node.parent?.isRoot() && node.value.pathSegment === '')
    return 'index'

  let name = node.value.subSegments
    .map((segment) => {
      if (typeof segment === 'string')
        return `-${segment}`

      // else it's a param
      return segment.paramName
    })
    .join('')

  if (node.value.filePaths.size && node.children.has('index'))
    name += '/'

  const parent = node.parent
  return (
    (parent && !parent.isRoot()
      ? getNuxtStyleRouteName(parent).replace(/\/$/, '')
      : '') + name
  ).replace(/^-|-$/, '')
}

export const getRouteMap = ({
  routeMap = new Map<string, TreeNode>(),
  nuxtStyle = true,
}, getRouteName = nuxtStyle ? getNuxtStyleRouteName : getFileBasedRouteName) =>
  (node: TreeNode) => {
    function _getRouteMap(node: TreeNode) {
      node.children.forEach((i) => {
        if (i.value.filePaths.get('default')) {
          routeMap.set(i.value.filePaths.get('default')!, i)
        }
        else if (nuxtStyle) {
          i.parent?.children.delete(i.value.rawSegment || '')
          i.children.forEach((child) => {
            const block: any = {
              path: i.path + (child.path ? `/${child.path}` : ''),
            }
            if (i.value.isParam() && !child.path)
              block.props = true
            child.setCustomRouteBlock(child.path, block)
            i.parent?.children.set(i.path, child)
          })
        }

        if (i.children.size)
          _getRouteMap(i)
      })
    }

    function getRoot(node: TreeNode): TreeNode {
      return node.parent ? getRoot(node.parent) : node
    }
    if (!routeMap.size)
      _getRouteMap(getRoot(node))

    return getRouteName(node)
  }
