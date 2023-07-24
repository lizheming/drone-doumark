const { request } = require('undici');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);
const { sleep } = require('../helper');

const STATUS_MAP = {
  'done': 'complete',
  'doing': 'progress',
  'mark': 'wishlist',
  'complete': 'done',
  'progress': 'doing',
  'wishlist': 'mark',  
};

module.exports = class NeoDBStore {
  constructor({type, status, neodb_token}) {
    this.type = type;
    this.status = status;
    this.token = neodb_token;
  }

  request({ method, url, data }) {
    url = 'https://neodb.social' + url;
    if (method === 'GET' && data) {
      url += '?' + (new URLSearchParams(data)).toString();
    }

    return request(url, {
      method,
      body: method !== 'GET' ? JSON.stringify(data) : undefined,
      headers: {
        authorization: `Bearer ${this.token}`,
        accept: 'application/json',
        'content-type': method !== 'GET' ? 'application/json' : undefined,
      }
    }).then(({ body }) => body.text());
  }

  async fetchSubjectUUID(item) {
    const neodbItem = JSON.parse(await this.request({
      url: '/api/catalog/fetch',
      method: 'GET',
      data: {
        url: item.subject.url
      }
    }));
    
    if (!neodbItem.uuid) {
      await sleep(1);
      return this.fetchSubjectUUID(item);
    }

    return neodbItem;
  }

  async markItemNeodb(neodbItem, item) {
    return this.request({
      url: `/api/me/shelf/item/${neodbItem.uuid}`,
      method: 'POST',
      data: {
        shelf_type: STATUS_MAP[this.status],
        visibility: 0,
        comment_text: item.comment,
        rating_grade: item.rating ? item.rating.star_count * 2 : undefined,
        created_time: dayjs(item.create_time, 'YYYY-MM-DD HH:mm:ss'),
        post_to_fediverse: false,
        tags: item.tags,
      }
    });
  }
  
  format(item) {
    return item;
  }

  async get() {
    const resp = JSON.parse(await this.request({
      method: 'GET',
      url: `/api/me/shelf/${STATUS_MAP[this.status]}`,
      data: {
        category: this.type,
        page: 1
      }
    }));

    resp.data.forEach(item => {
      item.star_time = (new Date(item.created_time)).getTime();
    });

    return resp.data;
  }

  async set(data) {
    for(let i = 0; i < data.length; i++) {
      const subject = data[i];
      const neodbItem = await this.fetchSubjectUUID(subject);
      await this.markItemNeodb(neodbItem, subject);
    }
  }
}
