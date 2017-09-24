// *** Начало работы ***

// npm init - инициализация проекта

// npm install - установка модулей из зависимостей в package.json

// $(npm bin)/typings install - установка типов данных для typescript

// проверить настройки путей, названия бандлов и содержание title
// 1) let config - настройка путей
// 2) output.filename - filename название js бандла
// 3) HtmlWebpackPlugin - title содержание тега title

// npm run serve - компиляция с последующим запуском сервера по адресу http://localhost:8080/

// *** Режимы работы ***

// npm run dev - автокомпиляция файлов по сохранению с отслеживанием прогресса в консоли

// npm run prod - компиляция файлов в production, где бандлы минифицированны

// npm run e2e - запуск end to end тестов с использованием protractor и jasmine
// - перед запуском в 1-й раз поссле npm install и $(npm bin)/typings install запсутить обновление селениума:
// $(npm bin)/webdriver-manager update
// - перед каждым запуском команда: npm run serve - для доступа к запущенному приложению

// npm run test - запуск всех юнит тестов с использованием karma и jasmine



// Errors

// Еслт установлен zone.js 0.8.13, это вызовет ошибку, чтобы устранить ее необходимо откатить до 0.8.12 версии

// -- Импорт плагинов webpack
// импорт самого webpack
const webpack = require('webpack');
// плагин - компилятор html, особенно полезен для добавления хэшей к бандлам
const HtmlWebpackPlugin = require('html-webpack-plugin');
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
      // список точек вхождения - файлы на которое забито приложение
      entry: {
        // точка вхождения - файл typescript из source, который будет основным в бандле
        app: './src/app/app.module.ts',
        // файл typescript, в котором будут собраны статические зависимые модули
        vendor: ['./src/app/vendor.ts'],
      },
    },
  },
};

// модуль конфигурация
module.exports = {
  // настройка генерируемых файлов
  entry: config.paths.src.entry,
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
        // исключить из обработки
        exclude: /node_modules/,
        // raw-loader - загружает стили в виде строки
        // postcss-loader - обработчик postcssб использующий плагины из файла настроек - postcss.config.js, на пример autoprefixer
        // sass-loader - плагин использует node-sass для компиляции css из scss и/или sass
        use: ['raw-loader', 'postcss-loader', 'sass-loader'],//css-loader
        // путь выгрузки сгенерированных файлов
        // publicPath: config.paths.dev,
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
          // angular-router-loader - загрузчик для парсинга loadChildren поля в роутах
          'angular-router-loader',
          // angular2-template-loader - лоадер загружат модулями файлы шаблонов и стилей из templateUrl, styleUrls компонентов
          'angular2-template-loader'
        ],
        exclude: [
          /\.spec\.ts$/,
          './e2e/'
        ],
      },
      {
        // regexp для файлов векторного изображения
        test: /\.svg$/,
        // обратная очередь обработчиков файлов
        use: [
          // file-loader - плагин, который инструктирует webpack загружать требуемый обьект как файл, возвращая его url
          'file-loader'
        ]
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
    // внешний ip - 0.0.0.0:8080
    host: '192.168.1.143',
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