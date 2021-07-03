let today = new Date("2021-1-1 00:46:00");
let yesterday = new Date(today.getTime() - (24*60*60*1000));
let year = today.getFullYear();
let month = today.getMonth() + 1;
let day = today.getDate();
let hour = today.getHours();
let minute = today.getMinutes();
let second = today.getSeconds();

hour = minute > 45 ? hour : hour - 1;
if (hour < 0) {
    hour = 23;
    day = yesterday.getDate();
    month = yesterday.getMonth() + 1;
    year = yesterday.getFullYear();
}

month = month > 10 ? month : '0' + month;
day = day > 10 ? day : '0' + day;
hour = hour > 10 ? hour : '0' + hour;
minute = minute > 10 ? minute : '0' + minute;
second = second > 10 ? second : '0' + second;

fullDate = year + '' + month + '' + day;
hourMin = hour + '' + minute;
hourMinSec = hourMin + '' + second;

console.log(fullDate, hourMin);