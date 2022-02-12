![](assets/douban.png)
## drone-doumark

[![Build Status](https://cloud.drone.io/api/badges/lizheming/drone-doumark/status.svg)](https://cloud.drone.io/lizheming/drone-doumark)

Drone plugin for Douban movie/book/music marked data sync automatically.
## Configuration

- `PLUGIN_ID`: Douban ID
- `DOUBAN_ID`: Same as `PLUGIN_ID`
- `PLUGIN_TYPE`: Douban data Type, enum value: movie, book, music, default `movie`
- `DOUBAN_TYPE`: Same as `PLUGIN_TYPE`
- `PLUGIN_FORMAT`: Douban data store format, enum value：csv, json, notion, default `csv`
- `DOUBAN_FORMAT`: Same as `PLUGIN_FORMAT`
- `PLUGIN_DIR`: Target where douban data sync to. It's a file path for `csv` and `json` format, and a notion database id for `notion` format. 
- `DOUBAN_DIR`: Same as `PLUGIN_DIR`
- `PLUGIN_NOTION_TOKEN`: Notion Integration Token
- `DOUBAN_NOTION_TOKEN`: Same as `PLUGIN_NOTION_TOKEN`
- `NOTION_TOKEN`: Same as `PLUGIN_NOTION_TOKEN`
## How to use

### Sync to CSV file

Copy as `.drone.yml` file into your repo. Then set a `@houly` schedule cronjob at drone web page.

```yml
# .drone.yml
kind: pipeline
type: docker
name: default

clone:
  disable: true

steps:
- name: douban
  image: lizheming/drone-doumark
  settings:
    id: lizheming
    type: movie
    format: csv
    dir: ./data/douban
```

RUN with docker directly:
```
docker run --rm \
  -e PLUGIN_ID=lizheming
  -e PLUGIN_TYPE=movie
  -e PLUGIN_FORMAT=csv
  -e PLUGIN_DIR=./data/douban
  lizheming/drone-doumark
```

### Sync to Notion

1. Create a Notion Integration at [My Integrations - Notion](https://www.notion.so/my-integrations). And here you can get `NOTION_TOKEN`.
    - Associated workspace: You should select workspace which you should store.
    - Capabilities: Both of `Read`, `Update` and `Insert` content abilities shoud checked.
2. Duplicate database by click <kbd>Duplicate</kbd> at the top right postion of <[Movie](https://lizheming.notion.site/d8a363df3ca84ca89ef52208ad874e3b) | [Book](https://lizheming.notion.site/488c17fd89fb424591f68f7cfb029020) | [Music](https://lizheming.notion.site/d80ca60213c54ab99c4376caec0be9d7)> page.
3. Share database to your Integration by inviting it with <kbd>Share</kbd> - <kbd>Invite</kbd> at the top right postion. And you can get database id, the first random string from url.
4. Copy as `.drone.yml` file into your repo. Then set a `@houly` schedule cronjob at drone web page.

```yml
# .drone.yml
kind: pipeline
type: docker
name: default

clone:
  disable: true

steps:
- name: douban
  image: lizheming/drone-doumark
  settings:
    id: lizheming
    type: movie
    format: notion
    notion_token: xxxxxx
    dir: xxxxxx
```

RUN with docker directly:

```
docker run --rm \
  -e PLUGIN_ID=lizheming
  -e PLUGIN_TYPE=movie
  -e PLUGIN_FORMAT=notion
  -e PLUGIN_NOTION_TOKEN=xxxxxx
  -e PLUGIN_DIR=xxxxxx
  lizheming/drone-doumark
```