// *** Начало работы ***

// npm init - инициализация проекта

// npm install - установка модулей из зависимостей в package.json

// $(npm bin)/typings install - установка типов данных для typescript

// проверить настройки путей, названия бандлов и содержание title
// 1) let config - настройка путей
// 2) output.filename - filename название js бандла
// 3) HtmlWebpackPlugin - title содержание тега title
// 4) ExtractTextPlugin - filename название css бандла

// npm run serve - компиляция с последующим запуском сервера по адресу http://localhost:8080/

// *** Режимы работы ***

// npm run dev - автокомпиляция файлов по сохранению с отслеживанием прогресса в консоли

// npm run prod - компиляция файлов в production, где бандлы минифицированны



// Errors

// Еслт установлен zone.js 0.8.13, это вызовет ошибку, чтобы устранить ее необходимо откатить до 0.8.12 версии

// -- Импорт плагинов webpack
// импорт самого webpack
const webpack = require('webpack');
// плагин - компилятор html, особенно полезен для добавления хэшей к бандлам
const HtmlWebpackPlugin = require('html-webpack-plugin');
// плагин - извлекает импортированный css в отдельный файл
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// нативный модуль - работа с путями
const path = require('path');
// включен ли webpack с ключем -p (проверка на production версию сборки)
const isProduction = process.argv.indexOf('-p') > -1;
// обьект с путями
let config = {
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
      entry: './src/app/app.ts',
      // файл typescript, в котором будут собраны статические зависимые модули
      vendor: ['./src/app/vendor.ts'],
    },
  },
};

