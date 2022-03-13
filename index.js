let puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { strictEqual } = require('assert');
const { isAsyncFunction } = require('util/types');


const AIM_URL = "http://baidu.com"
const host = "baidu.com";
const visitedFile = 'visitedUrl.txt';
const visitedFilePath = path.join(__dirname, visitedFile);
const brokenlinkFile = 'brokenLink.txt';
const brokenlinkFilePath = path.join(__dirname, brokenlinkFile);

const validUrlFile = 'validUrlFile.txt'; 
const validUrlFilePath = path.join(__dirname, validUrlFile);

const DEEP = 6;

// url识别规则
function isvaildUrl(url){
  let black_list = ['.svg', '.png', '.js', '.jpg', '.ico', '.apk', '.exe', '.css', '.csv']
  
  if(url.includes(host)) {
    for(index in black_list){
      if (url.endsWith(black_list[index])) {
      return false;
    }
  }
  return true;
  } else {
    return false;
  }

}

async function run(){
  let browser = await puppeteer.launch({headless: false});

  let page = await browser.newPage();

  page.on('response', (res)=>{
    let url = res.url();
    let currenturl = page.url();
    if(res.status() == 404){
      linktoFile(currenturl+"=="+url, brokenlinkFilePath);
    }else{
      if(isvaildUrl(url)){
        linktoFile(url, validUrlFilePath);
      }
    }
  })

  await visitPage(browser, AIM_URL, DEEP);



}

async function visitPage (browser, url, deep) {  
  console.log(deep);
  if(deep > 1){
    let page = await browser.newPage();
    try{
      await page.goto(url);
    } catch (e){
      if(e.includes("net::")){
        await asyncio.sleep(10)
      }

    }
    
    let hrefs = await page.evaluate(
      () => Array.from(document.body.querySelectorAll('[href]'), ({ href }) => href)
    );
    let srcs = await page.evaluate(
      () => Array.from(document.body.querySelectorAll('[src]'), ({ src }) => src)
    )
    const urls = [...hrefs, ...srcs];

  for (const url of urls) {
    if(isvaildUrl(url) && url !== host  ) {
      try{
        let res = await page.goto(url);
        if (res &&  res.status() == 404) {
          linktoFile(url, brokenlinkFilePath);
        } else {
          let visitedlinks = filetoLinks(visitedFilePath);
          if(!visitedlinks.includes(url)) {
            linktoFile(url, visitedFilePath);
            await visitPage(browser, url, deep-1);
          }
        }
        let links = filetoLinks(visitedFilePath);
        if(!links.includes(url)) {
          await visitPage(browser, url, deep-1);  
          }
      }
      catch (e){
        if(e.includes("net::")){
          await asyncio.sleep(10)
        }

        }  
      }
    }
  }
  

}


let filetoLinks = function (filepath) { 
  if(!fs.existsSync(filepath)){
    fs.writeFileSync(filepath,"");
  }
  let data = fs.readFileSync(filepath, 'utf-8');
  let links = data.trim().split('\n');
  return links;
}

let linktoFile = function(link, filepath) {
  let foundLinks = filetoLinks(filepath);
  if(!foundLinks.includes(link)) {
    fs.appendFileSync(filepath, link + '\n');
  }
}


run();