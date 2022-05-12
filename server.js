import {} from 'dotenv/config';

import { ApiVersion, DataType, Shopify } from '@shopify/shopify-api';

import ShopifyAuth from "express-shopify-auth";
import appRouter from './routes/routes.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import  session from "express-session";

const app = express();

const { SHOPIFY_API_KEY, SHOPIFY_SECRET, SCOPES, HOST} = process.env
const SHARED_SECRET = '7749c21c1b177ec54402ca6bce26e02239a9d99a58310615c3f6556707f8b8ad';


Shopify.Context.initialize({
  API_KEY: SHOPIFY_API_KEY,
  API_SECRET_KEY: SHOPIFY_SECRET,
  SCOPES: [SCOPES],
  HOST_NAME: HOST.replace(/https:\/\//, ""),
  IS_EMBEDDED_APP: true,
  API_VERSION: ApiVersion.April22 // all supported versions are available, as well as "unstable" and "unversioned"
});

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
// const ACTIVE_SHOPIFY_SHOPS: { [key: string]: string | undefined } = {};

// const auth = ShopifyAuth.create({
//   appKey: SHOPIFY_API_KEY,
//   appSecret: SHOPIFY_SECRET,
//   baseUrl: 'https://9f57-43-242-229-86.in.ngrok.io',
//   authPath: '/auth',
//   authCallbackPath: '/auth/callback',
//   authSuccessUrl: '/success',
//   authFailUrl: '/fail',
//   scope: [SCOPES],
//   shop: function (req, done) {
//     return done(null, req.query.shop);
//   },
//   onAuth: function (req, res, shop, accessToken, done) {
//     // save auth info to session
//     req.session.shopify = { shop: shop, accessToken: accessToken };
//     return done();
//   }
// });

// app.use(session({
//   secret: '7749c21c1b177ec54402ca6bce26e02239a9d99a58310615c3f6556707f8b8ad',
//   resave: false,
//   saveUninitialized: true
// }));

// app.use(auth);

app.use(cors());

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.all('/*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Cache-Control,Pragma, Origin, Authorization, Content-Type, X-Requested-With,X-XSRF-TOKEN, query,x-access-token'
  );
  next();
});

appRouter(app);

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('listening server http://localhost:%s', server.address().port);
});
