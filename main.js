const BloomFilter = require('bloomfilter.js');

const fs = require('fs');
const puppeteer = require("puppeteer");

const IS_HEADLESS = true

// const ROOT_URL = "https://benchmark.58corp.com/";
const ROOT_URL = "http://www.baidu.com";
const HOST = get_host(ROOT_URL)
const file_name = Date.parse(new Date()) + "result.txt";
fs.writeFileSync(file_name, "");

// 递归深度
const DEEP = 3;
// cookie
const Cookie_str = "c=to3wGuTN-1632625117028-cf4c89d08dbcf-1277372903; _fmdata=uELNf7mIkZIbXLdzcU21aMym1Pkxld42RaMe7%2F0OEqL5%2FtibJwMPHI1Vq1%2BjYbLQsWlZMCemF3Tvi6d674Tjj85b0pHah%2BhJDOIYww2MqTY%3D; _xid=lph1eBbOiYp%2B3fr3vOqcEhBa3wWAAwICbmdky5RdVp5JN%2Fq2IONzb72d0yrPYe93TX%2FIepkV9xo%2B4Ka4E9gn6g%3D%3D; wmda_uuid=2ee22d828a5761d3ae9efe8d98c2a7de; wmda_visited_projects=%3B18101072869043; ec=UebkL1K1-1642140767728-99636794cc056190373960; _efmdata=GiOQa4ZrtHfgBa158iW6fhjYZgTXLSUBYTdozLkK7kCMRLB%2BQAyuLEg7zP4ZyYZJX2EtCToQuyO1JSi59cToF6eRTz8YeqPx2U21cNC7qEc%3D; 58tj_uuid=83385fd0-5d9e-44fc-9d71-e9f5327c6cb6; new_uv=1; als=0; ishare_sso_username=F3A5B8DE5F87C6027C5310A6A948C79E0F7F5E2D66983F73F127795DD5303D0B; _exid=lph1eBbOiYp%2B3fr3vOqcEhBa3wWAAwICbmdky5RdVp4CxMakW6neFc4%2Fkrzm%2Fm3rKFbz4b2xvWjSqyt4PgPUmA%3D%3D; dunCookie=1cbe781ac68cf854596a86e295703a6a933bfe6938373ac2a24fefd4eef87370004f2d1b2913ae96; benchmark_token=24d22550c223269f84a6db8dd2fda1d3eb734b86; JSESSIONID=298EB41D7ACC05FD80341D40444CF98";

const Bloom_LIST = new BloomFilter(1000000, 0.001);

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

    var l1 = url.lastIndexOf('?');
    //var l1 = url.lastIndexOf('=');
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

function black_url(url){
    if(url.indexOf("javascript")==0||url.indexOf("data:")==0)
        return true

    return false
}

// url去重判断存储相关
// return true存储/false不存储
function url_deal(res){
    var url = res_to_url(res);
    if(isVaildUrl(url)){
        // var url = res["url"];
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
    console.log(deep)
    if(deep===0){
        return
    }
    else{
        let cache_url = [];
        
        let page =await browser.newPage();
        
        if(Cookie_str != ""){
            await add_cookie(Cookie_str, page, url);
        }
        console.log(page.cookies());

        page.setRequestInterception(true);
        page.on('request', ajax_get);
        await page.setDefaultNavigationTimeout(0); 

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
            page.close();
            await sleep(1);
        }
    }
}


async function main(){
    var start = new Date();
    const browser = await puppeteer.launch({headless: IS_HEADLESS});
    await visitPage(browser ,ROOT_URL, DEEP);
    browser.close();
    var end = new Date();
    var use = (end - start)/1000;
    console.log("DONE!用时："+ use.toString());
    
}


//get_host(ROOT_URL);
//console.log(isVaildUrl("http://www.badu.com"))
main()
