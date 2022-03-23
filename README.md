# FeatherSpider
基于nodejs puppeteer
依赖安装

`npm i`

运行
`node main.js`

> test.js  index.js 为测试文件，可忽略

配置说明
commonjs 做模块化，config.js为配置文件

```js
// 开启无头
const IS_HEADLESS = false
// 扫描根url
const ROOT_URL = "http://www.baidu.com";

// 递归深度
const DEEP = 3;
```



模式
当前不可配置 ，目前重复等级为3 不固定HOST
重复等级 1（不过滤重复） 2 3（完全不重复）

是否固定HOST

当前情况
    情况一 深度为3，固定HOST，用时151.715，数据量6173，重复等级2
    情况二 深度为3，不固定HOST，用时1966.505，数据量53731，重复等级3

与rad对比
rad 默认配置 深度4 3973条 约29分钟
​    

相关功能设计以及开发流程

静态资源过滤

href
ajax
form

布隆过滤 去重

深度递归

后续计划
    加入登录功能
    调研事件点击的效果
