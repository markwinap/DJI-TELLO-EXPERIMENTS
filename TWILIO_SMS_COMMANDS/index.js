//EXPRESS HTTP SERVER
const express = require('./node_modules/express');
const bodyParser = require('./node_modules/body-parser');
const server_port = 3000;//Express HTTP Server PORT
//UPP
const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const status = dgram.createSocket('udp4');
//UDP PORTS
const port = 8889;//TELLO PORT
const port_status = 8890;//TELLO STATUS PORT
//EXPRESS CONFIG
const app = express();
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const tello_ip = '192.168.10.1';//YOUR TELLO IP
let commands = {[tello_ip]: {}};//OBJECT STATS AND COMMANDS HOLDER

//COMMANS TO INGNORE IN SMS RESPONSE
const cmd_ignore = ['mid', 'x', 'y', 'z', 'vgx', 'vgy', 'vgz', 'tof', 'mpry'];//SEE UDP MESSAGE DEFINITIONS IN README FOR ALL COMMANDS

//EXPRESS HTTP SERVER
app.post('/smsCommands', urlencodedParser, function (req, res) {// SEND COMMANDS TO DRONE
    commands[tello_ip] = Object.assign(commands[tello_ip], { cmd_list: cleanSMS(req.body.Body)});
    startCMD();
    let resp = '';
    res.setHeader('Content-Type', 'application/xml');
    if(commands[tello_ip].hasOwnProperty('status')){
      for(let i in commands[tello_ip]['status']){
        if(!cmd_ignore.includes(i)){
          resp += `${i}: ${commands[tello_ip]['status'][i]}\n`;
        }        
      }
    }
    else{
      resp = 'Drone Status Not Available';
    }
    res.send(MainGrap(BuildXML({Message : {}}, resp)));
});
app.listen(server_port);//START EXPRESS SERVER

//UDP SERVERS
//UDP CLIENT SERVER
server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
  });
  server.on('message', (msg, rinfo) => {
    //UNCOMNET FOR DEBUG
    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    nextCMD(rinfo.address);//Check if commands available 
  });
  server.on('listening', () => {
    let address = server.address();
    //UNCOMNET FOR DEBUG
    //console.log(`UDP CMD RESPONSE SERVER - ${address.address}:${address.port}`);
  });
  server.bind(port);
  //UDP STATUS SERVER
  status.on('listening', function () {
      let address = status.address();
      //UNCOMNET FOR DEBUG
      //console.log(`UDP STATUS SERVER - ${address.address}:${address.port}`);
  });
  status.on('message', function (message, remote) {
      //UNCOMNET FOR DEBUG
      //console.log(`${remote.address}:${remote.port} - ${message}`);
      let msg_obj = dataSplit(message.toString());
      if(commands.hasOwnProperty(tello_ip)){
        commands[tello_ip]['status'] = msg_obj;
      }
      else{
        commands = Object.assign(commands, {[remote.address]: { status: msg_obj }})
      }
  });
  status.bind(port_status);

//OTHER FUNCTIONS
function cleanSMS(str){
    return str.trim().split(/\s*(?:,|$)\s*/).toLowerCase();
}
//UDP FUNCTIONS
async function startCMD(){
    let arr = Object.keys(commands);
    for(let i in arr){
      await senCMD(arr[i], commands[arr[i]]['cmd_list'][0]).catch((e) => console.log(e)).then((res) => console.log(res));
    }
    return 'OK';
  }
function dataSplit(str){//Create JSON OBJ from String  "key:value;"
  let data = {};
  let arrCMD = str.split(';');  
  for(let i in arrCMD){
    let tmp = arrCMD[i].split(':');
    if(tmp.length > 1){
      data[tmp[0]] = tmp[1];
    }
  }
  return data;
}
//SEND COMMANDS
function senCMD(tello, command) {//SEND COMMAND TO TELLO OR SPECIAL FUNCTIONS
    let cmd = command.split(' ');
    console.log(command);
    if(cmd[0] == 'wait'){
      return new Promise((resolve, reject) => {
        setTimeout(function () {
          nextCMD(tello);
          resolve('OK');
        }, parseInt(cmd[1], 0) * 1000);
      });
    }
    else if(cmd[0] == 'level'){// SET DRONE TO DESIRE LEVEL, CHECK CURRENT HEIGHT ANS SEND COMMAND TO MACH
        return new Promise((resolve, reject) => {
          let msg = null;
          let level = parseInt(cmd[1], 0);
          let h =  parseInt(commands[tello]['status']['h'], 0);
          if(h < level){
            msg = Buffer.from(`up ${level - h}`);
            console.log(`up ${level - h}`)
          }
          else if(h > level){
            msg = Buffer.from(`down ${h - level}`);
            console.log(`down ${h - level}`)
          }
          else{
            msg = Buffer.from('command');//DOMMY COMMAND
          }      
          server.send(msg, 0, msg.length, port, tello, function (err) {
            if (err) {
              console.error(err);
              reject(`ERROR : ${command}`);
            } else resolve('OK');
          });
        });
      }
    else if(cmd[0] == 'close'){//CLOSE UDP CONNECTION
      return new Promise((resolve, reject) => {
        server.close();
        server.unref();
        resolve('OK');
      });
    }
    else{//DEFAULT - SEND COMMAND TO TELLO DRONE
      return new Promise((resolve, reject) => {
        let msg = Buffer.from(command);
        server.send(msg, 0, msg.length, port, tello, function (err) {
          if (err) {
            console.error(err);
            reject(`ERROR : ${command}`);
          } else resolve('OK');
        });
      });
    }
  }

function nextCMD(tello) {//GET NEXT COMMAND IN LINE
  if (commands.hasOwnProperty(tello)) {
    if(commands[tello].hasOwnProperty('cmd_list')){
      let cmd = commands[tello]['cmd_list'];
      if (cmd.length > 1) {
        cmd.shift();
        senCMD(tello, commands[tello]['cmd_list'][0]);
      } else {
        console.log('ALL CMD SENT');
      }
    }
    else{
      console.log('ALL CMD SENT');
    }

  } else {
    console.log('Drone Not Found');
  }
}
//XML Builder
function MainGrap(XML) {
  return `<?xml version=\"1.0\" encoding=\"UTF-8\"?><Response>${XML}</Response>`;
}
function BuildXML(obj, c){
  let tbase = '';
  let pro = Object.getOwnPropertyNames(obj)[0];
  Object.getOwnPropertyNames(obj[pro]).forEach(function (val) {
        tbase += ' ' + val + '="'+ obj[pro][val] + '"';
      });
return '<' + pro + tbase + '>' + c + '</' + pro + '>';
}