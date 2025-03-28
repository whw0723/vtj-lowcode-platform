import { type BlockSchema, BlockModel } from '@vtj/core';
import { parseSFC } from '../shared';
import { parseTemplate } from './template';

export function parseVue(id: string, name: string, source: string) {
  const sfc = parseSFC(source);
  const nodes = parseTemplate(sfc.template);

  // const ast = parseScript(sfc.script);

  const dsl: BlockSchema = {
    id,
    name,
    nodes
  };

  const model = new BlockModel(dsl);

  //   console.log(ast);
  // traverseAST(ast, {
  //   ExportDefaultDeclaration(path) {
  //     console.log(path);
  //   }
  // });
  return model.toDsl();
  // return dsl;
}
