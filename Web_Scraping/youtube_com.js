const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");

const url = "https://myanimelist.net/forum/";

request(url, cb);
function cb(error, response, html){
    if(error){
        console.log(error);
    }
    else{
        extractHTML(html);
    }
}

function extractHTML(html){
    let selectorTool = cheerio.load(html);
    let forumSelectorArr = selectorTool(".forum-board-title");
    for(let i = 0; i < forumSelectorArr.length; i++){
        forumSelectorLink = selectorTool(forumSelectorArr[i]).attr("href");
        printMessages(forumSelectorLink);
    }    

}

function printMessages(link){
    request(link, cb);
    function cb(error, response, html){
        if(error){
            console.log(error);
        }
        else{
            extractMessages(html);
            console.log("\n");


        }
    }
}


function extractMessages(html){
    let selectorTool = cheerio.load(html);
    let title  = selectorTool(".forum_locheader").text();
    // console.log("--------------------------------------------------------------------------------------------------------");
    // console.log("\t\t\t\t\t       ",title,"\t\t\t\t\t");
    // console.log("--------------------------------------------------------------------------------------------------------");
    let data = "";
    let boardTextArr = selectorTool("td[style = 'border-width: 0px 1px 1px 0px;'].forum_boardrow1>a");
    let count = 0;
    for(let i = 0; i < boardTextArr.length; i+=3){
        let boardText = selectorTool(boardTextArr[i]).text();
        boardText.trim();
        data += count + '-> ' + boardText + '\n';
        count++;
    }
    writeFile(data, title);
}

function writeFile(text, title){
    fs.writeFile('\Scrapped-Info\\'+title+'.txt', text, function (err) {});
}

