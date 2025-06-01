To Start
Frontend: Run npm install and install react-router-dom for node and react
Backend: Have maven downloaded and run mvn spring-boot:run to start the server

User Data
App requires a local MySQL database. See application.properties for DB name and credentials. You may need to create your own test data after launching.”

About

Welcome to BookMark! We’re an app that lets you show the world the books YOU love!

	BookMark is my full-stack web project which allows users to create an account, browse books in the database, and pin your favorite books to your profile using my “BookMark” function. Anywhere books are displayed, they may automatically be pinned to user profiles with the built in BookMark button. Starting at the home page, a user would click “login” route on the NavBar. After successfully logging in, our novel enthusiast is redirected to the “All Books” page, where they may filter and search books using both a dynamic keyword filter in tandem with a separate dropdown filter, Users may narrow down search results through categories like “title”, “author”, and “genre”. Along with browsing and bookmarking, the app allows for viewing other users’ profiles and their bookmarks, along with their own profile. Those with a role of “ROLE_ADMIN” are even allowed to contribute books to the site through my “Add Books” form. This project was fueled by my love for all things literary.


Tech Stack

 -This web application is built on the front-end using React, React router-dom for routing, and BootStrap for UI/UX design purposes, written in JavaScript.

- On the back-end, I constructed the server with a framework of SpringBoot, written in Java, and storing the information in the MySQL database.

-Tools used in the production include Maven to automate compiling, packaging, testing, and deployment of server functions, Specific testing of controllers is processed through JUnit. Security for authenticated routes such as Login, book creation, and bookmarking is managed by JWT using an authentication filter to provide tokens for accessing said routes, Features like “Add Books” are protecting by implementing the role of “Admin”.

Setup
`To set this app up on a local network , one would create a database in MySQL Workbench under the schema “flexpath_final”. To start SpringBoot, in VSCode, go to terminal and enter in the command “mvn spring-boot:run”. On the front end, run “npm install” to add React, “npm instal react-router-dom” to add routing capabilities, and “npm start” to run the app. 

Testing

-Testing is performed using MockMvc annotations and JUnit. 

-Tests cover controller routes and the JWT authentication system

Conclusion

Thank you so much for coming to check out my project! I hope you enjoy your time here. This application was created by developer Gianetta Marie Moretti as a final project for the LaunchCode FlexPath program.

