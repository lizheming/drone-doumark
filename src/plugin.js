const dayjs = require('dayjs');
const process = require('process');
const Stores = require('./store');
const { sleep } = require('./helper');
const fetchDouban = require('./douban');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

module.exports = {
  configParser(configs) {
    const ret = {};
    for (const configName in configs) {
      const { env, def } = configs[configName];
      if (def !== undefined) {
        ret[configName] = typeof def === 'function' ? def() : def;
      }
      env.split(/\s*,\s*/).some(envar => {
        if (process.env.hasOwnProperty(envar)) {
          ret[configName] = process.env[envar];
          return true;
        }
        return false;
      });
    }
    return fn => fn(ret);
  },
  async exec({ id, type, status, format, dir, notion_token }) {
    const Store = Stores[format];
    if(!Store) {
      throw new Error(`当前选择的存储类型为 ${storeType}，它尚未被支持`);
    }
    const store = new Store({ type, dir, notion_token });
  
    // 读取之前的 mark 记录
    const local = await store.get();
    const localLastestMarkTime = !Array.isArray(local) || !local.length ? 0 : local[0].star_time;
  
    // 获取新的历史记录
    const appendSubjects = [];
    let offset = 0;
    do {
      const { interests } = await fetchDouban({user: id, type, status, offset});
      if (!Array.isArray(interests) || !interests.length) {
        break;
      }
      offset += interests.length;
  
      const subjects = interests.filter(({create_time}) => {
        const starTime = dayjs(create_time, 'YYYY-MM-DD HH:mm:ss').valueOf();
        return starTime > localLastestMarkTime;
      });
      appendSubjects.push(...subjects);
  
      const lastItemTime = dayjs(interests[interests.length - 1].create_time, 'YYYY-MM-DD HH:mm:ss').valueOf();
      if(lastItemTime <= localLastestMarkTime) {
        break;
      }
  
      await sleep(Math.round(Math.random() * 2) + 1);
    } while(true);
  
    // 合并存储
    await store.set(appendSubjects.map(store.format.bind(store)));
  }
};