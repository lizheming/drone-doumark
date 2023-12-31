const { Client } = require("@notionhq/client");
const { sleep } = require('../helper');

const PROPERTIES = {
  title: 'title',
  subtitle: 'rich_text',
  intro: 'rich_text',
  rating: 'number',
  star: 'number',
  ustar: 'number',
  tags: 'multi_select',
  comment: 'rich_text',
  url: 'url',
  poster: 'files',
  star_time: 'rich_text',
  pubdate: 'rich_text',
  id: 'number',
  genres: 'multi_select',
};

const FORMATS = {
  title(val) {
    return [
      {
        "text": {
          "content": val
        },
      }
    ]
  },
  rich_text(val) {
    const valFitin = val.length <= 2000 ? val : val.substring(0, 2000);
    return this.title(valFitin);
  },
  number(val) {
    return Number(val);
  },
  url(val) {
    return val;
  },
  files(val) {
    if(!Array.isArray(val)) {
      val = [val];
    }
    return val.map(url => ({
      name: url.split('/').pop(),
      type: 'external',
      external: { url }
    }));
  },
  date(val) {
    return {
      "start": val,
      "end": null,
      "time_zone": 'Asia/Shanghai'
    };
  },
  select(name) {
    return { name };
  },
  multi_select(val) {
    return val.map(name => ({ name }));
  }
}
module.exports = class NotionStore {
  constructor({type, dir, notion_token}) {
    this.type = type;
    this.database_id = dir;
    this.notion = new Client({
      auth: notion_token,
    });
  }

  async parse({ results }) {
    return results.filter(({ properties: { star_time } }) => 
      star_time && Array.isArray(star_time.rich_text) && star_time.rich_text.length
    ).map(({properties}) => ({
      star_time: new Date(properties.star_time.rich_text[0].text.content).getTime()
    }));
  }

  async stringify(data) {
    const item = {};
    for(const i in PROPERTIES) {
      if(data[i] === undefined) {
        continue;
      }

      item[i] = {
        [PROPERTIES[i]]: FORMATS[PROPERTIES[i]](data[i])
      };
    }
    return item;
  }

  format({
    create_time,
    subject,
    rating,
    comment,
    tags,
  }) {
    const item = {
      id: subject.id,
      title: subject.title,
      subtitle: subject.card_subtitle,
      intro: subject.intro,
      poster: `https://dou.img.lithub.cc/${this.type}/${subject.id}.jpg`,
      pubdate: subject.pubdate[0],
      url: subject.url,
      rating: subject?.rating?.value,
      genres: subject.genres,
      star: rating?.star_count,
      tags: tags,
      comment: comment,
      star_time: create_time,
    };

    for(const i in item) {
      if(item[i] === undefined) delete item[i];
    }

    return item;
  }

  async get() {
    const data = await this.notion.databases.query({
      database_id: this.database_id,
      sorts: [
        {
          property: 'star_time',
          direction: 'descending',
        },
      ],
      page_size: 1
    });

    return this.parse(data);
  }

  async set(data) {
    for(let item of data) {
      const properties = await this.stringify(item);
      await this.notion.pages.create({
        parent: {
          database_id: this.database_id,
        },
        properties,
      });
      await sleep(0.5);
    }
  }
}
