export default [
  {
    text: '技术揭秘',
    base: '/wiki',
    items: [
      { text: '概述', link: '/' },
      {
        text: '核心架构',
        base: '/wiki/core',
        link: '/',
        items: [
          {
            text: '引擎、提供程序和服务',
            link: '/engine-provider-and-service'
          },
          { text: '项目模型和块模型', link: '/project-and-block-models' },
          {
            text: '代码生成和解析管道',
            link: '/code-generation-and-parsing-pipeline'
          }
        ]
      },
      {
        text: '包结构和 monorepo',
        base: '/wiki/package',
        link: '/',
        items: [
          { text: '设计器和渲染器', link: '/designer-and-renderer' },
          { text: 'UI 组件库', link: '/ui-component-library' },
          { text: '图表和可视化', link: '/charts-and-visualization' }
        ]
      }
    ]
  }
];
