// IMPORTS
const axios = require("axios");

// DEFINING ENVIRONMENT CONFIG
require("dotenv").config();

// UTILITIES
const logger = require("./util/logger/loggerUtil");

let getIncidentURL = null;
let isCreated = isResolved = false;


const checkHeartBeat = async () => {
    let end_time = new Date().toJSON();
    let date = new Date();
    date.setMinutes(date.getMinutes() - 10);
    let start_time = date.toISOString();
    var token = "";
    getIncidentURL = "https://api.squadcast.com/v3/incidents/export?start_time="+start_time+"&end_time="+end_time+"&sources=5a9002f082bb573a2bc779eb&type=json&owner_id=";
    await axios({
        method: 'get',
        url: "https://auth.squadcast.com/oauth/access-token",
        headers:{
          "X-Refresh-Token" : process.env.X_REFRESH_TOKEN
        }
        })
        .then(async (resp) => {
            //HANDLE SUCCESS
            token = resp.data.data.access_token;
            await axios({
                method: 'get',
                url: getIncidentURL+process.env.OWNER_ID,
                headers: {"Authorization" : `Bearer ${token}`}
                })
                .then(async (res) => {
                    if( res.data.incidents.length == 0 ) {
                        if( isCreated ) {
                            await axios({
                                method: "post",
                                url: process.env.INCIDENT_WEBHOOK,
                                data : {
                                        "message": "No Incidents from Prometheus in Last 10 mins",
                                        "description": "No Incidents found from prometheus in last 10 mins \nWent Down At : "
                                                +new Date().toUTCString(),
                                        "tags" : {
                                        "source":"heartbeat"
                                        },
                                        "status": "trigger",
                                        "event_id": "19102022"
                                    }
                                })
                                .then(async (createdRes) => {
                                    //HANDLE SUCCESS
                                    isCreated = true;
                                    isResolved = false;
                                })
                                .catch(async (err) => {
                                    //HANDLE INTERNAL SERVER ERROR
                                    logger.error("Internal Server Error - Cannot Reach Incident Webhook " + err);
                                });
                        }
                    }
                    else{
                        if( isResolved ) {
                            await axios({
                                method: "post",
                                url: process.env.INCIDENT_WEBHOOK,
                                data : {
                                        "message": "No Incidents from Prometheus in Last 10 mins",
                                        "description": "No Incidents found from prometheus in last 10 mins \nWent Down At : "
                                                +new Date().toUTCString(),
                                        "tags" : {
                                        "source":"heartbeat"
                                        },
                                        "status": "resolve",
                                        "event_id": "19102022"
                                    }
                                })
                                .then(async (resolvedRes) => {
                                    //HANDLE SUCCESS
                                    isResolved = true;
                                    isCreated = false;
                                })
                                .catch(async (err) => {
                                    //HANDLE INTERNAL SERVER ERROR
                                    logger.error("Internal Server Error - Cannot Reach Incident Webhook " + err);
                                });
                        }
                    }
                })
                .catch(async (err) => {
                    await axios({
                        method: "post",
                        url: process.env.INCIDENT_WEBHOOK,
                        data : {
                                "message": "No Incidents from Prometheus in Last 10 mins",
                                "description": "No Incidents found from prometheus in last 10 mins \nWent Down At : "
                                        +new Date().toUTCString(),
                                "tags" : {
                                "source":"heartbeat"
                                },
                                "status": "trigger",
                                "event_id": "19102022"
                            }
                        })
                        .then(async (createdResp) => {
                            //HANDLE SUCCESS
                            isCreated = true;
                            isResolved = false;
                        })
                        .catch(async (err) => {
                            //HANDLE INTERNAL SERVER ERROR
                            logger.error("Internal Server Error - Cannot Reach Incident Webhook " + err);
                        });
                });
        });
}

module.exports = {checkHeartBeat};