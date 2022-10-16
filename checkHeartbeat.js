// IMPORTS
const axios = require("axios");

// DEFINING ENVIRONMENT CONFIG
require("dotenv").config();

// IMPORTING JSON FILES
const urlJson = require('../Squadcast-Heartbeat-Monitor/URL.json');
const urldata = require('../Squadcast-Heartbeat-Monitor/DATA.json');
const urlKeys = Object.keys(urlJson);
const urlValues = Object.values(urlJson);
const urlData = Object.values(urldata);
const IncidentCreated = Array(urlValues.length).fill('no');
var count = 0;


const checkHeartBeat = async () => {
    if( process.env.DEFAULT_HTTP_METHOD.toLowerCase() == "post") {
        for (let i = 0; i < urlValues.length; i++) {
            await axios({
                method: process.env.DEFAULT_HTTP_METHOD,
                url: urlValues[i],
                // auth: {
                //     username: request.header("username"),
                //     password: request.header("password")
                // },
                data : process.env.USE_CUSTOM_PAYLOAD_VARIABLES.toLowerCase() == "yes" ? urlData[i] : urlData[0]
                })
                .then(async (res) => {
                    if( res.status != 200) {
                        if( IncidentCreated[i] == "no" ) {
                            await axios({
                            method: "post",
                            url: process.env.INCIDENT_WEBHOOK,
                            data : {
                                    "message": "URL : "+urlValues[i]+" went down",
                                    "description": "URL Name : "+urlKeys[i]+"\nURL : "+urlValues[i]+"\nWent Down At : "
                                            +new Date().toUTCString()+"\n\nResponse Data : "+JSON.stringify(res.data),
                                    "tags" : {
                                    "status":res.status,
                                    "source":"heartbeat"
                                    },
                                    "status": "trigger",
                                    "event_id": i
                                }
                            })
                            .then(async (resp) => {
                                //HANDLE SUCCESS
                                IncidentCreated[i] = "yes";
                            })
                    }}
                    else{
                        if( IncidentCreated[i] == "yes" ) {
                        IncidentCreated[i] = "no"
                    }}
                })
                .catch(async (err) => {
                    if( IncidentCreated[i] == "no" ) {
                    await axios({
                        method: "post",
                        url: process.env.INCIDENT_WEBHOOK,
                        data : {
                                "message": "Error, Could Not Reach : "+urlValues[i],
                                "description": "URL Name : "+urlKeys[i]+"\nURL : "+urlValues[i]+"\nWent Down At : "
                                        +new Date().toUTCString()+"\n\nResponse Data : "+JSON.stringify(err),
                                "tags" : {
                                "status":"Error",
                                "source":"heartbeat"
                                },
                                "status": "trigger",
                                "event_id": i
                            }
                        })
                        .then(async (resp) => {
                            //HANDLE SUCCESS
                            IncidentCreated[i] = "yes";
                        })
                    }
                });
        }
    }
    else {
        for (let i = 0; i < urlValues.length; i++) {
            await axios({
                method: process.env.DEFAULT_HTTP_METHOD,
                url: urlValues[i],
                // auth: {
                //     username: request.header("username"),
                //     password: request.header("password")
                // },
                })
                .then(async (res) => {
                    if( res.status != 200) {
                        if( IncidentCreated[i] == "no" ) {
                        await axios({
                            method: "post",
                            url: process.env.INCIDENT_WEBHOOK,
                            data : {
                                    "message": "URL : "+urlValues[i]+" went down",
                                    "description": "URL Name : "+urlKeys[i]+"\nURL : "+urlValues[i]+"\nWent Down At : "
                                            +new Date().toUTCString()+"\n\nResponse Data : "+JSON.stringify(res.data),
                                    "tags" : {
                                    "status":res.status,
                                    "source":"heartbeat"
                                    },
                                    "status": "trigger",
                                    "event_id": i
                                }
                            })
                            .then(async (resp) => {
                                //HANDLE SUCCESS
                                IncidentCreated[i] = "yes";
                            })
                    }}
                    else{
                        console.log("Yayy!!!!!!"+ (count++));
                        if( IncidentCreated[i] == "yes" ) {
                        IncidentCreated[i] = "no"
                    }}
                })
                .catch(async (err) => {
                    if( IncidentCreated[i] == "no" ) {
                    await axios({
                        method: "post",
                        url: process.env.INCIDENT_WEBHOOK,
                        data : {
                                "message": "Error, Could Not Reach : "+urlValues[i],
                                "description": "URL Name : "+urlKeys[i]+"\nURL : "+urlValues[i]+"\nWent Down At : "
                                        +new Date().toUTCString()+"\n\nResponse Data : "+JSON.stringify(err),
                                "tags" : {
                                "status":"Error",
                                "source":"heartbeat"
                                },
                                "status": "trigger",
                                "event_id": i
                            }
                        })
                        .then(async (resp) => {
                            //HANDLE SUCCESS
                            IncidentCreated[i] = "yes";
                        })
                    }
                });
        }
    }
}

module.exports = {checkHeartBeat};