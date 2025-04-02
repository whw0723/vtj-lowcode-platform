import { type JSExpression, type JSFunction } from '@vtj/core';

export interface ExpressionOptions {
  context: Record<string, Set<string>>;
  computed: string[];
  libs: Record<string, string>;
}

export function replacer(content: string, key: string, to: string) {
  const r1 = new RegExp(key, 'g');
  const r2 = /(\{|\.|\,)$/;
  return content.replace(r1, (str, index, source) => {
    const leftStr = source.substring(0, index);
    if (r2.test(leftStr.trim())) {
      return str;
    }
    return to;
  });
}

export function patchCode(
  content: string,
  id: string,
  options: ExpressionOptions
) {
  const { context = {}, computed = [], libs = {} } = options || {};
  const contextKeys = Array.from(context[id || ''] || new Set());
  if (contextKeys) {
    for (const key of contextKeys) {
      content = replacer(content, key, `this.context.${key}`);
    }
  }

  for (const key of computed) {
    content = replacer(content, key, `this.${key}.value`);
  }

  for (const [key, value] of Object.entries(libs)) {
    content = replacer(content, key, `this.$libs.${value}.${key}`);
  }

  return content;
}

export function getJSExpression(content: string) {
  return {
    type: 'JSExpression',
    value: content
  } as JSExpression;
}

export function getJSFunction(content: string) {
  return {
    type: 'JSFunction',
    value: content
  } as JSFunction;
}

export const LIFE_CYCLES_LIST = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeUnmount',
  'unmounted',
  'errorCaptured',
  'renderTracked',
  'renderTriggered',
  'activated',
  'deactivated'
];
