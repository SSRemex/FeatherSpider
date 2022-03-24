// ajax hook test
let puppeteer = require("puppeteer");


async function test(){
    const browser = await puppeteer.launch({headless: false});

let page =await browser.newPage();
let url = "https://benchmark.58corp.com/bm/xss_get/xss_escape_filter/sink_xss_href_attributes/";
const Cookie_str = "c=to3wGuTN-1632625117028-cf4c89d08dbcf-1277372903; _fmdata=uELNf7mIkZIbXLdzcU21aMym1Pkxld42RaMe7%2F0OEqL5%2FtibJwMPHI1Vq1%2BjYbLQsWlZMCemF3Tvi6d674Tjj85b0pHah%2BhJDOIYww2MqTY%3D; _xid=lph1eBbOiYp%2B3fr3vOqcEhBa3wWAAwICbmdky5RdVp5JN%2Fq2IONzb72d0yrPYe93TX%2FIepkV9xo%2B4Ka4E9gn6g%3D%3D; wmda_uuid=2ee22d828a5761d3ae9efe8d98c2a7de; wmda_visited_projects=%3B18101072869043; ec=UebkL1K1-1642140767728-99636794cc056190373960; _efmdata=GiOQa4ZrtHfgBa158iW6fhjYZgTXLSUBYTdozLkK7kCMRLB%2BQAyuLEg7zP4ZyYZJX2EtCToQuyO1JSi59cToF6eRTz8YeqPx2U21cNC7qEc%3D; 58tj_uuid=83385fd0-5d9e-44fc-9d71-e9f5327c6cb6; new_uv=1; als=0; ishare_sso_username=F3A5B8DE5F87C6027C5310A6A948C79E0F7F5E2D66983F73F127795DD5303D0B; _exid=lph1eBbOiYp%2B3fr3vOqcEhBa3wWAAwICbmdky5RdVp4CxMakW6neFc4%2Fkrzm%2Fm3rKFbz4b2xvWjSqyt4PgPUmA%3D%3D; dunCookie=1cbe781ac68cf854596a86e295703a6a933bfe6938373ac2a24fefd4eef87370004f2d1b2913ae96; benchmark_token=24d22550c223269f84a6db8dd2fda1d3eb734b86; JSESSIONID=298EB41D7ACC05FD80341D40444CF98";

async function add_cookie(cookie_str, page, url){
    let cookies = cookie_str.split(';').map(
        pair => {
        let name = pair.trim().slice(0, pair.trim().indexOf('='));
        let value = pair.trim().slice(pair.trim().indexOf('=') + 1);
        return {name, value, url}
    });
    await page.setCookie(...cookies);
    // console.log(page.cookies());
};

await add_cookie(Cookie_str, page, url);

page.goto(url, {timeout: 10000});
}


test();


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

//test_ajax("http://baidu.com")
// var a = {"a": 1}
// console.log(a)
// console.log(JSON.stringify(a))

// const bloom = require('bloomfilter.js');


// var filter = new bloom(100,0.00001); 


// filter.add("test-data 1");
// filter.add("test-data 2");

// console.log(filter.test("test-data 3"));	
// console.log(filter.test("test-data 4"));	
// console.log(filter.test("test-data 1"));	
// console.log(filter.test("test-data 2"));
  

// var s1 = "https://www.baidu.com/s?wd=%E7%99%BE%E5%BA%A6%E7%83%AD%E6%90%9C&pn=10&oq=%E7%99%BE%E5%BA%A6%E7%83%AD%E6%90%9C&ie=utf-8&usm=3&rsv_pq=e92b1acc000f66d9&rsv_t=7d03vKY0brlf6t0Z1XlTtHDKI97li2FvI%2FBoeRhdN3fBbP78p72T8OaPH0g&topic_pn=&rsv_page=1"
// var s2 = "http://www.baidu.com/xxx/xxx"

// var i1 = s1.lastIndexOf('?')
// var i2 = s1.lastIndexOf('/')
// var i3 = s2.lastIndexOf('?')
// var i4 = s2.lastIndexOf('/')

// console.log(i1);
// console.log(i2);
// console.log(i3);
// console.log(i4);
function sleep(number){
    var now = new Date();
    var exitTime = now.getTime() + number * 1000;
    while (true) {
        now = new Date();
        if(now.getTime() > exitTime)
        return 
    }
}
// var a = new Date();


// sleep(10);
// var b = new Date();

// console.log(b - a)

// var url = "javascript:void(0);"
// console.log(url.indexOf("javascript"))

// var cookie_str = "c=to3wGuTN-1632625117028-cf4c89d08dbcf-1277372903; _fmdata=uELNf7mIkZIbXLdzcU21aMym1Pkxld42RaMe7%2F0OEqL5%2FtibJwMPHI1Vq1%2BjYbLQsWlZMCemF3Tvi6d674Tjj85b0pHah%2BhJDOIYww2MqTY%3D; _xid=lph1eBbOiYp%2B3fr3vOqcEhBa3wWAAwICbmdky5RdVp5JN%2Fq2IONzb72d0yrPYe93TX%2FIepkV9xo%2B4Ka4E9gn6g%3D%3D; wmda_uuid=2ee22d828a5761d3ae9efe8d98c2a7de; wmda_visited_projects=%3B18101072869043; ec=UebkL1K1-1642140767728-99636794cc056190373960; _efmdata=GiOQa4ZrtHfgBa158iW6fhjYZgTXLSUBYTdozLkK7kCMRLB%2BQAyuLEg7zP4ZyYZJX2EtCToQuyO1JSi59cToF6eRTz8YeqPx2U21cNC7qEc%3D; 58tj_uuid=83385fd0-5d9e-44fc-9d71-e9f5327c6cb6; new_uv=1; als=0; ishare_sso_username=F3A5B8DE5F87C6027C5310A6A948C79E0F7F5E2D66983F73F127795DD5303D0B; _exid=lph1eBbOiYp%2B3fr3vOqcEhBa3wWAAwICbmdky5RdVp4CxMakW6neFc4%2Fkrzm%2Fm3rKFbz4b2xvWjSqyt4PgPUmA%3D%3D; dunCookie=1cbe781ac68cf854596a86e295703a6a933bfe6938373ac2a24fefd4eef87370004f2d1b2913ae96; benchmark_token=24d22550c223269f84a6db8dd2fda1d3eb734b86; JSESSIONID=298EB41D7ACC05FD80341D40444CF98"

// function get_cookie (cookie_str){
//     let cookie = cookie_str.split(";").map(
//         pair => {
//             let name = pair.trim().slice(0, pair.trim().indexOf('='));
//             let value = pair.trim().slice(pair.trim().indexOf('=') + 1);
//             return { name, value }
//         }
//     );
//     return cookie;
// }

// var cookie = get_cookie(cookie_str);
// console.log(cookie);


// const ROOT_URL = "https://benchmark.58corp.com";
// function get_host(url){
//     var arrUrl = url.split("//");

//     var start = arrUrl[1].indexOf("/");
//     var host = arrUrl[1].substring(start);

//     start = host.indexOf(".");
//     try{
//     host = host.substring(start+1, relUrl.length);
//     }
//     catch{}
//     if(host.indexOf("?") != -1){
//         host = host.split("?")[0];
//     }
//     // console.log(host);
//     return host;
// }
// console.log(get_host(ROOT_URL));