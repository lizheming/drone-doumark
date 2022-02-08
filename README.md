![](assets/douban.png)
## drone-doumark

豆瓣观影/阅读/音乐记录同步插件
## 简介

本插件支持定时将你的豆瓣观影、阅读、音乐记录同步下载到本地
## 配置

- `PLUGIN_ID`: 豆瓣 ID
- `DOUBAN_ID`: 同 `PLUGIN_ID`
- `PLUGIN_TYPE`: 数据类型，可选值：movie, book, music，默认为 `movie`
- `DOUBAN_TYPE`: 同 `PLUGIN_TYPE`
- `PLUGIN_FORMAT`: 存储格式，可选值：csv, json，默认为 `csv`
- `DOUBAN_FORMAT`: 同 `PLUGIN_FORMAT`
- `PLUGIN_DIR`: 记录存储目录
- `DOUBAN_DIR`: 同 `PLUGIN_DIR`
## 如何使用

```
docker run --rm \
  -e PLUGIN_ID=lizheming
  -e PLUGIN_TYPE=douban
  -e PLUGIN_DIR=./data/douban
  lizheming/drone-wechat
```
