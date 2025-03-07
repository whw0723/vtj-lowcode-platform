import { type NodeSchema, type NodeProps, DirectiveModel } from '@vtj/core';
import { compileTemplate } from '@vue/compiler-sfc';
import {
  NodeTypes,
  type TemplateChildNode,
  type AttributeNode,
  type DirectiveNode
} from '@vue/compiler-core';
import { isJSExpression } from '../shared';

function getProps(nodes: Array<AttributeNode | DirectiveNode>) {
  return nodes
    .filter((prop) => prop.type === NodeTypes.ATTRIBUTE)
    .reduce((acc, prop) => {
      acc[prop.name] = prop.value?.content || '';
      return acc;
    }, {} as NodeProps);
}

function getDirectives(nodes: Array<AttributeNode | DirectiveNode>) {
  const directives: DirectiveModel[] = [];
  const props = nodes.filter((prop) => prop.type === NodeTypes.DIRECTIVE);
  const vModels = props.filter((n) => n.name === 'model');
  if (vModels.length) {
    vModels.forEach((item) => {
      directives.push(
        new DirectiveModel({
          name: 'vModel',
          arg: (item.arg as any)?.content,
          value: {
            type: 'JSExpression',
            value: 'this.' + item.exp?.loc.source || ''
          }
        })
      );
    });
  }
  // todo: vIf/vFor/vShow/vBind ...

  return DirectiveModel.toDsl(directives);
}

function transformNode(node: TemplateChildNode): any {
  // 处理元素节点
  if (node.type === NodeTypes.ELEMENT) {
    const elNode: NodeSchema = {
      name: node.tag,
      props: getProps(node.props),
      directives: getDirectives(node.props)
    };
    transformChildren(elNode, node.children);

    return elNode;
  }

  // 处理文本节点
  if (node.type === NodeTypes.TEXT_CALL) {
    return node.content.type == NodeTypes.TEXT ? node.content.content : '';
  }

  // 文本节点
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

function transformChildren(
  node: NodeSchema,
  childNodes: TemplateChildNode[] = []
) {
  const nodes: NodeSchema[] = [];
  for (const child of childNodes) {
    if (child.type === NodeTypes.ELEMENT && child.tag === 'template') {
      const slot = child.props.find((n) => n.name === 'slot');
      const children = transformChildren(node, child.children);
      if (slot?.type === NodeTypes.DIRECTIVE) {
        children.forEach((child) => {
          child.slot = {
            name: (slot.arg as any)?.content || 'default',
            params: slot.arg?.identifiers || []
          };
        });
      }
      nodes.push(...children);
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

export function parseTemplate(content: string = '') {
  const result = compileTemplate({
    id: 'id',
    filename: 'filename',
    source: content
  });
  const children = result.ast?.children || [];
  return children.map((child) => transformNode(child));
}
