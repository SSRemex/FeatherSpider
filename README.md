# FeatherSpider
The spider based in puppeteer

`npm i puppeteer`
`npm i bloomfilters.js`

当前情况
    限定HOST固定
    递归深度为2,爬取出九百条请求,用时4分钟
    递归深度为1,爬取出,用时分钟

    

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