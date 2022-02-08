const path = require('path');
const { constants } = require('fs');
const fs = require('fs/promises');
const { parseString, writeToString } = require('fast-csv');
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
    if(subject.title === '暴走财神3')
      console.log(JSON.stringify(subject, null, '\t'));
    const item = {
      id,
      title: subject.title,
      subtitle: subject.card_subtitle,
      intro: subject.intro,
      poster: subject.cover_url,
      pubdate: subject.pubdate[0],
      url: subject.url,
      rating: subject.rating.value,
      genres: JSON.stringify(subject.genres),
      star: subject.rating.star_count,
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
    return this.parse(text);
  }

  async set(data) {
    const text = await this.stringify(data);
    return fs.writeFile(this.filename, text, 'utf-8');
  }
}