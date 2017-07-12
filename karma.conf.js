const path = require('path');
const webpack = require('webpack');
let configFiles = {
  paths: {
    // папка для development
    dev: 'dev/',
    // папка для sources
    src: {
      // путь до корневой папки source файлов
      root: './src',
      // путь до html файлов
      html: './src/index.html',
      // путь до typescript файлов
      ts: './src/app.ts',
    },
  },
};

module.exports = function (config) {
  config.set({
    browsers: ['Chrome'/*, 'Firefox', 'IE', 'Opera'*/],
    singleRun: false,
    concurrency: Infinity,
    basePath: './',
    frameworks: ['jasmine',],
    plugins: [
      require('karma-jasmine'),
      require('karma-webpack'),
      require('karma-sourcemap-loader'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
    ],
    preprocessors: {
      'test.bundle.js': ['webpack', 'sourcemap']
    },
    webpack: {
      devtool: 'inline-source-map',
      resolve: {
        extensions: ['.ts', '.js'],
      },
      module: {
        rules: [
          { test: /\.ts$/, use: 'ts-loader', },
        ]
      },
      stats: {
        colors: true,
        reasons: true,
      },
      plugins: [
        new webpack.ContextReplacementPlugin(
          // regexp - фильтр который находит модули
          /angular(\\|\/)core(\\|\/)@angular/,
          // путь файлов, которые загружают модули
          path.resolve(configFiles.paths.src.root),
          {}
        ),
      ],
      watch: true,
    },
    webpackMiddleware: {
      // webpack-dev-middleware configuration
      stats: 'errors-only',
    },
    client: {
      clearContext: false,
    },
    files: [
      { pattern: 'test.bundle.js', watched: false, },
    ],
    mime: {
      'text/x-typescript': ['ts', 'tsx',],
    },
    reporters: ['progress', 'kjhtml',],
    port: 3001,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
  });
};