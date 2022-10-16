// DEFINING ENVIRONMENT CONFIG
require("dotenv").config();
const pingMonitor = require("./checkHeartbeat");

const { ms, s, m, h } = require('time-convert');
var pingInterval = null;

const urlJson = require('../Squadcast-Heartbeat-Monitor/URL.json');
const urlValues = Object.values(urlJson);

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

console.log(" <----- Squadcast Heartbeat Monitor ----->");
console.log("\n");
console.log(" The URLs being monitored are :");
console.log("\n");
for (let j = 0; j < urlValues.length; j++) {
    console.log(urlValues[j]);
}

setInterval(pingMonitor.checkHeartBeat, pingInterval);