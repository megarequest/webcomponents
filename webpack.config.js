const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const isProd = process.env.NODE_ENV === 'production';
let config = null;

if(isProd){
  config = {
    entry: './src/index.js', // Точка входа
    output: {
      filename: 'bundle.js', // Имя выходного файла
      path: path.resolve(__dirname, 'dist'), // Папка для сборки
    },
    mode: 'production', // Режим production (включает минификацию)
    optimization: {
      minimize: true, // Включает минификацию
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true, // Удаляет console.log
              pure_funcs: ['console.log'], // Удаляет только console.log
              warnings: false, // Отключает предупреждения
              dead_code: true, // Удаляет недостижимый код
              unused: true, // Удаляет неиспользуемый код
            },
            mangle: true, // Сокращает имена переменных
            output: {
              comments: false, // Удаляет комментарии
            },
          },
        }),
      ],
    },
    plugins: [
      new CompressionPlugin({
        algorithm: 'gzip', // или 'brotliCompress'
        test: /\.(js|css|html|svg)$/,
        threshold: 10240, // Сжимать файлы больше 10KB
        minRatio: 0.8,
      }),
    ],
  }
}else{
  config = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    mode: 'development',
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'), // Указываем папку со статическими файлами
      },
      open: true, // Автоматически открывать браузер
      hot: true, // Включить Hot Module Replacement (HMR)
      port: 8080, // Порт для сервера
    },
  }
}


module.exports = config;