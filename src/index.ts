import type { Program } from '@babel/types'
import type { Options } from './types'
import { addNormalScript, babelParse, generateTransform, getLang, MagicString, parseSFC } from '@vue-macros/common'
import { createUnplugin } from 'unplugin'

export * from './utils'

export default createUnplugin<Options>(options => ({
  name: 'unplugin-vue-router-extend',
  enforce: 'pre',
  transform(code, id) {
    const name = options.routeMap.get(id)?.name
    if (!name)
      return

    const lang = getLang(id)
    const s = new MagicString(code)
    if (lang === 'vue') {
      const sfc = parseSFC(code, id)
      if (sfc.script) {
        const offset = sfc.script.loc.start.offset
        transformAST(sfc.getScriptAst()!, name, s, offset)
      }
      else {
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
      }
    }
    else if (/[jt]sx?$/.test(lang)) {
      const ast = babelParse(code, lang)
      transformAST(ast, name, s)
    }

    return generateTransform(s, id)
  },
}))

function transformAST(ast: Program, name: string, s: MagicString, offset = 0) {
  for (const stmt of ast.body) {
    if (
      stmt.type === 'ExportDefaultDeclaration'
      && stmt.declaration.type === 'CallExpression'
      && stmt.declaration.callee.type === 'Identifier'
      && stmt.declaration.callee.name === 'defineComponent'
    ) {
      const argument = stmt.declaration.arguments.find(i => i.type === 'ObjectExpression')
      if (argument) {
        if (!argument.properties?.find(
          prop =>
            prop.type === 'ObjectProperty'
            && prop.key.type === 'Identifier'
            && prop.key.name === 'name',
        )) {
          s.appendLeft(
            offset + argument.end! - 1,
            `${
              !argument.extra?.trailingComma && argument.properties.length
                ? ','
                : ''
            } name: '${name}'`,
          )
        }
      }
      else {
        s.appendRight(offset + stmt.declaration.end! - 1, `, { name: '${name}' }`)
      }
    }
  }
}
