import type { BlockSchema, NodeSchema } from '@vtj/core';
import { parseSFC, parseScript } from '../shared';
import { parseTemplate } from './helper';

export function parseVue(source: string) {
  const sfc = parseSFC(source);
  const nodes: NodeSchema[] = parseTemplate(sfc.template);

  // const ast = parseScript(sfc.script);

  const dsl: BlockSchema = {
    name: 'Test',
    nodes
  };

  //   console.log(ast);
  // traverseAST(ast, {
  //   ExportDefaultDeclaration(path) {
  //     console.log(path);
  //   }
  // });
  return dsl;
}
