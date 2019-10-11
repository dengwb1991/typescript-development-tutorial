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
        title: '介绍',
        collapsable: false,
        children: [
            'introduce/what-is-typescript',
            'introduce/install-typescript',
            'introduce/hello-typescript'
        ]
      },
      {
        title: '基础',
        collapsable: false,
        children: [
            'basics/basis-data-types',
            'basics/interface'
        ]
      }
    ],
    lastUpdated: 'Last Updated'
  }
}