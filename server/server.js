import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';
import passport from 'passport';

// import router
import MgUserRouter from '../app/mongo/routes/MgUserRouter';
import AuthRouter from '../app/authentication/routes/AuthRouter';

// import & configure logger
import { AppLogger } from '../core';
import morgan from 'morgan';

AppLogger.stream = {
    write: function (message, encoding) {
        AppLogger.info(message, encoding);
    },
};

import MongoDBConnect from '../app/mongo/db/db/MongoDBConnect';

if (process.env.MONGOOSE_ENABLED === 'true') {
    AppLogger.debug('server MONGOOSE_ENABLED');
    new MongoDBConnect();
}

// Create an express instance
const app = express();

app.use(cookieParser());

app.use('*', cors());
app.use(morgan('dev', { stream: AppLogger.stream }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// init and configure passport
app.use(passport.initialize());

// authentication routes
app.use(process.env.AUTH_BASE_PATH, AuthRouter);

// app routes
if (process.env.MONGOOSE_ENABLED === 'true') {
    // mongo routes
    AppLogger.debug('server MONGOOSE_ENABLED');
    app.use(process.env.MONGO_USER_BASE_PATH, MgUserRouter);
}

// others routes
app.get('/', (req, res) => {
    res.send('Invalid endpoint!');
});


// Start server
const portNumber = process.env.SERVER_APP_PORT || 3300;
AppLogger.debug('AppRouter portNumber : ' + portNumber);
app.listen(portNumber, () => {
    AppLogger.debug('server started - ' + portNumber);
});
