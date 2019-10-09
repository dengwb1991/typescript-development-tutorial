module.exports = {
  port: 8083,
  title: 'TypeScript开发教程',
  base: 'typescript',
  description: '目录',
  themeConfig: {
    // The navigation bar
    nav: [],
    // The sidebar
    sidebar: [
      {
        title: '介绍',
        collapsable: false,
        children: [
            // ['prepare/', 'Introduction'],
            'introduce/what-is-typescript',
            'introduce/install-typescript',
            'introduce/hello-typescript'
        ]
    },
    ],
    lastUpdated: 'Last Updated'
  }
}