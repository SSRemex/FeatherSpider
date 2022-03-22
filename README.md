# FeatherSpider
The spider based in puppeteer

`npm i puppeteer`
`npm i bloomfilters.js`

模式

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

BUG:
    修复了去重不准确的BUG(substr,slice)