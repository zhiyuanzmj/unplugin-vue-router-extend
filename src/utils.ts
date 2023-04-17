import type { TreeNode } from 'unplugin-vue-router'

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

  if (node.value.components.size && node.children.has('index'))
    name += '/'

  const parent = node.parent
  return (
    (parent && !parent.isRoot()
      ? getNuxtStyleRouteName(parent).replace(/\/$/, '')
      : '') + name
  ).replace(/^-|-$/, '')
}
