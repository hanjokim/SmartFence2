const fetch = require("node-fetch");

// var baseDate = apiResponse.response.body.items.item[0].baseDate;
// var baseTime = apiResponse.response.body.items.item[0].baseTime;

var http = require('http');

function getForecastArray(apiResponse, category){
    return apiResponse.response.body.items.item.filter(function (element){
        return element.category === category;
    })
    .filter(function (element){
        return element.fcstDate >= baseDate;
    })
    .filter(function (element){
        return element.fcstTime >= baseTime;
    }).slice(1, 7);
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
    hr = hr >= 10 ? hr : '0' + hr;
    return hr + '00';

    // var min = date.getMinutes();
    // min = min > 10 ? min : '0' + min;
    // return hr + '' + min;
}

const apiData = {
    serviceKey: 'dU7dvWQUG8tftP9%2FNQlBADY5gjT5ZpS6xWVIZ%2Fwxr26jXjuJZlrLgExQvtyIaCfiioEJWez5DJ%2FcdIWAAFrctQ%3D%3D',
    numOfRows: 100,
    pageNo: 1,
};

let date = new Date();
let previousDay = new Date(date.getTime() - (24*60*60*1000)); // 1일에 해당하는 값을 오늘에서 뺀다.
let baseDate = getFormatDate(date);
let baseTime = getFormatTime(date);
let apiCallTime =
    (baseTime >= "2300") ? "2300" :
    (baseTime >= "2000") ? "2000" :
    (baseTime >= "1700") ? "1700" :
    (baseTime >= "1400") ? "1400" :
    (baseTime >= "1100") ? "1100" :
    (baseTime >= "0800") ? "0800" :
    (baseTime >= "0500") ? "0500" :
    (baseTime >= "0200") ? "0200" : "2300";
let apiCallDate = (baseTime >= "0200") ? baseDate : getFormatDate(previousDay);
weatherApiData = Object.assign({}, apiData, {dataType: 'JSON', base_date: apiCallDate, base_time: apiCallTime, nx: 54, ny: 126});
weatherPayloadString = Object.entries(weatherApiData).map(e => e.join('=')).join('&');

const getVilageFcstURL = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst' + '?' + weatherPayloadString;

fetch(getVilageFcstURL)
    .then((response) => response.json())
    .then((apiResponse) => {
        console.log(apiResponse.response.header.resultCode, apiResponse.response.header.resultMsg);
        // console.log(apiResponse.response.body.items.item);
        console.log(getFormatDate(date), getFormatTime(date));
        console.log(baseDate, baseTime, apiCallDate, apiCallTime);
        console.log(getForecastArray(apiResponse, "TMP"));
    })
    .catch((error) => console.log("error:", error));

console.log(getVilageFcstURL);