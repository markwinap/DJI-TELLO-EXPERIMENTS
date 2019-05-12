# DJI TELLO EXPERIMENTS - TWILIO SMS COMMABDS


### CLONE REPO
```sh
git clone https://github.com/markwinap/DJI-TELLO-EXPERIMENTS.git
```
### GO TO FOLDER
```sh
cd DJI-TELLO-EXPERIMENTS/TWILIO_SMS_COMMANDS/
```
### INSTALL
```sh
npm install
```
### START SERVER
```sh
node index
```
### Expose Local Server To Public Internet
```sh
ssh -R 80:localhost:3000 serveo.net
```

## UDP COMANDS SDK 1.3

| COMMAND | DEFINITION | NOTES | EXAMPLE | RESPONSE |
| ------ | ------ | ------ | ------ | ------ |
| command | Enable command mode | Required before sending drone commands | command | ok, error |
| takeoff | Start Drone motors and takeoff | Takeoff and go to ~60-90 cm height | takeoff | ok, error |
| land | Land the Drone and stop the motors | ~50cm/s land speed | land | ok, error |
| emergency | Stop motors | Use for emergency stop | emergency | ok, error |
| up x | Go up 20 - 500 | Centimeters - Imput lower than 20 will get ignored | up 10 | ok, error |
| down x | Go down 20 - 500 | Centimeters - Imput lower than 20 will get ignored | down 10 | ok, error |
| left x | Go left 20 - 500 | Centimeters - Imput lower than 20 will get ignored | left 10 | ok, error |
| right x | Go right 20 - 500 | Centimeters - Imput lower than 20 will get ignored | right 10 | ok, error |
| forward x | Go forward 20 - 500 | Centimeters - Imput lower than 20 will get ignored | forward 10 | ok, error |
| back x | Go backward 20 - 500 | Centimeters - Imput lower than 20 will gw 180 | ok, error |
| flip x | Flip drone to the left, right, forward or backward | Possible inputs (l, r, f b) | flip f | ok, error |
| go x y z speed | Go Forward or Backward, Left or Rigth, Up or Down  | X: -500 - 500, Y: -500 - 50et ignored | back 10 | ok, error |
| cw x | Rotate drone clockwise 1-360 | Degrees | Degrees | ccw 180 | ok, error |
| ccw x | Rotate drone counterclockwise 1-360 | Degrees | ccw 180 | ok, error |

## EXTRA COMMANDS

| COMMAND | DEFINITION | NOTES | EXAMPLE | RESPONSE |
| ------ | ------ | ------ | ------ | ------ |
| wait x | Wait 1-15 | Seconds | wait 3 | ok, error |
| level x |Level Drone to 20-500 | Centimeters | level 200 | ok, error |


### UDP Message Definitions - SDK 1.3

| KEY | DEFINITION | SAMPLE VALUE |
| ------ | ------ | ------ |
| mid | ? | 257 |
| x | Not in use | 0 |
| y | Not in use | 0 |
| z | Not in use | 0 |
| pitch | Drone pitch inclination to move forward or backward | 10 |
| roll | Drone roll inclination to left or right | 10 |
| yaw | Drone rotation clockwise or counterclockwise | -20 |
| vgx | Speed Of X Axis | 0 |
| vgy | Speed Of Y Axis | 0 |
| vgz | Speed Of Z Axis | 0 |
| templ | Low Average Temperature in C | 65 |
| temph | Max Average Temperature in C | 65 |
| tof | Time Of Fligth Distance | 10 |
| h | Height (cm) | 10 |
| bat | Battery (%) | 67 |
| baro | Meters above sea level (Meters) | 1687.34 |
| agx |  Acceleration X (0.001g) | 6.00 |
| agy |  Acceleration Y (0.001g) | 0.00 |
| agz |  Acceleration Z (0.001g) | -999.00 |

### Twilio SMS Body URL Encoded

| KEY | SAMPLE VALUE |
| ------ | ------ |
| ApiVersion | 2010-04-01 |
| SmsSid | SMabc123 |
| SmsStatus | received |
| SmsMessageSid | SMabc123 |
| AddOns | {"status":"successful","message":null,"code":null,"results":{}} |
| NumSegments | 1 |
| From | +123456789 |
| ToState | ABC |
| MessageSid | SMabc123 |
| AccountSid | ACabc123 |
| ToZip | ABC |
| FromCountry | ABC |
| ToCity | ABC |
| FromCity | ABC |
| To | +123456789 |
| FromZip | ABC |
| Body | ABC |
| ToCountry | ABC |
| FromState | ABC |
| NumMedia | 0 |


### Usefull Links

- [Twilio Twiml Message](https://www.twilio.com/docs/sms/twiml/message)
- [Enable SSH On Windows](https://www.howtogeek.com/336775/how-to-enable-and-use-windows-10s-built-in-ssh-commands)