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
          'basics/type-check-mechanism'
        ]
      }
    ],
    lastUpdated: 'Last Updated'
  }
}