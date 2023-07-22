const { configParser, exec } = require('./plugin');
configParser({
  id: {
    usage: '豆瓣 ID',
    env: 'PLUGIN_ID,DOUBAN_ID,INPUT_ID'
  },
  type: {
    usage: '数据类型，可选值：movie, book, music, game',
    env: 'PLUGIN_TYPE,DOUBAN_TYPE,INPUT_TYPE',
    def: 'movie'
  },
  status: {
    usage: '数据状态，可选值：mark, doing, done',
    env: 'PLUGIN_STATUS,DOUBAN_STATUS,INPUT_STATUS',
    def: 'done'
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
  },
  neodb_token: {
    usage: 'NeoDB Token',
    env: 'PLUGIN_NEODB_TOKEN,DOUBAN_NEODB_TOKEN,NEODB_TOKEN,INPUT_NEODB_TOKEN',
  }
})(exec);