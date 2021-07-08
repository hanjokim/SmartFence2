// const https = require('https');
// https.globalAgent.options.ca = require('ssl-root-cas').create();
const axios = require('axios');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const http = require('http');
const express = require('express');
// const querystring = require('querystring');
const bisBaseUrl = 'http://apis.data.go.kr/6280000/';
const bisApiNames = {
    arr: 'busArrivalService',
    loc: 'busLocationService',
    rou: 'busRouteService',
    sta: 'busStationService'
};
const weatherBaseUrl = 'http://apis.data.go.kr/1360000/'
const weatherApiNames = {
    vil: 'VilageFcstInfoService_2.0', // 동네예보 조회 서비스
    liv: 'LivingWthrIdxService01' // 생활기상지수 조회 서비스
}
const apiUrl = {
    // BIS 관련 URLs
    getAllRouteBusArrivalList: bisBaseUrl + bisApiNames.arr + '/getAllRouteBusArrivalList', // 버스도착정보목록조회(arr): serviceKey, numOfRows, pageNo, bstopId
    getBusArrivalList: bisBaseUrl + bisApiNames.arr + '/getBusArrivalList',                 // 버스도착정보항목조회(arr): serviceKey, numOfRows, pageNo, bstopId, routeId
    getBusRouteSectionList: bisBaseUrl + bisApiNames.rou + '/getBusRouteSectionList',       // 경유 정류소 목록 조회(rou): serviceKey, numOfRows, pageNo, routeId
    getBusRouteId: bisBaseUrl + bisApiNames.rou + '/getBusRouteId',                         // 노선정보항목 조회(rou): serviceKey, numOfRows, pageNo, routeId
    getBusRouteNo: bisBaseUrl + +bisApiNames.rou + '/getBusRouteNo',                        // 노선번호목록 조회(rou): serviceKey, numOfRows, pageNo, routeId
    getBusRouteLocation: bisBaseUrl + bisApiNames.loc + '/getBusRouteLocation',             // 버스위치정보 목록 조회(loc): serviceKey, numOfRows, pageNo, routeId
    getBusStationNmList: bisBaseUrl + bisApiNames.sta + '/getBusStationNmList',             // 정류소명목록 조회(sta): serviceKey, numOfRows, pageNo, bstopNm
    getBusStationIdList: bisBaseUrl + bisApiNames.sta + '/getBusStationIdList',             // 정류소번호목록 조회(sta): serviceKey, numOfRows, pageNo, bstopId
    getBusStationViaRouteList: bisBaseUrl + bisApiNames.sta + '/getBusStationViaRouteList', // 정류소경유노선 목록 조회(sta): serviceKey, numOfRows, pageNo, bstopId
    getBusStationAroundList: bisBaseUrl + bisApiNames.sta + '/getBusStationAroundList',     // 주변정류소 목록 조회(sta): serviceKey, numOfRows, pageNo, LAT, LNG

    // 날씨 관련 URLs
    getUltraSrtNcst: weatherBaseUrl + weatherApiNames.vil + '/getUltraSrtNcst',         // 초단기실황조회(vil): serviceKey, numOfRows, pageNo, dataType, base_date, base_time, nx, ny
    getUltraSrtFcst: weatherBaseUrl + weatherApiNames.vil + '/getUltraSrtFcst',         // 초단기예보조회(vil): serviceKey, numOfRows, pageNo, dataType, base_date, base_time, nx, ny
    getVilageFcst: weatherBaseUrl + weatherApiNames.vil + '/getVilageFcst',             // 동네예보조회(vil): serviceKey, numOfRows, pageNo, dataType, base_date, base_time, nx, ny
    getFcstVersion: weatherBaseUrl + weatherApiNames.vil + '/getFcstVersion',           // 예보버전조회(vil): serviceKey, numOfRows, pageNo, dataType, ftype, basedatetime

    getFreezeIdx: weatherBaseUrl + weatherApiNames.liv + '/getFreezeIdx',               // 동파가능지수조회(liv): serviceKey, numOfRows, pageNo, dataType, areaNo, time
    getUVIdx: weatherBaseUrl + weatherApiNames.liv + '/getUVIdx',                       // 자외선지수조회(liv): serviceKey, numOfRows, pageNo, dataType, areaNo, time
    getAirDiffusionIdx: weatherBaseUrl + weatherApiNames.liv + '/getAirDiffusionIdx',   // 대기확산지수조회(liv): serviceKey, numOfRows, pageNo, dataType, areaNo, time
    getSenTaIdx: weatherBaseUrl + weatherApiNames.liv + '/getSenTaIdx',                 // 체감온도(여름철)조회(liv): serviceKey, numOfRows, pageNo, dataType, areaNo, time
};

const apiData = {
    serviceKey: 'dU7dvWQUG8tftP9%2FNQlBADY5gjT5ZpS6xWVIZ%2Fwxr26jXjuJZlrLgExQvtyIaCfiioEJWez5DJ%2FcdIWAAFrctQ%3D%3D',
    numOfRows: 200,
    pageNo: 1,
};

