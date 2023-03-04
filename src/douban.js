const { request } = require('undici');
const {
  DOUBAN_API_HOST = 'frodo.douban.com',
  DOUBAN_API_KEY = '0ac44ae016490db2204ce0a042db2916',
  AUTH_TOKEN,
} = process.env;

module.exports = async function fetchSubjects({user, type, status, offset }) {
  const url = `https://${DOUBAN_API_HOST}/api/v2/user/${user}/interests`;
  const params = new URLSearchParams({
    type,
    status: status || 'done',
    count: 50,
    start: offset,
    apiKey: DOUBAN_API_KEY
  });

  return request(url + '?' + params.toString(), {
    headers: {
      host: DOUBAN_API_HOST,
      authorization: AUTH_TOKEN ? 'Bearer ' + AUTH_TOKEN : '',
      'user-agent': 'User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 15_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.16(0x18001023) NetType/WIFI Language/zh_CN',
      referer: 'https://servicewechat.com/wx2f9b06c1de1ccfca/84/page-frame.html'
    }
  }).then(({body}) => body.json());
}
