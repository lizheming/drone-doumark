const { Client } = require("@notionhq/client");

const PROPERTIES = {
  title: 'title',
  subtitle: 'rich_text',
  intro: 'rich_text',
  rating: 'number',
  star: 'number',
  url: 'url',
  poster: 'file',
  star_time: 'date',
  pubdate: 'date',
  id: 'number',
  genres: 'multi_select'
};

const FORMATS = {
  title(val) {
    return [
      {
        "type": "text",
        "text": {
          "content": val,
          "link": null
        },
        "plain_text": val,
      }
    ]
  },
  rich_text(val) {
    return this.title(val);
  },
  number(val) {
    return val;
  },
  url(val) {
    return val;
  },
  file(val) {
    if(!Array.isArray(val)) {
      val = [val];
    }
    return val.map(url => ({
      name: url,
      title: url,
      type: 'external',
      external: { url }
    }));
  },
  date(val) {
    return {
      "start": val,
      "end": null,
      "time_zone": 8
    };
  },
  multi_select(val) {
    return val.map(name => ({ name }));
  }
}
module.exports = class NotionStore {
  constructor({dir, notion_token}) {
    this.database_id = dir;
    this.notion = new Client({
      auth: notion_token,
    });
  }

  async parse({ results }) {
    return results.map(({properties}) => ({
      star_time: properties.star_time.date.start
    }));
  }

  async stringify(data) {
    const item = {};
    for(const i in PROPERTIES) {
      if(data[i] === undefined) {
        continue;
      }

      item[i] = {
        type: PROPERTIES[i],
        [PROPERTIES[i]]: FORMATS[PROPERTIES[i]](data[i])
      };
    }
    return item;
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
      genres: subject.genres,
      star: subject.rating.star_count,
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
    }
  }
}