```ts
// 安装依赖：pnpm add @vue/compiler-sfc @vue/compiler-core typescript

import { parse } from '@vue/compiler-sfc';
import { NodeTypes, ElementNode } from '@vue/compiler-core';

// 定义 DSL 类型
interface ComponentDSL {
  name?: string;
  template: TemplateNode;
  script: ScriptBlock;
  styles: string[];
}

interface TemplateNode {
  type: string;
  children?: TemplateNode[];
  props?: Record<string, string>;
  directives?: Directive[];
  content?: string;
}

interface Directive {
  name: string;
  value: string;
}

interface ScriptBlock {
  data: Record<string, any>;
  methods: Record<string, string>;
  imports: string[];
}

export function convertVueToDSL(source: string): ComponentDSL {
  const { descriptor } = parse(source);

  return {
    name: descriptor.filename?.replace('.vue', ''),
    template: parseTemplate(descriptor.template?.content || ''),
    script: parseScript(descriptor.script?.content || ''),
    styles: descriptor.styles.map((style) => style.content)
  };
}

function parseTemplate(template: string): TemplateNode {
  const ast = parse(template, {
    comments: false
  }).children[0] as ElementNode;

  return transformNode(ast);
}

function transformNode(node: ElementNode): TemplateNode {
  // 处理元素节点
  if (node.type === NodeTypes.ELEMENT) {
    return {
      type: node.tag,
      props: getProps(node),
      directives: getDirectives(node),
      children: node.children.map((child) =>
        transformNode(child as ElementNode)
      )
    };
  }

  // 处理文本节点
  if (node.type === NodeTypes.TEXT) {
    return {
      type: 'text',
      content: node.content
    };
  }

  // 其他类型处理...
  return { type: 'unknown' };
}

function getProps(node: ElementNode): Record<string, string> {
  return node.props
    .filter((prop) => prop.type === NodeTypes.ATTRIBUTE)
    .reduce(
      (acc, prop) => {
        acc[prop.name] = prop.value?.content || '';
        return acc;
      },
      {} as Record<string, string>
    );
}

function getDirectives(node: ElementNode): Directive[] {
  return node.props
    .filter((prop) => prop.type === NodeTypes.DIRECTIVE)
    .map((prop) => ({
      name: prop.name,
      value: prop.exp?.content || ''
    }));
}

function parseScript(script: string): ScriptBlock {
  // 简化的解析逻辑，实际可以使用 TypeScript 编译器 API
  const dataMatch = script.match(/data\(\)\s*{\s*return\s*({[\s\S]*?})\s*}/);
  const methodsMatch = script.match(
    /methods:\s*({[\s\S]_?})\s_,?\s\*(?:computed|watch|)/
  );

  return {
    data: dataMatch ? parseObject(dataMatch[1]) : {},
    methods: methodsMatch ? parseObject(methodsMatch[1]) : {},
    imports: extractImports(script)
  };
}

function parseObject(str: string): Record<string, any> {
  // 简化的对象解析，实际需要更严谨的实现
  try {
    return Function(`return ${str}`)();
  } catch {
    return {};
  }
}

function extractImports(script: string): string[] {
  const importRegex = /import\s+._?\s+from\s+['"](._?)['"]/g;
  const imports = [];
  let match;

  while ((match = importRegex.exec(script)) !== null) {
    imports.push(match[1]);
  }

  return imports;
}
```

```ts
// 扩展指令处理
function getDirectives(node: ElementNode): Directive[] {
  return node.props
    .filter((prop) => prop.type === NodeTypes.DIRECTIVE)
    .map((prop) => {
      let value = '';
      if (prop.exp) value += prop.exp.content;
      if (prop.arg) value += `: ${prop.arg.content}`;
      return {
        name: prop.name,
        value: value.trim()
      };
    });
}

// 支持 v-for
function transformFor(node: ElementNode): TemplateNode {
  const forDirective = node.props.find(
    (prop) => prop.type === NodeTypes.DIRECTIVE && prop.name === 'for'
  );

  if (forDirective) {
    return {
      type: 'for-loop',
      iterator: forDirective.exp?.content || '',
      children: [transformNode(node)]
    };
  }
  return transformNode(node);
}
```
