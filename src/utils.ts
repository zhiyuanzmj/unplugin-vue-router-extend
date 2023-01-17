import { getFileBasedRouteName } from 'unplugin-vue-router'
import type { TreeNode } from 'unplugin-vue-router'
import { debounce } from 'lodash-unified'

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

function _getRouteMap(node: TreeNode, { routeMap, nuxtStyle }: {
  routeMap: Map<string, TreeNode>
  nuxtStyle: boolean
}) {
  node.children.forEach((i) => {
    if (i.value.filePaths.get('default'))
      routeMap.set(i.value.filePaths.get('default')!, i)

    // else if (nuxtStyle) {
    //   i.parent?.children.delete(i.value.rawSegment)
    //   i.children.forEach((child) => {
    //     const block: any = {
    //       path: i.path + (child.path ? `/${child.path}` : ''),
    //     }
    //     if (i.value.isParam() && !child.path)
    //       block.props = true
    //     child.setCustomRouteBlock(child.path, block)
    //     i.parent?.children.set(child.value.rawSegment || i.value.rawSegment, child)
    //   })
    // }

    if (i.children.size)
      _getRouteMap(i, { routeMap, nuxtStyle })
  })
}

function getRoot(node: TreeNode): TreeNode {
  return node.parent ? getRoot(node.parent) : node
}

const getRouteMap = debounce(
  (node, options) => _getRouteMap(getRoot(node), options),
  100,
  { leading: true, trailing: false },
)

export const getRouteName = ({
  routeMap = new Map<string, TreeNode>(),
  nuxtStyle = false,
}, getRouteName = nuxtStyle ? getNuxtStyleRouteName : getFileBasedRouteName) =>
  (node: TreeNode) => {
    getRouteMap(node, { routeMap, nuxtStyle })

    return getRouteName(node)
  }
