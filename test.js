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
  

var s1 = "https://www.baidu.com/s?wd=%E7%99%BE%E5%BA%A6%E7%83%AD%E6%90%9C&pn=10&oq=%E7%99%BE%E5%BA%A6%E7%83%AD%E6%90%9C&ie=utf-8&usm=3&rsv_pq=e92b1acc000f66d9&rsv_t=7d03vKY0brlf6t0Z1XlTtHDKI97li2FvI%2FBoeRhdN3fBbP78p72T8OaPH0g&topic_pn=&rsv_page=1"
var s2 = "http://www.baidu.com/xxx/xxx"

var i1 = s1.lastIndexOf('?')
var i2 = s1.lastIndexOf('/')
var i3 = s2.lastIndexOf('?')
var i4 = s2.lastIndexOf('/')

console.log(i1);
console.log(i2);
console.log(i3);
console.log(i4);
