const path = require('path');
const dayjs = require('dayjs');
const { constants } = require('fs');
const fs = require('fs/promises');
const fse = require('fs-extra');
const { parseString, writeToString } = require('fast-csv');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

const HEADERS = [
  [ 'id', ({ id }) => id, ],
  [ 'title', ({ subject: { title }}) => title, ],
  [ 'intro', ({ subject: { intro }}) => intro, ],
  [ 'poster', ({ subject: { cover_url }}) => cover_url, ],
  [ 'pubdate', ({ subject: { pubdate }}) => pubdate[0], ],
  [ 'url', ({ subject: { url }}) => url, ],
  [ 'rating', ({ subject }) => subject?.rating?.value, ],
  [ 'genres', ({ subject }) => Array.isArray(subject.genres) ? subject.genres.join() : undefined, ],
  [ 'star', ({ rating }) => rating?.star_count, ],
  [ 'comment', ({ comment }) => comment, ],
  [ 'tags', ({ tags }) => Array.isArray(tags) ? tags.join() : undefined],
  [ 'star_time',  ({ create_time }) => create_time, ],
  [ 'card', ({ subject }) => subject?.card_subtitle, ],
];

module.exports = class FileStore {
  constructor({type, dir}) {
    this.filename = path.join(dir, `${type}.csv`);
  }

  async parse(data) {
    return new Promise((resolve, reject) => {
      const ret = [];
      parseString(data, {
        headers: true,
      })
        .on('error', reject)
        .on('data', (row) => ret.push(row))
        .on('end', () => resolve(ret));
    });
  }

  async stringify(data) {
    return writeToString(data, {
      headers: HEADERS.map(([key]) => key),
      writeHeaders: true,
    });
  }

  format(item) {
    const row = {};
    for (const [ key, fn ] of HEADERS) {
      const ret = fn(item);
      if (ret !== undefined) {
        row[key] = ret;
      }
    }
    return row;
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
