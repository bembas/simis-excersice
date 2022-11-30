# simis-app
simis-app
This is an application of creating and editing a list of to-do tasks. The user is able to create, modify (checked/unchecked) and delete tasks.

The front-end consists of a simple html/css/javascript app inside the front-end folder containing the html elements, the styling of the list and the on-click function callings.

The back-end is developed using the express package for creating the server and building of the APIs, and the mongoose package for database connection with mongoDB.

To run the app:
1. In  "~/simis-excercise/back-end" run npm install.
2. Replace .env.example with a .env file containing your port, MongoDB username and password.
3. Run app.js - wait for "Connected on Mongo DB" , "Listening on port {your port} " consoled messages.
3. Open browser and type this url : "http://localhost:{your port}" .

