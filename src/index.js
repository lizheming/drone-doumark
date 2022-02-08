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
  dir: {
    usage: '记录存储目录',
    env: 'PLUGIN_DIR,DOUBAN_DIR',
    def: './'
  }
})(exec);