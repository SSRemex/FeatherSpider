

const fs = require('fs');
const puppeteer = require("puppeteer");


const ROOT_URL = "http://www.qq.com";
const HOST = get_host(ROOT_URL)
const file_name = Date.parse(new Date()) + "result.txt";
fs.writeFileSync(file_name,"");
const DEEP = 6;

const VISITED_URL = [];
const Bloom_LIST = new BloomFilter(100000, 0.01);


// 提取一级域名
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
    console.log(host);
    return host;
}

// url识别规则
function isVaildUrl(url){
    let black_list = ['.svg', '.png', '.js', '.jpg', '.ico', '.apk', '.exe', '.css', '.csv'];
    console.log(url)
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

function url_deal(res){
    if(isVaildUrl(res)){
        console.log(res);
        if(Bloom_LIST.contain(res)){
            Bloom_LIST.add(res);
            fs.appendFileSync(file_name, res + "\n");
        }
        
        
    }
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
    console.log(JSON.stringify(res))
    url_deal(JSON.stringify(res));
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

function isDifferent(res) {

}

async function visitPage(url, deep) { 
    let browser = await puppeteer.launch({headless: false});
    let page =await browser.newPage();
    page.setRequestInterception(true);
    page.on('request', ajax_get);

    await page.goto(url);
    var forms = await page.evaluate(form_get);
    var hrefs = await page.evaluate(href_get);
    for(var i=0; i<forms.length; i++){
        url_deal(JSON.stringify(forms[i]));
    }
    for(var i=0; i<hrefs.length; i++){
        url_deal(JSON.stringify(hrefs[i]));
    }

    browser.close();

}


async function main(){
    visitPage(ROOT_URL)


    
}


//get_host(ROOT_URL);
//console.log(isVaildUrl("http://www.badu.com"))
main()