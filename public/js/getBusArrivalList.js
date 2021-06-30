var xhr = new XMLHttpRequest();
var url = 'http://127.0.0.1/api.php'
var rString = '';
var xmlString = '';
// var jsonString = '';
// var parser = new DOMParser();
xhr.onreadystatechange = callbackFunction;
xhr.open('GET', url, true);
xhr.send('');

function callbackFunction(){
    // 0: request not initialized
    // 1: server connection established
    // 2: request received
    // 3: processing request
    // 4: request finished and response is ready
    if(xhr.readyState === 1 || xhr.readyState === 2 || xhr.readyState ===3 ){
        // alert("Request in progress..." + xhr.readyState) //화면에 작업 중 메시지 출력
    }else if(xhr.readyState === 4){ if(xhr.status === 200){
        // alert(xhr.statusText);
        rString = xhr.responseText;
        // alert(rString.length);

        rString = unescapeHtml(xhr.responseText);
        var indexStart = rString.indexOf("<?xml");
        // alert(indexStart)
        xmlString = rString.slice(indexStart, -1);
        // alert(xmlString);
        xmlString = unescapeHtml(xmlString);
        // alert(xmlString.length);
    }else{ alert("문제 발생:" + xhr.status); } } }
// var xml = parser.parseFromString(xmlString, "text/xml");
// var obj = xmlToJson(xml);
// jsonString = xml2json(unescapeHtml(xmlString));
// jsonString = JSON.stringify(obj);
// alert(jsonString);

function unescapeHtml(str) {
    if (str == null) {
        return "";
    }
    return str
        // .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"');
    //     .replace(/&#039;/g, "'")
    //     .replace(/&#39;/g, "'");
}

function getBusArrivalList(){
    alert(xmlString.length)
    return xmlString;
}
