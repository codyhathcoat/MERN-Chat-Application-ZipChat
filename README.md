# MERN Chat Application: ZipChat
ZipChat is a real-time messaging application built with the MERN stack (MongoDB, Express, React, Node.js). It allows users to register, log in, and participate in live chatrooms—whether one-on-one or in group conversations. Users can create and delete chatrooms, personalize their profile, and enjoy a seamless chat experience with real-time updates.

## Installation
1. Clone the repository:  
git clone https://github.com/hathcoat/ZipChat.git 

2. Download Node.js (If not done yet already):  
https://nodejs.org/

2. Download MongoDB (If not done yet already):  
https://www.mongodb.com/try/download/community

4. Install dependencies:  
cd ZipChat/backend
npm install  
cd ../frontend  
npm install

5. Environment Variables  
Create a `.env` file in the `backend` directory and add the following:  
MONGO_URI=your_mongodb_connection_string (You can download MongoDB Compass to get started and get a URI here: https://www.mongodb.com/try/download/compass)  
JWT_SECRET=your_secret_key  
PORT=5000  


### Backend Dependencies
The backend of this project is built with **Node.js** and **Express**, and uses the following major dependencies:
- **express** (^4.21.2): Web framework for Node.js.
- **mongoose** (^8.10.0): ODM (Object Data Modeling) library for MongoDB and Node.js.
- **jsonwebtoken** (^9.0.2): For handling JSON Web Token (JWT) authentication.
- **bcryptjs** (^2.4.3): Library to hash and compare passwords securely.
- **dotenv** (^16.4.7): Loads environment variables from a `.env` file.
- **cors** (^2.8.5): Middleware to enable Cross-Origin Resource Sharing.

The development dependencies (For testing and development only) include:
- **jest** (^29.7.0): JavaScript testing framework.
- **supertest** (^7.0.0): HTTP assertions and testing utilities for Node.js.
- **mongodb-memory-server** (^10.1.4): Runs a MongoDB server in-memory for testing.
- **babel-jest** (^29.7.0): Transpiles ES6+ code to be tested by Jest.
- **@babel/core** (^7.26.9), **@babel/preset-env** (^7.26.9): Babel compiler and presets to allow modern JavaScript during testing.

### Frontend Dependencies
The frontend is built using **React.js** and includes the following major dependencies:
- **react** (^19.0.0): JavaScript library for building user interfaces.
- **react-dom** (^19.0.0): Provides DOM-specific methods for React.
- **react-router-dom** (^7.2.0): Routing library for navigating between pages in your React app.
- **axios** (^1.7.9): Promise-based HTTP client for making API requests to the backend server.
- **jwt-decode** (^4.0.0): Library to decode JSON Web Tokens (JWTs) on the client side.
- **react-scripts** (5.0.1): Scripts and configuration used by Create React App (CRA).
- **cra-template** (1.2.0): The base template used when setting up the project with Create React App.

The development dependencies (For testing and development only) include:
- **jest** (^29.7.0): JavaScript testing framework.
- **@testing-library/react** (^16.2.0): Helps with testing React components.
- **@testing-library/jest-dom** (^6.6.3): Provides custom DOM element matchers for Jest.
- **babel-jest** (^29.7.0): Transpiles modern JavaScript for Jest tests.
- **@babel/core** (^7.26.9): Babel compiler core package.
- **@babel/preset-env** (^7.26.9): Babel preset for compiling ES6+ syntax.
- **@babel/preset-react** (^7.26.3): Babel preset for compiling React JSX.
- **identity-obj-proxy** (^3.0.0): Mock CSS modules in Jest tests.
- **jest-environment-jsdom** (^29.7.0): Provides a browser-like environment for Jest tests.
- **util** (^0.12.5): Polyfill for Node.js util module in browser environments.

## Usage
Run the backend:  
cd backend  
node ./server.js

Run the frontend:  
cd ../frontend  
npm start

After starting both the frontend and backend, visit 'http://localhost:3000' to interact with the application.

## Features
- User authentication (Login and Registration)
- Chatroom creation/selection
- Message sending/receiving
- Display of full conversation history in chatrooms
- List of all available chatrooms
- Chatroom deletion
- Ability to set and change first and last name
- Customizable avatar with the users first and last initial and chosen color option
- Messages with timestamps
- Ability to create a chatroom with multiple users (Group chat)

## Testing
To run the tests in the backend, enter the following commands:  
cd backend  
npm test

To run the tests in the frontend, you must leave the backend by using the following commands:  
cd ../frontend  
npm test  

Using these tests you will be able to see the validity of the software.

