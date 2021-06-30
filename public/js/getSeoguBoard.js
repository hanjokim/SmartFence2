// require('https').globalAgent.options.ca = require('ssl-root-cas').create();
const axios = require('axios');
const cheerio = require('cheerio');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var objArr = [];

var res = null;
function getSeoguBoard(pageNo){
    let baseUrl = "https://www.seo.incheon.kr/open_content/main/bbs/bbsMsgList.do?bcd=notice&pgno=";

    axios({
        type: 'get',
        url: baseUrl + pageNo
    }).then(response => {
        res = response.data;
        const $ = cheerio.load(response.data);
        const articleList = $('table.general_board').find('tbody tr');
        articleList.each(function (i, elem) {
            var article = {};
            var $col = $(elem).find('td');

            $col.each(function (j, e) {
                switch (j) {
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
    });
}
console.log(res);
console.log(getSeoguBoard(1));



