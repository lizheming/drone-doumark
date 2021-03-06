const { configParser, exec } = require('./plugin');
configParser({
  id: {
    usage: '豆瓣 ID',
    env: 'PLUGIN_ID,DOUBAN_ID,INPUT_ID'
  },
  type: {
    usage: '数据类型，可选值：movie, book, music',
    env: 'PLUGIN_TYPE,DOUBAN_TYPE,INPUT_TYPE',
    def: 'movie'
  },
  format: {
    usage: '存储数据格式，可选值：csv, json',
    env: 'PLUGIN_FORMAT,DOUBAN_FORMAT,INPUT_FORMAT',
    def: 'csv'
  },
  dir: {
    usage: '记录存储目录',
    env: 'PLUGIN_DIR,DOUBAN_DIR,INPUT_DIR',
    def: './'
  },
  notion_token: {
    usage: 'Notion 机器人 Token',
    env: 'PLUGIN_NOTION_TOKEN,DOUBAN_NOTION_TOKEN,NOTION_TOKEN,INPUT_NOTION_TOKEN',
  }
})(exec);