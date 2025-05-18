import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    title: 'English Dictionary',
    favicon: 'public/favicon.ico',
  },
  output: {
    distPath: {
      root: 'dist',
      js: 'static/js',
      css: 'static/css',
      svg: 'static/svg',
      font: 'static/fonts',
      image: 'static/images',
      media: 'static/media',
    },
    filename: {
      js: '[name].[hash:8].js',
      css: '[name].[hash:8].css',
      svg: '[name].[hash:8].svg',
      font: '[name].[hash:8][ext]',
      image: '[name].[hash:8][ext]',
      media: '[name].[hash:8][ext]',
    },
  },
  dev: {
    port: 3000,
  },
  tools: {
    bundlerChain: (chain) => {
      chain.output.publicPath('/');
    },
  },
});
