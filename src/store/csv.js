const path = require('path');
const dayjs = require('dayjs');
const { constants } = require('fs');
const fs = require('fs/promises');
const fse = require('fs-extra');
const { parseString, writeToString } = require('fast-csv');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);
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
      headers: true,
      writeHeaders: true,
    });
  }

  format({
    id,
    create_time,
    subject,
  }) {
    const item = {
      id,
      title: subject.title,
      subtitle: subject.card_subtitle,
      intro: subject.intro,
      poster: subject.cover_url,
      pubdate: subject.pubdate[0],
      url: subject.url,
      rating: subject.rating.value,
      genres: Array.isArray(subject.genres) ? subject.genres.join() : undefined,
      star: subject.rating.star_count,
      ustar: rating.star_count,
      comment: comment,
      tags: Array.isArray(tags) ? tags.join() : undefined,
      star_time: create_time,
    };

    for(const i in item) {
      if(item[i] === undefined) delete item[i];
    }

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
