// ajax hook test
let puppeteer = require("puppeteer");


async function test_ajax(url){
    let browser = await puppeteer.launch({headless: false});
    let page = await browser.newPage();
    
    // 想要用可选的请求覆写选项继续请求，应该使用 page.setRequestInterception 来开启请求拦截，如果请求拦截没有开启会立即抛出异常
    page.setRequestInterception(true);
    page.on('request', (req)=>{
        post_data = req.postData();
            if(post_data===null){
                post_data = ""
            }
            
            res = {
                method: req.method(),
                url: req.url(),
                data: post_data
            }

            console.log(res)
            req.continue()
    });
    await page.goto(url);

}

test_ajax("http://baidu.com")