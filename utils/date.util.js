// Datetime related utilities

const getCurrentTimestamp = () => {

    let d = new Date();
    var date_format_str = d.getFullYear().toString() +
        "-" +
        ((d.getMonth() + 1).toString().length == 2 ? (d.getMonth() + 1).toString() : "0" +
            (d.getMonth() + 1).toString()) +
        "-" +
        (d.getDate().toString().length == 2 ? d.getDate().toString() : "0" +
            d.getDate().toString()) +
        " " +
        (d.getHours().toString().length == 2 ? d.getHours().toString() : "0" +
            d.getHours().toString()) +
        ":" +
        (d.getMinutes().toString().length == 2 ? (d.getMinutes().toString()) :
            "0" +
            (d.getMinutes().toString())) +
        ":" +
        (d.getSeconds().toString().length == 2 ? (d.getSeconds().toString()) :
            "0" +
            (d.getSeconds().toString()));

    // console.log(date_format_str);

    return date_format_str;
};


const converToLocalTime = (serverDate) => {

    var dt = new Date(Date.parse(serverDate));
    var localDate = dt;

    var gmt = localDate;
    var min = gmt.getTime() / 1000 / 60; // convert gmt date to minutes
    var localNow = new Date().getTimezoneOffset(); // get the timezone
    // offset in minutes
    var localTime = min - localNow; // get the local time

    var dateStr = new Date(localTime * 1000 * 60);
    // dateStr = dateStr.toISOString("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"); // this will return as just the server date format i.e., yyyy-MM-dd'T'HH:mm:ss.SSS'Z'
    dateStr = dateStr.toString("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    return dateStr;
}

module.exports = {
    getCurrentTimestamp,
    converToLocalTime
};