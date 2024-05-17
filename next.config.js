/* eslint-disable import/no-extraneous-dependencies */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

const { i18n } = require('./next-i18next.config');

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  eslint: {
    dirs: ['.']
  },
  images: { domains: ['play.pokemonshowdown.com'] },
  staticPageGenerationTimeout: 600,
  poweredByHeader: false,
  trailingSlash: true,
  basePath: '',
  // The starter code load resources from `public` folder with `router.basePath` in React components.
  // So, the source code is "basePath-ready".
  // You can remove `basePath` if you don't need it.
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/pastes/vgc',
        destination: '/pastes/vgc/gen9vgc2024regg' // Update the path when a new VGC format is released
      },
      {
        source: '/usages/vgc',
        destination: '/usages/vgc/gen9vgc2024regg' // Update the path when a new VGC format is released
      },
      {
        source: '/usages/smogon',
        destination: '/usages/smogon/gen9vgc2024regg' // Update the path when a new VGC format is released
      },
      {
        source: '/replays',
        destination: '/replays/gen9vgc2024regg' // Update the path when a new format is released
      }
    ];
  },
  i18n
  // compress: false,
  // webpack(webpackConfig) {
  //   return {
  //     ...webpackConfig,
  //     optimization: {
  //       minimize: false
  //     }
  //   };
  // }
};

module.exports = withBundleAnalyzer(nextConfig);
