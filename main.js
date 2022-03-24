const BloomFilter = require('bloomfilter.js');
const fs = require('fs');
const puppeteer = require("puppeteer");

// 加载配置文件
const {ROOT_URL, Cookie_str, IS_HEADLESS, DEEP, HOST_LOCKED, LEVEL, TIMEOUT} = require("./config");
var {WHITE_DOMAIN, BLACK_DOMAIN} = require("./config");

// 配置文件初始化

const HOST = get_host(ROOT_URL)
const file_name = Date.parse(new Date()) + "_result.txt";
fs.writeFileSync(file_name, "");

const Bloom_LIST = new BloomFilter(1000000, 0.001);

if(WHITE_DOMAIN.length!=0){
    BLACK_DOMAIN = [];
}

if(HOST_LOCKED){
    WHITE_DOMAIN = [];
    WHITE_DOMAIN.push(HOST);
    BLACK_DOMAIN = [];
}
console.log(WHITE_DOMAIN);
console.log(BLACK_DOMAIN);

//睡眠函数
function sleep(number){
    var now = new Date();
    var exitTime = now.getTime() + number * 1000;
    while (true) {
        now = new Date();
        if(now.getTime() > exitTime)
        return 
    }
}

// 添加cookie
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

// 提取一级域名 只搜集当前域名下的链接
function get_host(url){
    var arrUrl = url.split("//");

    var start = arrUrl[1].indexOf("/");
    var host = arrUrl[1].substring(start);

    start = host.indexOf(".");
    try{
    host = host.substring(start+1, relUrl.length);
    }
    catch{}
    if(host.indexOf("?") != -1){
        host = host.split("?")[0];
    }
    // console.log(host);
    return host;
}

// url识别规则
function isVaildUrl(url){
    let black_list = ['.svg', '.png', '.js', '.jpg', '.ico', '.apk', '.exe', '.css', '.csv', '.js?', '.css?'];
    // console.log(url)
    //if(url.indexOf(HOST)>0) {
    if(true) {
        for(var index in black_list){
            if (url.endsWith(black_list[index])) {
            return false;
        }
    }
    return true;
    } else {
      return false;
    }
}

//将res对象中的url提取出来，取接口过滤参数，增强去重效果
function res_to_url(res){

    var url = res["url"];
    if(LEVEL==1){
        return url;
    }
    
    if(LEVEL==2){
        var l1 = url.lastIndexOf('=');
    }
    else{
        var l1 = url.lastIndexOf('?');
    }
    var l2 = url.lastIndexOf('/');
    
    if(l1===-1&&l2===-1){
        return url;
    }

    if(l1>=l2){
        var split_num = l1;
    }
    if(l1<l2){
        var split_num = l2;
    }
    var new_url = url.slice(0, split_num+1);
    // console.log(new_url);

    return new_url;
}

// 黑域名避免扫描
function black_url(url){
    if(url.indexOf("http")!=0)
        return true
    // 检测黑名单
    for(var index in BLACK_DOMAIN){
        if (url.indexOf(BLACK_DOMAIN[index])!=-1) {
            return true;
        }
    }

    // 检测白名单
    for(var index in WHITE_DOMAIN){
        if (url.indexOf(WHITE_DOMAIN[index])!=-1) {
            return false;
        }
    }

    if(WHITE_DOMAIN.length > 0) {
        return true
    }
    else{
        return false
    }

}

// url去重判断存储相关
// return true存储/false不存储
function url_deal(res){
    var url = res["url"];
    if(isVaildUrl(url)){
        var url = res_to_url(res);
        if(!black_url(url)){
            if(!Bloom_LIST.test(url)){
                console.log(url);
                Bloom_LIST.add(url);
                var res_str = JSON.stringify(res);
                fs.appendFileSync(file_name, res_str + "\n");
                return true;
            }
        }
    }
    return false;
}

async function ajax_get(req){
    var post_data = req.postData();
    if(post_data==null){
        post_data = ""
    }
    if(isVaildUrl(req.url())){
        var res = {
            "method": req.method(),
            "url": req.url(),
            "data": post_data,
            "type": "ajax"
        }
        //console.log(JSON.stringify(res))
        url_deal(res);
    }
    req.continue()
}

