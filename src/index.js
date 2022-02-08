const { configParser, exec } = require('./plugin');
configParser({
  id: {
    usage: '豆瓣 ID',
    env: 'PLUGIN_ID,DOUBAN_ID'
  },
  type: {
    usage: '数据类型，可选值：movie, book, music',
    env: 'PLUGIN_TYPE,DOUBAN_TYPE',
    def: 'movie'
  },
  format: {
    usage: '存储数据格式，可选值：csv, json',
    env: 'PLUGIN_FORMAT,DOUBAN_FORMAT',
    def: 'csv'
  },
  dir: {
    usage: '记录存储目录',
    env: 'PLUGIN_DIR,DOUBAN_DIR',
    def: './'
  }
})(exec);