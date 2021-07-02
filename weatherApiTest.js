// const fetch = require("node-fetch");

// var baseDate = apiResponse.response.body.items.item[0].baseDate;
// var baseTime = apiResponse.response.body.items.item[0].baseTime;

var http = require('http');

function test(category){

    return apiResponse.response.body.items.item.filter(function (element){
        return element.category === category;
    }).filter(function (element){
        return element.fcstDate === "20210702" && element.fcstTime === "1200";
    });
}

// yyyyMMdd 포맷으로 반환
function getFormatDate(date){
    var year = date.getFullYear();              //yyyy
    var month = (1 + date.getMonth());          //M
    month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
    var day = date.getDate();                   //d
    day = day >= 10 ? day : '0' + day;          //day 두자리로 저장
    return  year + '' + month + '' + day;       //'-' 추가하여 yyyy-mm-dd 형태 생성 가능
}

function getFormatTime(date){
    var hr = date.getHours();
    hr = hr > 10 ? hr : '0' + hr;
    return hr + '00';

    // var min = date.getMinutes();
    // min = min > 10 ? min : '0' + min;
    // return hr + '' + min;
}

var date = new Date();

const apiData = {
    serviceKey: 'dU7dvWQUG8tftP9%2FNQlBADY5gjT5ZpS6xWVIZ%2Fwxr26jXjuJZlrLgExQvtyIaCfiioEJWez5DJ%2FcdIWAAFrctQ%3D%3D',
    numOfRows: 100,
    pageNo: 1,
};
var baseDate = getFormatDate(date);
var baseTime = getFormatTime(date);
weatherApiData = Object.assign({}, apiData, {dataType: 'JSON', base_date: baseDate, base_time: baseTime, nx: 54, ny: 126});
weatherPayloadString = Object.entries(weatherApiData).map(e => e.join('=')).join('&');

const getVilageFcstURL = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst' + '?' + weatherPayloadString;

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

// function httpGetAsync(theUrl, callback){
//     var xmlHttp = new XMLHttpRequest();
//     xmlHttp.onreadystatechange = function() {
//         if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
//             callback(xmlHttp.responseText);
//     }
//     xmlHttp.open("GET", theUrl, true); // true for asynchronous
//     xmlHttp.send(null);
// }
//
// var apiResponse = httpGetAsync(getVilageFcstURL, function (response){
//     return response;
// });

var apiResponse = httpGet(getVilageFcstURL);

console.log(getVilageFcstURL);
console.log(apiResponse);
// console.log(apiResponse.response.header.resultCode, apiResponse.response.header.resultMsg);
console.log(getFormatDate(date), getFormatTime(date));
console.log(baseDate, baseTime);
console.log(test("TMP"));