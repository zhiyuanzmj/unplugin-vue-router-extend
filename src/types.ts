import type { TreeNode } from 'unplugin-vue-router'

export interface Options {
  // define your plugin options here
  routeMap: Map<string, TreeNode>
}
