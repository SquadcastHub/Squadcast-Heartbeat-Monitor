// DEFINING ENVIRONMENT CONFIG
require("dotenv").config();
const pingAlert = require("./checkAlertSourceHealth");
const { ms, s, m, h } = require('time-convert');
var pingInterval = null;

if( process.env.INTERVAL_UNIT.toLowerCase() == "seconds" ) {
    pingInterval = ms.from(s)(process.env.INTERVAL_VALUE);
}
else if( process.env.INTERVAL_UNIT.toLowerCase() == "minutes" ) {
    pingInterval = ms.from(m)(process.env.INTERVAL_VALUE);
}
else if( process.env.INTERVAL_UNIT.toLowerCase() == "hours" ) {
    pingInterval = ms.from(h)(process.env.INTERVAL_VALUE);
}
else if( process.env.INTERVAL_UNIT.toLowerCase() == "milliseconds" ) {
    pingInterval = process.env.INTERVAL_VALUE;
}
else {
    throw new Error("Interval Unit or Value Incorrect!");
}

console.log(" <----- Prometheus Incident Monitor ----->");
console.log("\n");

setInterval(pingAlert.checkHeartBeat, pingInterval);