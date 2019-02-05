# DJI TELLO EXPERIMENTS

IMPORTANT YOU ALSO REQUIRE THE FOLLOWING REPO INSTALLED https://github.com/markwinap/Tello_Mission_Control_-_UDP_Server.git

### CLONE REPO
```sh
git clone https://github.com/markwinap/DJI-TELLO-EXPERIMENTS.git
```
### GO TO FOLDER
```sh
cd DJI-TELLO-EXPERIMENTS/ALEXA_VOICE_COMMANDS/
```
### INSTALL
```sh
npm install
```
### START SERVER
```sh
node index
```

| COMMAND | DEFINITION | SAMPLE PHRASE |
| ------ | ------ | ------ |
| up x | Go up X cm | ALEXA Set drone up 40 |
| down x | Go down X cm | ALEXA Set drone down 25 |
| left x | Go left X cm | ALEXA Set drone left 50 |
| right x | Go right X cm | ALEXA Set drone right 30 |
| forward x | Go forward X cm | ALEXA Set drone forward 60 |
| back x | Go backward X cm | ALEXA Set drone backward 75 |
| takeoff | tekeoff aircraft | ALEXA turn ON Drone |
| land | land aircraft | ALEXA turn OFF Drone |