async function form_get(){
    var urls = [];
    var f = document.forms;
    for(var i=0; i<f.length; i++)
    {
        var url = f[i].action;
        var inputs = f[i].getElementsByTagName('*');
        var request_data = "";
        var len = inputs.length;
        
        for(var j=0; j<len; j++) {
            if(inputs[j].hasAttribute("*")==true){
                if(j < len-1) {
                    if(inputs[j].hasAttributes("name")&&inputs[j].name != undefined && inputs[j].name !=""){
                        request_data = request_data + inputs[j].name
                    }
                    else{
                        continue
                    }
                    if(inputs[j].hasAttributes("value") && inputs[j].value != undefined &&inputs[j].value != ""){
                        request_data = + "=" + inputs[j].value + "&";
                    }
                    else {
                        request_data = request_data + "=ssremex&"
                    }
                }
                if (j==len-1){
                    if(inputs[j].hasAttributes("name")&&inputs[j].name != undefined && inputs[j].name !=""){
                        request_data = request_data + inputs[j].name
                    }
                    else{
                        continue
                    }
                    if(inputs[j].hasAttributes("value") && inputs[j].value != undefined &&inputs[j].value != ""){
                        request_data = + "=" + inputs[j].value;
                    }
                    else {
                        request_data = request_data + "=ssremex"
                    }
                }
                var res = {
                    "method": "POST",
                    "url": url,
                    "data": request_data,
                    "type": "form"
                }
                if  (urls.indexOf(res) < 0) {
                    urls.push(res)
                }
            }
        }
    }
    return urls;
}

async function href_get(){
    var urls = []
    var tag_dict = {'a': 'href','link': 'href','area': 'href','img': 'src','embed': 'src','video': 'src','audio': 'src'}
    for(var tag in tag_dict){
        var src = tag_dict[tag];
        var elements = document.getElementsByTagName(tag);
        for(var i=0; i< elements.length; i++) {
            var res = {
                "method": "GET",
                "url": elements[i][src],
                "data": "",
                "type": "href"
            };
            if  (urls.indexOf(res) < 0) {
                urls.push(res)
            }
        }
    }
    return urls;
}


async function visitPage(browser, url, deep) {
    // console.log(deep)
    if(deep===0){
        return
    }
    else{
        let cache_url = [];
        
        let page =await browser.newPage();
        
        if(Cookie_str != ""){
            await add_cookie(Cookie_str, page, url);
        }
        // console.log(page.cookies());

        page.setRequestInterception(true);
        page.on('request', ajax_get);

        try{
            await page.goto(url, {timeout: TIMEOUT});  
            var forms = await page.evaluate(form_get);
            var hrefs = await page.evaluate(href_get);
            for(var i=0; i<forms.length; i++){
                var state = url_deal(forms[i]);
                if(state){
                    cache_url.push(forms[i].url);
                }
                
            }
            for(var i=0; i<hrefs.length; i++){
                var state = url_deal(hrefs[i]);
                if(state){
                    cache_url.push(hrefs[i].url);
                }
            }
            page.close();
            for(var i=0; i<cache_url.length; i++){
                if(black_url(cache_url[i])){
                    continue;
                }
                // console.log(cache_url[i]);
                await visitPage(browser, cache_url[i], deep-1);
            }
            
        }catch(err){
            //console.log(typeof(err));
            console.log(err);
            await sleep(1);
            return
        }
    }
}


async function main(){
    var start = new Date();
    const browser = await puppeteer.launch({
        headless: IS_HEADLESS,
        args: [
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-setuid-sandbox',
            '--no-first-run',
            '--no-sandbox',
            '--no-zygote',
            '--disable-dev-shm-usage', // <-- add this one
            ],
    });
    await visitPage(browser ,ROOT_URL, DEEP);
    await browser.close();
    var end = new Date();
    var use = (end - start)/1000;
    console.log("DONE!用时："+ use.toString());
    
}


//get_host(ROOT_URL);
//console.log(isVaildUrl("http://www.badu.com"))
main()