// модуль конфигурация
module.exports = {
  // настройка генерируемых файлов
  entry: {
    // файл typescript, в котором будут собраны статические зависимые модули
    vendor: config.paths.src.vendor,
    // точка вхождения - файл typescript из source, который будет основным в бандле
    app: config.paths.src.entry,
  },
  // настройка сгенерированных бандлов
  output: {
    // место выгрузки
    path: path.resolve(__dirname, config.paths.dev),
    // название бандла
    filename: '[name].js',
  },
  // модули конфигурации
  module: {
    // массив с обьектами правил, в которых test - regexp которому соответсвует файл и use - где хранится обратная
    // очередь обработчиков файлов
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
        // обратная очередь обработчиков файлов
        use: ExtractTextPlugin.extract({
          // style-loader - загружает стили сразу в DOM
          //fallback: 'style-loader',
          // css-loader - загружает стили в js файл парсит @import и url() как import/require() и позволяет их
          // использовать
          // raw-loader - загружает стили в виде строки
          // sass-loader - плагин использует node-sass для компиляции css из scss и/или sass
          use: ['raw-loader', 'sass-loader'],//css-loader
          // путь выгрузки сгенерированных файлов
          // publicPath: config.paths.dev,
        }),
      },
      {
        // regexp для typescript файлов
        test: /\.ts$/,
        // обратная очередь обработчиков файлов ts-loader
        use: [
          {
            // awesome-typescript-loader - ускоренный вариант компилятора typescript 
            loader: 'awesome-typescript-loader',
            // опции лоадера
            options: {
              // испльзовать кэш
              useCache: true,
              // путь для хранения кэша
              cacheDirectory: '.awcache'
            }
          },
          // angular2-template-loader - лоадер загружат модулями файлы шаблонов и стилей из templateUrl, styleUrls компонентов
          'angular2-template-loader'
        ],
      },
      {
        // regexp для файлов растрового изображения
        test: /\.(png|jpe?g|gif)$/i,
        // обратная очередь обработчиков файлов
        use: [
          // file-loader - плагин, который инструктирует webpack загружать требуемый обьект как файл, возвращая его url
          'file-loader',
          // image-webpack-loader - плагин, который обьединяет в себе:
          // gifsicle — сжимает GIF,
          // mozjpeg — сжимает JPEG,
          // optipng — сжимает PNG,
          // svgo — сжимает SVG,
          // pngquant — сжимает PNG,
          // загрузчик изображений
          {
            loader: 'image-webpack-loader',
            // настройка плагинов - составных частей image-webpack-loader
            query: {
              mozjpeg: {
                // создать baseline jpeg файл
                progressive: true,
              },
              optipng: {
                // OptiPNG - уровень оптимизации от 0 до 7, где 7 - наибольшее сжатие
                optimizationLevel: 7,
              },
              gifsicle: {
                // подготовка gif для прогресиивного рендеринга
                interlaced: false,
              },
              // Pngquant - свойство с настройкой одноименного плагина
              pngquant: {
                // колличество используемых цветов - от 0 до 100
                quality: '65-90',
                // отношение скорость - качество сжатия, где 1 - наибольшее сжатие, 10 - наиболее быстро
                speed: 4
              }
            }
          },
        ],
      },
      {
        // regexp для файлов шрифтов нового формата
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        // обратная очередь обработчиков файлов
        use: [
          {
            // url-loader работает как file-loader, но может вернуть DataURL если файл меньше бит лимита
            loader: 'url-loader',
            // опции лоадера
            options: {
              // бит лимита до которого файлы загружаются как DataURL
              limit: 10000,
              // mime тип файла
              mimetype: 'application/font-woff',
            },
          },
        ],
      },
      {
        // regexp для файлов шрифтов старого формата
        test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        // обратная очередь обработчиков файлов
        use: [
          // file-loader - плагин, который инструктирует webpack загружать требуемый обьект как файл, возвращая его url
          { loader: 'file-loader' },
        ]
      },
    ],
  },
  // настройка module resolve - процесса анализа импортируемых модулей при компиляции
  resolve: {
    // автоматическое разрешение импорта из файлов
    extensions: ['.ts', '.js'],
  },
  // настройка source map, где значение:
  // source-map - создать файл типа bundle.js.map
  // eval - помещает все модули в функцию eval(), отображая код модулей прошедших компиляцию, наиболее быстрый вариант
  // eval-source-map - работает как eval, но показывает исходные файл, какие они были до компиляции, медленне eval
  devtool: isProduction ? 'source-map' : 'eval-source-map',
  // настройка webpack-dev-server
  devServer: {
    // папка, которая будет корнем проекта
    publicPath: "/",
    // папка, которая будет корнем для сервера
    contentBase: path.join(__dirname, config.paths.src.root),
    // gzip сжатие
    compress: true,
    // вывод статистики: errors-only - только ошибки, minimal - вывод ошибок или то что новая компиляция прошла,
    // none - ничего не выводит, normal - стандартный вывод, verbose - выводить все
    stats: 'errors-only',
    // автооткрытие вкладки в браузере при запуске сервера
    open: false,
  },
  // webpack плагины - массив обьектов настройщиков для импортированных плагинов
  plugins: [
    // настройка компиляции html
    new HtmlWebpackPlugin({
      // контент тега title
      // title: 'Расчет ЭОС',
      // минификация html
      minify: {
        // удаление пробелов
        collapseWhitespace: true,
      },
      // добавление хэшей к бандлам js и css файлов
      hash: true,
      // путь шаблонов используемых в компиляции
      template: config.paths.src.html,
      // chunks - файлы загружаемые на страницу
      chunks: ['app', 'vendor'],
    }),
    // настройка извлечения css файлов
    new ExtractTextPlugin({
      // название бандла
      filename: 'app.css',
      // включен ли плагин
      disable: false,
      // извлечение из всех чанков, по умолчанию только из первых - когда false
      allChunks: true,
    }),
    // плагин убирает предупреждения о использовании выражений как путей для загрузки модулей - the request of a dependency is an expression
    // плагин webpack для замены динамических загрузок модулей - когда модуль выбирается в итоге вычисления выражения
    new webpack.ContextReplacementPlugin(
      // regexp - фильтр который находит модули
      /angular(\\|\/)core(\\|\/)@angular/,
      // путь файлов, которые загружают модули
      path.resolve(config.paths.src.root),
      {}
    ),
    // плагин убирает дублирующиеся модули из файлов перечисленных в entry, собирая их в отдельный чанк
    new webpack.optimize.CommonsChunkPlugin({
      // имя чанка
      name: 'vendor',
      // количество модулей, которые могут использовать чанк
      // значение Infinity - гарантирует, что никакой другой модуль входит в кусок поставщика
      minChunks : Infinity,
    }),
  ],
};