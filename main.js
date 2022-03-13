const fs = require('fs');
const puppeteer = require("puppeteer");

const ROOT_URL = "http://www.baidu.com";
const HOST = "baidu.com"
const browser = puppeteer.launch();
const DEEP = 6;


// 提取一级域名
function get_host(url){
    var arrUrl = url.split("//");

    var start = arrUrl[1].indexOf("/");
    var relUrl = arrUrl[1].substring(start);

    start = relUrl.indexOf(".");
    relUrl = relUrl.substring(start+1, relUrl.length);

    if(relUrl.indexOf("?") != -1){
        relUrl = relUrl.split("?")[0];
    }
    console.log(relUrl);
    return relUrl;
}

async function ajax_get(url){

}

async function form_get(url){

}

async  function href_get(){

}

async function main(){
    let page =await browser.newPage();

    
}


get_host(ROOT_URL);