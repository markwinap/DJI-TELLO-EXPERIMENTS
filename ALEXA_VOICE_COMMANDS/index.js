/*
2019-02-04
Marco Martinez

INCOMMING WEBSOCKET MESSAGE
{"deviceId":"5c58e5237c472c33aaff4680","action":"SetBrightness","value":25}

POST REQUEST
{
    "192.168.10.1": {
      "cmd_list" : ["takeoff", "level 110","wait 2","rc 0 60 0 -90","wait 1", "land"],
      "status": {}
    }
}

*/
const axios = require('axios');
const WebSocket = require('ws');
const SinricToken = 'YOUR_API_KEY';// YOUR API KEY FROM https://sinric.com/
//WESOCKET CONFIG 
const ws = new WebSocket('ws://iot.sinric.com', {headers: {"Authorization" : Buffer.from("apikey:" + SinricToken).toString('base64')}});
//TELLO MISSION CONTROL CONFIG
const host = 'localhost';
const port = 3000;
//Sinric DEVICE IDS
const UP = 'CHANGE_ME';
const DOWN = 'CHANGE_ME';
const LEFT = 'CHANGE_ME';
const RIGHT = 'CHANGE_ME';
const FORWARD = 'CHANGE_ME';
const BACKWARD = 'CHANGE_ME';
const LAND_TAKEOFF = 'CHANGE_ME';

let mainInterval = null;//HOLDER FOR INTERVAL
ws.on('open', function open() {
   console.log("ALEXA Set Drone Up 50");
});
ws.on('message', function incoming(data) {
    let cmdObj = JSON.parse(data);   
    let temp_val = cmdObj.value == 'ON' ? 50 : cmdObj.value == 'OFF' ? 50 : cmdObj.value * 5;
    let cmd = null;
    switch(cmdObj.deviceId){
        case UP:
            cmd = [`up ${temp_val}`];
            break;
        case DOWN:
            cmd = [`down ${temp_val}`];
            break;
        case LEFT:
            cmd = [`left ${temp_val}`];
            break;
        case RIGHT:
            cmd = [`right ${temp_val}`];
            break;
        case FORWARD:
            cmd = [`forward ${temp_val}`];
            break;
        case BACKWARD:
            cmd = [`back ${temp_val}`];
            break;
        case LAND_TAKEOFF:
            cmd = cmdObj.value == 'ON' ? ['command', 'takeoff'] : ['land'];
            break;
        default:
            console.log(cmdObj)
    }
    console.log(cmd);
    clearInterval(mainInterval);
    send_cmd(cmd);
});
function send_cmd(cmd){
    axios({//SEND THE REQUEST TO OUT LOCAL SERVER
        method: 'post',
        url: `http://${host}:${port}/sendCommands`,
        headers: {'Content-Type': 'application/json'},
        data: {
            "192.168.10.1":{
                "cmd_list" : cmd,
                "status": {}
            }
        }
    }).catch(e=> console.log(e.code)).then(res => {
        console.log('SENT')
        enableInterval();
    });
}

function enableInterval() {
    clearInterval(mainInterval);
    mainInterval = setInterval(function(){
        send_cmd(['command']);
    }, 4000);
}