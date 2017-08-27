const path = require('path');
const webpack = require('webpack');
// плагин - извлекает импортированный css в отдельный файл
const configFiles = {
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
      ts: './src/app.module.ts',
    },
  },
};

module.exports = function (config) {
  config.set({
    autoWatchBatchDelay: 1000,
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
          {
            // regexp для шаблонов компонентов
            test: /\.html$/,
            // обратная очередь обработчиков файлов
            use: [
              {
                // загрузчик html шаблонов
                loader: 'html-loader',
                // опции загрузчика
                options: {
                  // включить минификацию
                  minimize: true,
                  // удалить кавычки у атрибутов тегов
                  removeAttributeQuotes: false,
                  // чувствительность к регистру
                  caseSensitive: true,
                  // обернуть кастомные атрибуты
                  customAttrSurround: [ [/#/, /(?:)/], [/\*/, /(?:)/], [/\[?\(?/, /(?:)/] ],
                  // назначить кастомные атрибуты
                  customAttrAssign: [ /\)?\]?=/ ] 
                }
              }
            ]
          },
          {
            // regexp для файлов стилей
            test: /\.(scss|css)$/,
            // исключить из обработки
            exclude: /node_modules/,
            // обратная очередь обработчиков файлов
            // raw-loader - загружает стили в виде строки
            // sass-loader - плагин использует node-sass для компиляции css из scss и/или sass
            use: ['raw-loader', 'sass-loader'],
            // путь выгрузки сгенерированных файлов
            // publicPath: config.paths.dev,
          },
          {
            test: /\.ts$/,
            use: [ 
              'awesome-typescript-loader',
              'angular2-template-loader'
            ],
          },
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