const path = require('path');
const { constants } = require('fs');
const fs = require('fs/promises');
const fse = require('fs-extra');

module.exports = class FileStore {
  constructor({type, dir}) {
    this.filename = path.join(dir, `${type}.json`);
  }

  async parse(data) {
    return JSON.parse(data);
  }

  async stringify(data) {
    return JSON.stringify(data, null, '\t');
  }

  format(item) {
    return item;
  }

  async get() {
    const isExist = await fs.access(this.filename, constants.F_OK).then(() => true, () => false);
    const text = isExist ? (await fs.readFile(this.filename, 'utf-8')) : '[]';
    this._data = await this.parse(text);
    return this._data;
  }

  async set(data) {
    const text = await this.stringify(data.concat(this._data));
    await fse.ensureFile(this.filename);
    return fs.writeFile(this.filename, text, 'utf-8');
  }
}