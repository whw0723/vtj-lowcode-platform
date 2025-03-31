import {
  type NodeSchema,
  type NodeProps,
  type NodeEvents,
  type JSExpression,
  type NodeDirective,
  type BlockSlot
} from '@vtj/core';
import { compileTemplate } from '@vue/compiler-sfc';
import {
  NodeTypes,
  type TemplateChildNode,
  type AttributeNode,
  type DirectiveNode,
  type ElementNode,
  type IfNode,
  type ForNode,
  type IfConditionalExpression
} from '@vue/compiler-core';
import { isJSExpression, isNodeSchema } from '../shared';
import { getJSExpression, getJSFunction } from './utils';

let __slots: BlockSlot[] = [];

export function parseTemplate(id: string, name: string, content: string = '') {
  __slots = [];
  const result = compileTemplate({
    id,
    filename: name,
    source: content
  });
  const children = result.ast?.children || [];
  const nodes = children.map((child) => transformNode(child)) as NodeSchema[];
  return {
    nodes: nodes.filter((n) => !!n),
    slots: __slots
  };
}

function pickSlot(node: NodeSchema) {
  if (node.name === 'slot') {
    let name: any = 'default';
    const params: any[] = [];
    for (const [key, value] of Object.entries(node.props || {})) {
      if (key === 'name') {
        name = value;
      } else {
        params.push(key);
      }
    }
    __slots.push({
      name,
      params
    });
  }
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
        props[item.arg.content] = getJSExpression(item.exp.content);
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

function getDirectives(node: IfNode | ForNode | ElementNode) {
  const directives: NodeDirective[] = [];
  // v-if
  if (node.type === NodeTypes.IF) {
    const test = (node.codegenNode as IfConditionalExpression)?.test;
    if (test) {
      directives.push({
        name: 'vIf',
        value: getJSExpression(test.loc.source)
      });
    }
  }

  // v-for
  if (node.type === NodeTypes.FOR) {
    directives.push({
      name: 'vFor',
      value: getJSExpression(node.source.loc.source),
      iterator: {
        item: node.valueAlias?.loc.source || 'item',
        index: node.keyAlias?.loc.source || 'index'
      }
    });
  }

  if (node.type === NodeTypes.ELEMENT) {
    const directivProps = node.props.filter(
      (prop) => prop.type === NodeTypes.DIRECTIVE
    );
    // v-model
    const vModels = directivProps.filter((n) => n.name === 'model');
    if (vModels.length) {
      vModels.forEach((item) => {
        directives.push({
          name: 'vModel',
          arg: (item.arg as any)?.content,
          value: getJSExpression(item.exp?.loc.source || '')
        });
      });
    }

    // v-show
    const vShow = directivProps.find((n) => n.name === 'show');
    if (vShow) {
      directives.push({
        name: 'vShow',
        value: getJSExpression(vShow.exp?.loc.source || '')
      });
    }

    // v-bind
    const vBind = directivProps.find((n) => n.name === 'bind' && !n.arg);
    if (vBind) {
      directives.push({
        name: 'vBind',
        value: getJSExpression(vBind.exp?.loc.source || '')
      });
    }

    // v-html
    const vHtml = directivProps.find((n) => n.name === 'html');
    if (vHtml) {
      directives.push({
        name: 'vHtml',
        value: getJSExpression(vHtml.exp?.loc.source || '')
      });
    }
  }
  return directives;
}

function createNodeSchema(node: ElementNode, scope?: IfNode | ForNode) {
  const el: NodeSchema = {
    name: node.tag,
    props: getProps(node.props),
    events: getEvents(node.props),
    directives: getDirectives(scope || node)
  };
  pickSlot(el);
  return transformChildren(el, node.children);
}

function transformNode(
  node: TemplateChildNode
): NodeSchema | JSExpression | string | null {
  // 处理元素节点
  if (node.type === NodeTypes.ELEMENT) {
    return createNodeSchema(node);
  }

  // 处理 v-if 节点
  if (node.type === NodeTypes.IF) {
    const el = node.branches[0].children[0];
    if (el) {
      if (el.type === NodeTypes.ELEMENT) {
        return createNodeSchema(el, node);
      }
    }
  }

  // 处理 v-for 节点
  if (node.type === NodeTypes.FOR) {
    const el = node.children[0];
    if (el.type === NodeTypes.ELEMENT) {
      return createNodeSchema(el, node);
    }
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