let bisApiData = Object.assign({}, apiData, { bstopId: 168001043 }); // 청라국제도시역(89-043) 정류장
let weatherApiData = {};
weatherApiData.vil = Object.assign({}, apiData, {dataType: 'JSON', nx: 54, ny: 126});    // 인천_서구_청라3동
weatherApiData.liv = Object.assign({}, apiData, {dataType: 'JSON', areaNo: 2826053900});                       // 인천_서구_청라3동

const bisPayloadString = Object.entries(bisApiData).map(e => e.join('=')).join('&');
// var bisPayloadString = $.param(bisApiData); // jQuery 사용시
// var bisPayloadString = querystring.stringify(bisApiData); // querystring 모듈 사용시
let weatherPayloadString = {};
weatherPayloadString.vil = Object.entries(weatherApiData.vil).map(e => e.join('=')).join('&');
weatherPayloadString.liv = Object.entries(weatherApiData.liv).map(e => e.join('=')).join('&');

const busNumQueryUrl = apiUrl.getBusStationViaRouteList + '?' + bisPayloadString;
const busArrivalQueryUrl = apiUrl.getAllRouteBusArrivalList + '?' + bisPayloadString;
let getUltraSrtNcstURL = apiUrl.getUltraSrtNcst + '?' + weatherPayloadString.vil;
let getUltraSrtFcstUrl = apiUrl.getUltraSrtFcst + '?' + weatherPayloadString.vil;
let getVilageFcstURL = apiUrl.getVilageFcst + '?' + weatherPayloadString.vil;
let getFcstVersionURL = apiUrl.getFcstVersion + '?' + weatherPayloadString.vil;
let getFreezeIdxURL = apiUrl.getFreezeIdx + '?' + weatherPayloadString.liv;
let getUVIdxURL = apiUrl.getUVIdx + '?' + weatherPayloadString.liv;
let getAirDiffusionIdxURL = apiUrl.getAirDiffusionIdx + '?' + weatherPayloadString.liv;
let getSenTaIdxURL = apiUrl.getSenTaIdx + '?' + weatherPayloadString.liv;

// 웹 서버를 생성합니다.
const app = express();
app.use(express.static('public'));

// 웹 서버를 라우트합니다.
app.get('/getAllRouteBusArrivalList', function (request, response) {
    if (busArrivalQueryUrl) {
        http.get(busArrivalQueryUrl, function (web) {
            // 데이터를 읽을 때마다
            web.on('data', function (buffer) {
                response.write(buffer);
            });

            // 데이터를 모두 읽으면
            web.on('end', function () {
                response.end();
                console.log('/getAllRouteBusArrivalList' + ' | ' + response.statusCode + ':' + response.statusMessage);
            });
        });
    } else {
        response.send('url 속성이 정의되지 않았습니다.');
    }
});

app.get('/getBusStationViaRouteList', function (request, response) {
    if (busNumQueryUrl) {
        http.get(busNumQueryUrl, function (web) {
            // 데이터를 읽을 때마다
            web.on('data', function (buffer) {
                response.write(buffer);
            });

            // 데이터를 모두 읽으면
            web.on('end', function () {
                response.end();
                console.log('/getBusStationViaRouteList' + ' | ' + response.statusCode + ':' + response.statusMessage);
            });
        });
    } else {
        response.send('url 속성이 정의되지 않았습니다.');
    }
});

let boardBaseUrl = "https://www.seo.incheon.kr/open_content/main/bbs/bbsMsgList.do?bcd=notice&pgno=";

app.get('/getSeoguBoard', function (request, response) {
    if (boardBaseUrl) {
        const pageNo = request.query['pageNo'];
        axios.get(boardBaseUrl + pageNo)
            .then(html => {
                response.send(html.data);
                console.log('/getSeoguBoard' + ' | ' + response.statusCode + ':' + response.statusMessage);
            })
            .catch((error) => console.log('/getSeoguBoard' + ' | ERROR:' + error.errno))
            .finally();
    } else {
        response.send('url 속성이 정의되지 않았습니다.');
    }
});

app.get('/getVilageFcst', function (request, response) {
    if (getVilageFcstURL) {
        const baseDate = request.query['baseDate'];
        const baseTime = request.query['baseTime'];
        http.get(getVilageFcstURL + '&base_date=' + baseDate + '&base_time=' + baseTime, function (web) {
            // 데이터를 읽을 때마다
            web.on('data', function (buffer) {
                response.write(buffer);
            });

            // 데이터를 모두 읽으면
            web.on('end', function () {
                response.end();
                console.log('/getVilageFcst' + ' | ' + response.statusCode + ':' + response.statusMessage);
            });
        });
    } else {
        response.send('url 속성이 정의되지 않았습니다.');
    }
});

app.get('/getUVIdx', function (request, response) {
    if (getUVIdxURL) {
        const time = request.query['time']; // time : 2021070712
        getUVIdxURL += '&time=' + time;
        http.get(getUVIdxURL, function (web) {
            // 데이터를 읽을 때마다
            web.on('data', function (buffer) {
                response.write(buffer);
            });

            // 데이터를 모두 읽으면
            web.on('end', function () {
                response.end();
                console.log('/getUVIdx' + ' | ' + response.statusCode + ':' + response.statusMessage);
            });
        });
    } else {
        response.send('url 속성이 정의되지 않았습니다.');
    }
});


// 웹 서버를 실행합니다.
app.listen(52273, function () {
    console.log('Server Running at http://localhost:52273');
});