const BloomFilter = require('bloomfilter.js');

const fs = require('fs');
const puppeteer = require("puppeteer");

const IS_HEADLESS = false

const ROOT_URL = "http://www.baidu.com";
const HOST = get_host(ROOT_URL)
const file_name = Date.parse(new Date()) + "result.txt";
fs.writeFileSync(file_name, "");

// 递归深度
const DEEP = 10;


const Bloom_LIST = new BloomFilter(1000000, 0.00001);

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
    let black_list = ['.svg', '.png', '.js', '.jpg', '.ico', '.apk', '.exe', '.css', '.csv'];
    // console.log(url)
    if(url.indexOf(HOST)>0) {
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

    var l1 = url.lastIndexOf('?');
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
// url去重判断存储相关
// return true存储/false不存储
function url_deal(res){
    if(isVaildUrl(JSON.stringify(res))){
        // var url = res_to_url(res, 1);
        var url = res["url"];
        if(!Bloom_LIST.test(url)){
            console.log(url);
            Bloom_LIST.add(url);
            var res_str = JSON.stringify(res);
            fs.appendFileSync(file_name, res_str + "\n");
            return true;
        }
        
        
    }
    return false;
}

async function ajax_get(req){
    var post_data = req.postData();
    if(post_data==null){
        post_data = ""
    }
    var res = {
        "method": req.method(),
        "url": req.url(),
        "data": post_data,
        "type": "ajax"
    }
    //console.log(JSON.stringify(res))
    url_deal(res);
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
    //console.log(deep)
    if(deep===0){
        return
    }
    else{
        let cache_url = [];
        
        let page =await browser.newPage();
        await page.setDefaultNavigationTimeout(0); 
        page.setRequestInterception(true);
        page.on('request', ajax_get);

        try{
            await page.goto(url);  
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

            for(var i=0; i<cache_url.length; i++){
                if(cache_url[i]=="javascript:;"||cache_url[i].indexOf("data:image/")!=-1){
                    continue;
                }
                // console.log(cache_url[i]);
                await visitPage(browser, cache_url[i], deep-1);
            }
        }catch(err){
            //console.log(typeof(err));
            console.log(err);
            await sleep(3);
        }
    }
}


async function main(){
    var now = new Date();
    var start = now.getTime();
    const browser = await puppeteer.launch({headless: IS_HEADLESS});
    await visitPage(browser ,ROOT_URL, DEEP);
    browser.close();
    var end = now.getTime();
    var use = (end - start)/1000;
    console.log("DONE!用时："+ use.toString());
    
}


//get_host(ROOT_URL);
//console.log(isVaildUrl("http://www.badu.com"))
main()