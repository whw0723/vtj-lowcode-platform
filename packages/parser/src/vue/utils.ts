import { type JSExpression, type JSFunction } from '@vtj/core';

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
