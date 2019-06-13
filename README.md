# Dreadfight
A top-down multiplayer car shooting game run on Node.js and P5.js.

## How did we build this?
Working on a new Javascript project was pretty challenging to be done in just two weeks since none of us have really programmed in Javascript before. So we spent the time to learn a new language and found out how to transmit data between a server and a client to create this game! Some corners were cut to reduce our time spent on parts, most calculations are done on the client side. Player collision checks, movements, positions, etc are all done on the client side and just transmitted to the server to be spread out among clients. So as you can already tell, it's **very** easy to cheat. However, the point of this project was simply to explore the field of drawing and transmitting data between a server and client, we managed to do this in such a short period! 

## How to Install?
Make sure you have Node.js installed, any version is fine. (We personally tested on 10.16.0 LTS) You can download Node.js at this link: https://nodejs.org/en/.

1. Clone the repo or download the files somewhere on your computer.
2. Install the required dependencies using in any terminal. Go to the root of the folder and run:
```
npm install
```
This will automatically install all dependencies.
3. Using the same terminal launch the server using:
```
node server.js
```
You're done! Go to localhost:5000 (or the the IP of your host) and you'll be able to access it!

There is no configuration file. So to change the port you'll have to open server.js and manually edit that portion, it shouldn't break anything. (I think!)

## Screenshots
![screenshot 1](https://i.imgur.com/VJnbx9K.png)
![screenshot 2](https://i.imgur.com/4TU1c8f.png)
![screenshot 3](https://i.imgur.com/rg8gWLk.png)
