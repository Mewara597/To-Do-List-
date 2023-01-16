
exports.getDate = getDate

function getDate() {
    let today = new Date();

    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    let day = today.toLocaleDateString("en-us", options);
    return day
}

exports.getDay = getDay;
let today = new Date();


function getDay() {
    let options = {
        month: "long"
    };
    let day = today.toLocaleDateString("en-us", options);
    return day
}

