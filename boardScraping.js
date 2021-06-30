// require('https').globalAgent.options.ca = require('ssl-root-cas').create();
const axios = require('axios');
const cheerio = require('cheerio');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let baseUrl = "https://www.seo.incheon.kr/open_content/main/bbs/bbsMsgList.do?bcd=notice&pgno=";
var objArr = [];

axios.get(baseUrl + 1)
    .then(html => {
        const $ = cheerio.load(html.data);

        const articleList = $('table.general_board').find('tbody tr');
        articleList.each(function (i, elem){
            var article = {};
            var $col = $(elem).find('td');

            $col.each(function (j, e){
                switch (j){
                    case 0:
                        article['no'] = $(e).find('span.wfont').text() || $(e).text().trim();
                        break
                    case 1:
                        article['title'] = $(e).find('a').text();
                        break
                    case 2:
                        article['attached'] = $(e).find('a').length !== 0;
                        break
                    case 3:
                        article['author'] = $(e).text();
                        break
                    case 4:
                        article['datetime'] = $(e).text();
                        break
                    case 5:
                        article['hits'] = $(e).text();
                        break
                }
            });

            objArr.push(article);

        });

        console.log(objArr);
    })
    .catch(error => console.error(error));

console.log("End of Main Program");