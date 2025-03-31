import { type BlockSchema, BlockModel } from '@vtj/core';
import { parseSFC } from '../shared';
import { parseTemplate } from './template';
import { parseScripts } from './scripts';

export interface ParseVueOptions {
  id: string;
  name: string;
  source: string;
  dependencies?: Record<string, string[]>;
}

export function parseVue(options: ParseVueOptions) {
  const { id, name, source, dependencies } = options;
  const depsMap = parseDeps(dependencies);
  const sfc = parseSFC(source);
  const { state, watch, lifeCycles, computed, methods, props } = parseScripts(
    sfc.script
  );
  const { nodes, slots } = parseTemplate(id, name, sfc.template);

  // const ast = parseScript(sfc.script);

  const dsl: BlockSchema = {
    id,
    name,
    props,
    state,
    watch,
    lifeCycles,
    computed,
    methods,
    slots,
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

function parseDeps(dependencies: Record<string, string[]> = {}) {
  const map: Record<string, string> = {};
  for (const [name, list] of Object.entries(dependencies)) {
    for (const item of list) {
      map[item] = name;
    }
  }
  return map;
}
