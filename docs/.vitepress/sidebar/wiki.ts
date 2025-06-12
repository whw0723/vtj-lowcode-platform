export default [
  {
    base: '/wiki',
    items: [
      { text: '概述', link: '/' },
      {
        text: '核心架构',
        base: '/wiki/core',
        link: '/',
        items: [
          { text: '引擎、提供程序和服务', link: '/engine-provider-and-service' }
        ]
      },
      { text: '包结构', base: '/wiki/package', link: '/', items: [] }
    ]
  }
];
