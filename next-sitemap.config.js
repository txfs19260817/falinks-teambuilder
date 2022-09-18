/** @type {import('next-sitemap').IConfig} */
import { AppConfig } from './src/utils/AppConfig';

const config = {
  siteUrl: process.env.SITE_URL || AppConfig.canonical,
  changefreq: 'daily',
  priority: 0.7,
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  exclude: ['/404', '/500', '/_error', '/room', '/pastes/public/*', '/pastes/vgc/*'],
  sitemapSize: 5000
};

export default config;
