import { type BlockSchema, type NodeSchema, BlockModel } from '@vtj/core';
import { tsFormatter } from '@vtj/coder';
import { parseSFC, isJSCode } from '../shared';
import { parseTemplate } from './template';
import { parseScripts } from './scripts';
import { patchCode } from './utils';

export interface ParseVueOptions {
  id: string;
  name: string;
  source: string;
}

export async function parseVue(options: ParseVueOptions) {
  const { id, name, source } = options;
  const sfc = parseSFC(source);
  const { state, watch, lifeCycles, computed, methods, props, emits, inject } =
    parseScripts(sfc.script);
  const { nodes, slots, context } = parseTemplate(id, name, sfc.template);
  const dsl: BlockSchema = {
    id,
    name,
    inject,
    props,
    state,
    watch,
    lifeCycles,
    computed,
    methods,
    slots,
    emits,
    nodes
  };

  await walkDsl(dsl, async (node: NodeSchema) => {
    await walkNode(node, async (content: any) => {
      if (isJSCode(content)) {
        const options = {
          context,
          computed: [],
          libs: {}
        };
        const code = await tsFormatter(content.value);
        content.value = patchCode(code, node.id as string, options);
      }
    });
  });

  const model = new BlockModel(dsl);
  return model.toDsl();
}

async function walkDsl(
  dsl: BlockSchema,
  callback: (n: NodeSchema, p?: NodeSchema) => Promise<void>
) {
  const walking = async (node: NodeSchema, parent?: NodeSchema) => {
    await callback(node, parent);
    if (Array.isArray(node.children)) {
      node.children.forEach((n) => walking(n, node));
    }
  };

  if (Array.isArray(dsl.nodes)) {
    for (const n of dsl.nodes) {
      await walking(n);
    }
  }
}

async function walkNode(node: NodeSchema, callback: (n: any) => Promise<void>) {
  const walking = async (item: unknown) => {
    if (!item) return;
    if (typeof item !== 'object') return;
    if (Array.isArray(item)) {
      for (let n of item) {
        await callback(n);
        await walking(n);
      }
      return;
    }

    const values = Object.values(item as Record<string, any>);
    for (const value of values) {
      await callback(value);
      await walking(value);
    }
  };
  await walking(node);
}
