# Pixels
Pixel placing design &amp; strategy game

## Setup
1. Clone Repo
2. Run 'npm install' in all three subdirectories (client, authServer, server) to install dependencies
3. In "authServer" create a text file called .env (you can use 'touch .env' on mac or linux)
4. Within each .env file write ACCESS_TOKEN_SECRET=PUT_YOUR_TOKEN_HERE on line 1, and on line 2 write REFRESH_TOKEN_SECRET=PUT_YOUR_REFRESH_TOKEN_HERE. Your token and refresh token can be any combination of numbers and letters.
5. Copy your .env file into "server"
6. (optional): To change server port, change 'app.listen(8000);' to 'app.listen(YOUR_PORT);' in server/server.js and in client/src/app/socket.service.ts change 'const socket = io('http://localhost:8000/');' to 'const socket = io('http://localhost:YOUR_PORT/');'

## Running the app
1. Open 3 terminal windows
2. cd to "client" "authServer" and "server" in each window respectively
3. In "client", run 'ng build --watch' to start the angular app
4. In both "authServer" and "server", run 'node server.js' or 'nodemon server.js' if you have nodemon installed
5. Navigate to localhost:8000/ in your web browser of choice (chrome recommended) and your app should be running smoothly.
