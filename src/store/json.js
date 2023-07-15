const path = require('path');
const dayjs = require('dayjs');
const { constants } = require('fs');
const fs = require('fs/promises');
const fse = require('fs-extra');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

module.exports = class FileStore {
  constructor({type, dir}) {
    this.type = type;
    this.filename = path.join(dir, `${type}.json`);
  }

  async parse(data) {
    return JSON.parse(data);
  }

  async stringify(data) {
    Array.isArray(data) && data.length && data.forEach(item => {
      if (!item || !item.subject || !item.subject.id) {
        return;
      }

      item.subject.cover_url = `https://dou.img.lithub.cc/${this.type}/${item.subject.id}.jpg`;
    });
    
    return JSON.stringify(data, null, '\t');
  }

  format(item) {
    return item;
  }

  async get() {
    const isExist = await fs.access(this.filename, constants.F_OK).then(() => true, () => false);
    const text = isExist ? (await fs.readFile(this.filename, 'utf-8')) : '[]';
    this._data = await this.parse(text);
    return this._data.map(item => ({
      ...item,
      star_time: dayjs(item.star_time, 'YYYY-MM-DD HH:mm:ss').valueOf()
    }));
  }

  async set(data) {
    const text = await this.stringify(data.concat(this._data));
    await fse.ensureFile(this.filename);
    return fs.writeFile(this.filename, text, 'utf-8');
  }
}