import type { NodeSchema, JSExpression, JSFunction } from '@vtj/core';
import { compileTemplate } from '@vue/compiler-sfc';
import { NodeTypes, type TemplateChildNode } from '@vue/compiler-core';

export function isJSExpression(data: any): data is JSExpression {
  return data && data.type === 'JSExpression';
}

export function isJSFunction(x: any): x is JSFunction {
  return typeof x === 'object' && x && x.type === 'JSFunction';
}

export function isJSCode(data: unknown): data is JSExpression | JSFunction {
  return isJSExpression(data) || isJSFunction(data);
}

export function parseTemplate(content: string = '') {
  const result = compileTemplate({
    id: 'id',
    filename: 'filename',
    source: content
  });
  const children = result.ast?.children || [];
  return children.map((child) => transformNode(child));
}

export function transformNode(node: TemplateChildNode): any {
  // 处理元素节点
  if (node.type === NodeTypes.ELEMENT) {
    const result: NodeSchema = {
      name: node.tag
    };
    transformChildren(result, node.children);

    return result;
  }

  // 处理文本节点
  if (node.type === NodeTypes.TEXT_CALL) {
    return node.content.type == NodeTypes.TEXT ? node.content.content : '';
  }

  if (node.type === NodeTypes.TEXT) {
    return node.content;
  }

  // 处理插值
  if (node.type === NodeTypes.INTERPOLATION) {
    if (node.content.type === NodeTypes.SIMPLE_EXPRESSION) {
      return {
        type: 'JSExpression',
        value: node.content.loc.source
      };
    }
  }

  // 文本和表达式合成
  if (node.type === NodeTypes.COMPOUND_EXPRESSION) {
    // 暂不处理这种情况
  }

  console.log('未处理', node.type, node);

  return null;
}

export function transformChildren(
  node: NodeSchema,
  childNodes: TemplateChildNode[] = []
) {
  const nodes: NodeSchema[] = [];
  for (const child of childNodes) {
    if (child.type === NodeTypes.ELEMENT && child.tag === 'template') {
      nodes.push(...transformChildren(node, child.children));
    } else {
      nodes.push(transformNode(child));
    }
  }

  if (nodes.length === 1) {
    const first = nodes[0];
    node.children =
      typeof first === 'string' || isJSExpression(first) ? first : nodes;
  } else {
    node.children = nodes;
  }

  return nodes;
}
