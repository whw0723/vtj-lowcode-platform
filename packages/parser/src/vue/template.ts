import {
  type NodeSchema,
  type NodeProps,
  type NodeEvents,
  type JSExpression,
  DirectiveModel,
  type JSFunction
} from '@vtj/core';
import { compileTemplate } from '@vue/compiler-sfc';
import {
  NodeTypes,
  type TemplateChildNode,
  type AttributeNode,
  type DirectiveNode
} from '@vue/compiler-core';
import { isJSExpression, isNodeSchema } from '../shared';

function getJSExpression(content: string) {
  return {
    type: 'JSExpression',
    value: content
  } as JSExpression;
}

function getJSFunction(content: string) {
  return {
    type: 'JSFunction',
    value: content
  } as JSFunction;
}

function getProps(nodes: Array<AttributeNode | DirectiveNode>) {
  const props: NodeProps = {};
  for (const item of nodes) {
    // 普通属性
    if (item.type === NodeTypes.ATTRIBUTE) {
      props[item.name] = item.value?.content || '';
    }

    // 动态绑定的属性
    if (item.type === NodeTypes.DIRECTIVE) {
      if (
        item.name === 'bind' &&
        item.exp?.type === NodeTypes.SIMPLE_EXPRESSION &&
        item.arg?.type === NodeTypes.SIMPLE_EXPRESSION
      ) {
        props[item.arg.content] = getJSExpression(`(${item.exp.content})`);
      }
    }
  }
  return props;
}

function getEvents(nodes: Array<AttributeNode | DirectiveNode>) {
  const events: NodeEvents = {};
  for (const item of nodes) {
    // 动态绑定的属性
    if (item.type === NodeTypes.DIRECTIVE) {
      if (
        item.name === 'on' &&
        item.arg?.type === NodeTypes.SIMPLE_EXPRESSION
      ) {
        const modifiers = item.modifiers.reduce(
          (result, cur) => {
            result[cur.content] = true;
            return result;
          },
          {} as Record<string, boolean>
        );
        events[item.arg.content] = {
          name: item.arg.content,
          handler: getJSFunction(`(${item.exp?.loc.source})`),
          modifiers
        };
      }
    }
  }
  return events;
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
          value: getJSExpression('this.' + item.exp?.loc.source || '')
        })
      );
    });
  }
  // todo: vIf/vFor/vShow/vBind ...

  return DirectiveModel.toDsl(directives);
}

function transformNode(
  node: TemplateChildNode
): NodeSchema | JSExpression | string | null {
  // 处理元素节点
  if (node.type === NodeTypes.ELEMENT) {
    const el: NodeSchema = {
      name: node.tag,
      props: getProps(node.props),
      events: getEvents(node.props)
      // directives: getDirectives(node.props)
    };
    return transformChildren(el, node.children);
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
    if (
      node.content.type === NodeTypes.SIMPLE_EXPRESSION ||
      node.content.type === NodeTypes.COMPOUND_EXPRESSION
    ) {
      return getJSExpression(node.content.loc.source);
    }
  }

  // 文本和表达式合成
  if (node.type === NodeTypes.COMPOUND_EXPRESSION) {
    // 暂不处理这种情况
    console.warn('未处理节点', node);
  }

  console.warn('未处理', node.type);
  return null;
}

function transformChildren(
  el: NodeSchema,
  childNodes: TemplateChildNode[] = []
) {
  const nodes: Array<NodeSchema | JSExpression | string> = [];
  for (const childNode of childNodes) {
    // 处理 template 标签
    if (childNode.type === NodeTypes.ELEMENT && childNode.tag === 'template') {
      const slot = childNode.props.find((n) => n.name === 'slot');
      for (const child of childNode.children) {
        const node = transformNode(child);
        if (node) {
          // 补充插槽指令
          if (isNodeSchema(node) && slot?.type === NodeTypes.DIRECTIVE) {
            node.slot = {
              name: (slot.arg as any)?.content || 'default',
              params: slot.arg?.identifiers || []
            };
          }
          nodes.push(node);
        }
      }
    } else {
      const node = transformNode(childNode);
      if (node) {
        nodes.push(node);
      }
    }
  }

  // 当只有一个节点时，有可能是字符串或表达式
  if (nodes.length === 1) {
    const first = nodes[0];
    el.children =
      typeof first === 'string' || isJSExpression(first) ? first : [first];
  } else {
    el.children = nodes as NodeSchema[];
  }

  return el;
}

export function parseTemplate(content: string = '') {
  const result = compileTemplate({
    id: 'id',
    filename: 'filename',
    source: content
  });
  const children = result.ast?.children || [];
  return children.map((child) => transformNode(child)) as NodeSchema[];
}
