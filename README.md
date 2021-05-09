# PicExchange

Image exchanging web app where you gain credits for uploading and spend them on downloading user-submitted images.

Using a system of credits, users acquire credits for uploading images to the app. In order to download an image from the app, a user must spend one of their credits. Currently all images give 1 credit for upload, and cost 1 credit to download. Uploading and downloading images requries an account, while viewing all images that have been posted is available to anyone.

This project is currently hosted at https://pic-exchange-demo.herokuapp.com/

## Built With

-  [React](https://reactjs.org/) - Framework used to design the front-end UI
-  [Express](https://expressjs.com/) - Back-end web application framework
-  [MongoDB](https://www.mongodb.com/) - Database used to store required data
-  [Node.js](https://nodejs.org/) - JavaScript run-time environment
-  [Mocha](https://mochajs.org/) - JavaScript testing framework
-  [Chai](https://www.chaijs.com/) - A BDD/TDD assertion library

## Development

### Prerequisites

To run this application, you'll need:

-  Node.js & npm installed
-  A local installation of [MongoDB](https://www.mongodb.com/try/download/community?tck=docs_server):

   > ### Note
   >
   > If you have brew, simply install MongoDB with : `$ brew install mongodb`

The MongoDB URI, CookieKey, and Port keys can be added to your environment variables or can be stored in a keys.js file in ./config
The expected environment variable names are:

-  MONGO_URI
-  COOKIE_KEY
-  PORT

   > ### Note
   >
   > If you're using a local install of MongoDB then you can set the MONGO_URI key to something like `MONGO_URI='mongodb://localhost/my_database'`. You do _NOT_ need a MongoDB account to use the local method.

### Getting Started

To get the frontend and backend run locally:

-  Clone this repo
-  `npm install` to install all back-end required dependencies
-  `cd client` to navigate to front-end directory
-  `npm install` to install all front-end required dependencies
-  `cd ..` to return back to the root directory
-  `npm run dev` to start the local server

The front-end will run on port 3000 to prevent conflicts with the backend Express server which runs on port 5000 (customizable using the PORT environment variable).

### Testing

To run the suite of unit tests found in the `/tests/` folder, simply navigate to the root directory of the project and run the command `npm run test`

❗ Currently only tests for Mongoose models are available. Testing for API routes is in progress.

## Accessing the database API

The application provides an API in order to easily access some of the information stored on the database. The following endpoints are currently implemented:

Authentication Routes:

-  POST /auth/register
-  POST /auth/login
-  GET /auth/logout
-  GET /auth/current_user

Image Routes:

-  POST /images/upload
-  GET /images/
-  GET /images/:id/download

## Contributing

1. Fork it (<https://github.com/ErykBrol/PicExchange/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

## Authors

-  **Eryk Brol** - _Project Developer_ - [ErykBrol](https://github.com/ErykBrol)
