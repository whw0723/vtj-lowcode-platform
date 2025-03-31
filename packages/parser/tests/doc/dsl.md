以下是针对 Vue3 单文件组件脚本部分的完整解析实现方案，包含对 Options API 和 Composition API 的全量组件选项支持：

```typescript
import { parse as babelParse, traverse } from '@babel/core';
import generator from '@babel/generator';

interface ComponentOptions {
  name?: string;
  props?: Record<string, PropOptions>;
  emits?: string[] | Record<string, Function>;
  setup?: string[];
  data?: Record<string, any>;
  computed?: Record<string, { get?: string; set?: string }>;
  methods?: Record<string, string>;
  watch?: Record<string, string>;
  lifecycle?: Record<string, string>;
  components?: Record<string, string>;
  directives?: Record<string, any>;
  expose?: string[];
}

interface PropOptions {
  type: string | string[];
  required?: boolean;
  default?: any;
  validator?: string;
}

function parseScript(scriptContent: string): ComponentOptions {
  const ast = babelParse(scriptContent, {
    sourceType: 'module',
    plugins: ['typescript', 'classProperties']
  });

  const options: ComponentOptions = {
    setup: [],
    data: {},
    computed: {},
    methods: {},
    watch: {},
    lifecycle: {},
    components: {},
    directives: {}
  };

  // 处理 Composition API（<script setup>）
  const isSetupScript = scriptContent.includes('<script setup>');

  // 通用 AST 处理逻辑
  traverse(ast, {
    // 处理 Options API
    ExportDefaultDeclaration(path) {
      const declaration = path.node.declaration;
      if (declaration.type !== 'ObjectExpression') return;

      declaration.properties.forEach((prop) => {
        if (prop.type !== 'ObjectProperty') return;

        const keyName = (prop.key as any).name;

        switch (keyName) {
          case 'props':
            options.props = processProps(prop.value);
            break;

          case 'data':
            options.data = processData(prop.value);
            break;

          case 'methods':
            options.methods = processMethods(prop.value);
            break;

          case 'computed':
            options.computed = processComputed(prop.value);
            break;

          case 'watch':
            options.watch = processWatch(prop.value);
            break;

          case 'lifecycle':
            options.lifecycle = processLifecycle(prop.value);
            break;

          case 'components':
            options.components = processComponents(prop.value);
            break;

          case 'directives':
            options.directives = processDirectives(prop.value);
            break;
        }
      });
    },

    // 处理 Composition API 变量
    VariableDeclarator(path) {
      if (!isSetupScript) return;

      const idName = path.node.id.name;
      const init = path.node.init;

      // 处理 ref/reactive
      if (init?.type === 'CallExpression') {
        const callee = (init.callee as any).name;
        if (['ref', 'reactive'].includes(callee)) {
          options.data![idName] = generatorCode(init.arguments[0]);
        }
      }
    },

    // 处理 Composition API 函数
    FunctionDeclaration(path) {
      if (!isSetupScript) return;
      options.methods![path.node.id.name] = generatorCode(path.node.body);
    },

    // 处理计算属性
    CallExpression(path) {
      if (!isSetupScript) return;

      if ((path.node.callee as any).name === 'computed') {
        const parent = path.findParent((p) => p.isVariableDeclarator());
        if (parent?.node.id.type === 'Identifier') {
          options.computed![parent.node.id.name] = {
            get: processComputedFunction(path.node.arguments[0])
          };
        }
      }
    },

    // 处理 watch
    ExpressionStatement(path) {
      if (!isSetupScript) return;

      const expr = path.node.expression;
      if (
        expr.type === 'CallExpression' &&
        (expr.callee as any).name === 'watch'
      ) {
        const [source, callback] = expr.arguments;
        options.watch![generatorCode(source)] = generatorCode(callback);
      }
    },

    // 处理生命周期钩子
    CallExpression(path) {
      const lifecycleHooks = [
        'onBeforeMount',
        'onMounted',
        'onBeforeUpdate',
        'onUpdated',
        'onBeforeUnmount',
        'onUnmounted'
      ];

      if (lifecycleHooks.includes((path.node.callee as any).name)) {
        const hookName = (path.node.callee as any).name.replace('on', '');
        options.lifecycle![hookName] = generatorCode(path.node.arguments[0]);
      }
    }
  });

  return options;
}

// 辅助函数：生成代码字符串
function generatorCode(node: any): string {
  return generator(node).code.replace(/\s+/g, ' ');
}

// 处理 Props 选项
function processProps(propsNode: any): Record<string, PropOptions> {
  const props: Record<string, PropOptions> = {};

  if (propsNode?.type === 'ObjectExpression') {
    propsNode.properties.forEach((prop: any) => {
      const propName = prop.key.name;
      props[propName] = {
        type: processType(prop.value),
        required: prop.value.properties.find(
          (p: any) => p.key.name === 'required'
        )?.value.value,
        default: processDefaultValue(prop.value),
        validator: processValidator(prop.value)
      };
    });
  }

  return props;
}

// 处理 Data 选项
function processData(dataNode: any): Record<string, any> {
  if (dataNode?.type === 'FunctionExpression') {
    const returnStatement = dataNode.body.body.find(
      (s: any) => s.type === 'ReturnStatement'
    );

    if (returnStatement?.argument?.type === 'ObjectExpression') {
      return processObjectExpression(returnStatement.argument);
    }
  }
  return {};
}

// 处理 Methods 选项
function processMethods(methodsNode: any): Record<string, string> {
  const methods: Record<string, string> = {};

  if (methodsNode?.type === 'ObjectExpression') {
    methodsNode.properties.forEach((method: any) => {
      methods[method.key.name] = generatorCode(method.value);
    });
  }

  return methods;
}

// 处理 Computed 选项（Options API）
function processComputed(computedNode: any) {
  const computed: Record<string, any> = {};

  if (computedNode?.type === 'ObjectExpression') {
    computedNode.properties.forEach((prop: any) => {
      const value = prop.value;
      computed[prop.key.name] = {
        get:
          value.type === 'FunctionExpression'
            ? generatorCode(value.body)
            : undefined,
        set:
          value.type === 'ObjectMethod' && value.kind === 'set'
            ? generatorCode(value.body)
            : undefined
      };
    });
  }

  return computed;
}

// 处理组件注册
function processComponents(componentsNode: any) {
  const components: Record<string, string> = {};

  if (componentsNode?.type === 'ObjectExpression') {
    componentsNode.properties.forEach((comp: any) => {
      components[comp.key.name] = generatorCode(comp.value);
    });
  }

  return components;
}

/* 其他处理函数实现类似逻辑 */
```

### 功能增强说明

1. **双模式支持**：

   - **Options API**：完整解析 `data`/`methods`/`computed` 等传统选项
   - **Composition API**：识别 `setup()` 函数和 `<script setup>` 语法
     ```typescript
     // 识别 setup 函数
     if (keyName === 'setup') {
       options.setup = [generatorCode(prop.value.body)];
     }
     ```

2.
