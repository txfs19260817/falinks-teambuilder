/** @type {import('next-sitemap').IConfig} */

const config = {
  siteUrl: 'https://www.falinks-teambuilder.com',
  changefreq: 'daily',
  priority: 0.7,
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  exclude: ['/404', '/500', '/_error', '/room', '/pastes/public/*', '/pastes/vgc/*'],
  sitemapSize: 5000
};

export default config;
