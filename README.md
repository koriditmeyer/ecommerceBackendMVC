<h3 align="center">
Welcome to the E-Commerce Express [BACKEND] project. 
</h3>

For the [FRONTEND] project go here: https://github.com/koriditmeyer/SPAapp


## 🌎 VIEW - Front end with React

- Amazon E-Commerce Clone: https://spaapp-4fdk.onrender.com

## 💻 Technologies Used
- Programming Language: 
![JavaScript](https://img.shields.io/badge/javascript-JavaScript-brightgreen?logo=javascript&logoColor=F7DF1E&label=%20&labelColor=black&color=F7DF1E)

- Container: 
![Docker](https://img.shields.io/badge/docker-docker-brightgreen?logo=docker&logoColor=2496ED&label=%20&labelColor=black&color=2496ED)

- Server: 
![Node JS](https://img.shields.io/badge/nodedotjs-Node_Js-brightgreen?logo=nodedotjs&logoColor=339933&label=%20&labelColor=black&color=339933)
![Express](https://img.shields.io/badge/express-Express-brightgreen?logo=express&logoColor=000000&label=%20&labelColor=white&color=000000)
![Multer](https://img.shields.io/badge/Multer-Multer-brightgreen?logo=Multer&logoColor=010101&label=%20&labelColor=010101&color=010101)
![express-session](https://img.shields.io/badge/expresssession-express_session-brightgreen?logo=Multer&logoColor=010101&label=%20&labelColor=010101&color=010101)
![connect-mongo](https://img.shields.io/badge/connectmongo-connect_mongo-brightgreen?logo=Multer&logoColor=010101&label=%20&labelColor=010101&color=010101)
![bcrypt](https://img.shields.io/badge/bcrypt-bcrypt-brightgreen?logo=Multer&logoColor=010101&label=%20&labelColor=010101&color=010101)
![Passport](https://img.shields.io/badge/passport-passport-brightgreen?logo=passport&logoColor=34E27A&label=%20&labelColor=010101&color=34E27A)
![Passport-Github](https://img.shields.io/badge/Passport_Github-Passport_Github-brightgreen?logo=Multer&logoColor=010101&label=%20&labelColor=010101&color=010101)
<!-- ![Socket.io](https://img.shields.io/badge/socketdotio-socket.io-brightgreen?logo=socketdotio&logoColor=010101&label=%20&labelColor=white&color=010101) -->


- Database: 
![MONGOBD ATLASS](https://img.shields.io/badge/mongodb-MongoBD_Atlas-brightgreen?logo=mongodb&logoColor=47A248&label=%20&labelColor=black&color=47A248)
![Mongoose](https://img.shields.io/badge/mongoose-Mongoose-brightgreen?logo=mongoose&logoColor=880000&label=%20&labelColor=black&color=880000)
![Mongoose Paginate](https://img.shields.io/badge/MongoosePaginate-Mongoose_Paginate_V2-brightgreen?logo=MongoosePaginate&logoColor=880000&label=%20&labelColor=880000&color=880000)

- External communication: 
![Node-Mailer](https://img.shields.io/badge/NodeMailer-NodeMailer-brightgreen?logo=Multer&logoColor=010101&label=%20&labelColor=010101&color=010101)
![Twilio](https://img.shields.io/badge/twilio-twilio-brightgreen?logo=passport&logoColor=F22F46&label=%20&labelColor=010101&color=F22F46)
![HTML to TExt](https://img.shields.io/badge/HTML_To_Text-HTML_To_Text-brightgreen?logo=Multer&logoColor=010101&label=%20&labelColor=010101&color=010101)

- Mailing Template: 
![Handlebars](https://img.shields.io/badge/handlebarsdotjs-Handlebars-brightgreen?logo=handlebarsdotjs&logoColor=000000&label=%20&labelColor=white&color=000000)

- Testing/ Error: 
![Faker](https://img.shields.io/badge/Faker-Faker-brightgreen?logo=Multer&logoColor=010101&label=%20&labelColor=010101&color=010101)
![Winston](https://img.shields.io/badge/Winston-Winston-brightgreen?logo=Winstonk&logoColor=010101&label=%20&labelColor=010101&color=010101)
![Artillery](https://img.shields.io/badge/Artillery-Artillery-brightgreen?logo=Artillery&logoColor=010101&label=%20&labelColor=010101&color=010101)
![Chai](https://img.shields.io/badge/chai-chai-brightgreen?logo=chai&logoColor=A30701&label=%20&labelColor=black&color=A30701)
![Mocha](https://img.shields.io/badge/mocha-mocha-brightgreen?logo=mocha&logoColor=8D6748&label=%20&labelColor=black&color=8D6748)
![Supertest](https://img.shields.io/badge/Supertest-Supertest-brightgreen?logo=Supertest&logoColor=010101&label=%20&labelColor=010101&color=010101)

- Documentation: 
![Swagger](https://img.shields.io/badge/Swagger-Swagger-brightgreen?logo=swagger&logoColor=85EA2D&label=%20&labelColor=black&color=85EA2D)

- version control system: 
![Git](https://img.shields.io/badge/git-Git-brightgreen?logo=git&logoColor=F05032&label=%20&labelColor=black&color=F05032)
![GitHub](https://img.shields.io/badge/github-GitHub-brightgreen?logo=github&logoColor=white&label=%20&labelColor=black&color=181717)

- Data Scraping: 
![Cheerio](https://img.shields.io/badge/cheerio-Cheerio-brightgreen?logo=cheerio&logoColor=E88C1F&label=%20&labelColor=black&color=E88C1F)
![puppeteer](https://img.shields.io/badge/puppeteer-Puppeteer-brightgreen?logo=puppeteer&logoColor=40B5A4&label=%20&labelColor=black&color=40B5A4)
![papaparse](https://img.shields.io/badge/papaparse-Papaparse-brightgreen?logo=papaparse&logoColor=40B5A4&label=%20&labelColor=black&color=black)

## 💼 Technical Elements

18/04/24 [V1.4]:
- [NEW] Add API documentation with Swagger 
- [NEW] Add integration test on one endpoint with Supertest, mocha and chai 
- [NEW] Add product owner to product schema
- [NEW] Add new premium user role and several benefits (can add product, if admin delete his products get email, if admin delete account get email notification)
- [NEW] Add new admin features (admin can delete users, products...)
- [NEW] Add checkout to the product flow that send a confirmation email
- [NEW] Scrapt Amazon product Data with cheerio, puppeteer and paparse. Database has more than +175 000 products

15/02/24 [V1.3]:
-  shift from console log to winston logger. Implement a dev and production logger 
- Add a new api to create a test error log at api/test/createFakeErrorLog
- Add artillery test flow for register+login scenario (6 of 200 timed out, median response time 1249ms)
- Implement Node clustering with 8 processors -> artillery test flow for register+login scenario (0 of 200 timed out, median response time 210ms)
- Containerizing the Node.js Web Application with Docker

06/02/24 [V1.2]:
- Add a new compression for products query using brotly. 
- Refactor error management
- Add a new api to get mock product data at at api/test/products

05/02/24 [V1.1]:
- Add the purchase cart route and corresponding services. 
- Add the ticket model and corresponding routes and services.
- Add a mailing services when finishing the purchase

31/01/24 [V1.0]:
- Transformation of the app to be able to be scalable with the use of design patterns and SOLID principles. Implementation of the Model, View, Controller (MVC):
    * Controller: Implementation in several layers:
        * Controller - Handles incoming requests and delegates business logic operations to the Services layer
        * Services - Contains the core business logic, ensuring controllers remain lean 
        * Repositories - It communicates with the Model to retrieve and store data without exposing the data source
        * Factory - allow to not have a coupling to specific implementations (ex mongoose)
        * Daos - Conversion of abstract data retrival from repositories to mongoose queries.
    * Model: useof MongoDB with mongoose. For the moment Mongoose also  facilitates schema definitions, data validation and directly interacting with MongoDB.
    * View: Done with React. (see project: https://github.com/koriditmeyer/SPAapp)

     Additional Layers Implemented:
     * Routing with express
     * Error models

- Add a .ENV file
- Begin to add some testing with the use of Faker

08/01/24 [V0.4]:
- Update endpoints to integrate a success handler and an error handler. 
- Update endpoints to use passport with JWT
- Update passport strategies to use JSON Web Token instead of sessions
- Update the client side HTML and JS to work with JWT

20/12/23 [V0.3]:
- Update router, middleware and schema structure to be compatible with passport
- Use Passport as session manager. Implement the local strategies to register and login
- Add passport-github v2 functionality. Add New passport strategy and new github login endpoint


18/12/23 [V0.2]:
- Add session management with cookies via express-session and connect-mongo.
- Create new endpoints on API and WEB for session management and users registration and profile
- Add password encryption using the bcrypt password-hashing function

14/12/23 [V0.1]:

- Migrate file storage from local to MONGODB ATLAS. Update the services to manage the MONGODB queries
- Use of Mongoose to update CART and PRODUCT classes for schemas
- Add new endpoints for the CART, and use of multer for products pictures upload
- Use of a pre midelware in the cart schema to populate the cart products data for FIND queries
- Use of paginate with mongoose-paginate-v2 and implement it inside of handlebars

15/11/23:

- Use of Handlebars with Express
- Use of websockets with Socket.io

8/11/23:
- Use of middlewares with Express
- Use of router with Express
- Add of new api endpoints and static enpoints
- Add of file upload api in Express with Multer

31/10/23
- Server with Express that in the app.js use the ProductManager class previously created
- Creation of REST API with get petition and with URL params and URL params queries

30/10/23
- Asynchronous File System Manager with promises

19/10/23
- ECMAScript and avanced ECMAScript





