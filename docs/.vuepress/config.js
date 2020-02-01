module.exports = {
  port: 8083,
  title: 'TypeScript开发教程',
  base: '/typescript/',
  description: '目录',
  head: [
    ['link', { rel: 'icon', href: '/images/typescript.png' }]
  ],
  themeConfig: {
    // The navigation bar
    nav: [
      {
        text: 'GitHub',
        link: 'https://github.com/dengwb1991/typescript-development-tutorial'
      }
    ],
    // The sidebar
    sidebar: [
      {
        title: '初识篇',
        collapsable: false,
        children: [
          'introduce/what-is-typescript',
          'introduce/install-typescript',
          'introduce/hello-typescript'
        ]
      },
      {
        title: '基础篇',
        collapsable: false,
        children: [
          'basics/basis-data-types',
          'basics/interface',
          'basics/function',
          'basics/class',
          'basics/class-and-interface',
          'basics/generics',
          'basics/type-check-mechanism',
          'basics/advanced-type'
        ]
      },
      {
        title: '工程篇',
        collapsable: false,
        children: [
          'project/import-export',
          'project/namespace',
          'project/declaration-merging',
          'project/identify-the-class-library',
          'project/declaration-files',
          'project/compile-tools'
        ]
      },
      {
        title: '配置篇',
        collapsable: false,
        children: [
          'configuration/file-options',
          'configuration/compiler-options',
          'configuration/vscode-compiler'
        ]
      },
      {
        title: '实战篇',
        collapsable: false,
        children: [
          'actual/typescript-react',
          'actual/react-component-type',
          'actual/typescript-vue',
          'actual/vue-component-type',
          'actual/typescript-eslint'
        ]
      }
    ],
    lastUpdated: 'Last Updated'
  }
}