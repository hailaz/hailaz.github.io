// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const { themes } = require('prism-react-renderer');
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '哩度',
  tagline: '',
  url: 'https://hailaz.github.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  staticDirectories: ['project', 'static'],

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  // organizationName: 'facebook', // Usually your GitHub org/user name.
  // projectName: 'docusaurus', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },
  themes: ['@docusaurus/theme-live-codeblock'],
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/hailaz/hailaz.github.io/blob/master/',
        },
        blog: {
          blogSidebarTitle: '全部博文',
          blogSidebarCount: 'ALL',
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/hailaz/hailaz.github.io/blob/master/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: '哩度',
        logo: {
          alt: 'My Site Logo',
          src: 'img/favicon.ico',
        },
        items: [
          // {
          //   type: 'doc',
          //   docId: 'live/index',
          //   position: 'left',
          //   label: '生活',
          // },
          {
            type: 'docSidebar',
            position: 'left',
            sidebarId: 'live',
            label: '生活',
          },
          {
            type: 'docSidebar',
            position: 'left',
            sidebarId: 'learn',
            label: '学习',
          },
          { to: '/blog', label: '博客', position: 'left' },
          {
            href: 'https://www.hailaz.cn/gflearn/docs/index',
            label: 'GFLearn',
            position: 'left',
            target: '_self',
          },
          {
            href: 'https://hailaz.github.io/tools/tools.html',
            label: '工具',
            position: 'right',
          },
          {
            href: 'https://github.com/hailaz',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        copyright: `${new Date()}`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
  plugins: [
    // 多文档
    // [
    //   '@docusaurus/plugin-content-docs',
    //   {
    //     id: 'learn',
    //     path: 'learn',
    //     routeBasePath: 'learn',
    //     // sidebarPath: require.resolve('./sidebars.js'),
    //     // ……其他选项
    //   },
    // ],
    // 搜索
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        hashed: true,
        language: ["zh", "en"],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
  ]
};

module.exports = config;
