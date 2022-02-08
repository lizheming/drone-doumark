const path = require('path');
const { constants } = require('fs');
const fs = require('fs/promises');

module.exports = class FileStore {
  constructor({type, dir}) {
    this.filename = path.join(__dirname, dir, `${type}.json`);
  }

  async parse(data) {
    return JSON.parse(data);
  }

  async stringify(data) {
    return JSON.stringify(data, null, '\t');
  }

  async format(item) {
    return item
  }

  async get() {
    const isExist = await fs.access(this.filename, constants.F_OK).then(() => true, () => false);
    const text = isExist ? (await fs.readFile(this.filename, 'utf-8')) : '[]';
    return this.parse(text);
  }

  async set(data) {
    const text = await this.stringify(data);
    return fs.writeFile(this.filename, text, 'utf-8');
  }
}