import {} from 'dotenv/config';

import { ApiVersion, DataType, Shopify } from '@shopify/shopify-api';

import {Product} from '@shopify/shopify-api/dist/rest-resources/2022-04/index.js';
// import axios from 'axios';
// import fs from 'fs';
import mantiumAi from '@mantium/mantiumapi';
import request from 'request';

// import querystring from 'querystring';
// import request from 'request';

// import {Product} from '@shopify/shopify-api/dist/rest-resources/2022-04/index.js';

const prompt_id = process.env.MANTIUM_PROMPT_ID;
const credentials = {
  username: process.env.MANTIUM_USER_NAME,
  password: process.env.MANTIUM_PASSWORD,
};

// const SHARED_SECRET = '7749c21c1b177ec54402ca6bce26e02239a9d99a58310615c3f6556707f8b8ad';


export class ShopifyWebhook {
  /****************************************************************************************************
   Constructor
  *******************************************************************************************************/
  constructor() {
    if (this.apiKey === null) {
      this.getToken();
    }
  }

  async getToken() {
    await mantiumAi
      .Auth()
      .accessTokenLogin({ ...credentials })
      .then((response) => {
        // get bearer_id and set as a api_key
        if (response.data?.attributes) {
          mantiumAi.api_key = response.data.attributes.bearer_id;
          this.apiKey = response.data.attributes.bearer_id;
        } else {
          console.log('Login failed!');
        }
      });


      // Shopify.Context.initialize({
      //   API_KEY: process.env.SHOPIFY_API_KEY,
      //   API_SECRET_KEY: process.env.SHOPIFY_SECRET,
      //   SCOPES: [process.env.SHOPIFY_APP_SCOPES], //https://shopify.dev/api/usage/access-scopes
      //   HOST_NAME: process.env.SHOPIFY_APP_URL.replace(/^https:\/\//, ''),
      //   IS_EMBEDDED_APP: true,
      //   API_VERSION: ApiVersion.April22,
      //   SESSION_STORAGE: new Shopify.Session.MemorySessionStorage()
      // });
  }

  async getAnswer(prompt_info) {
    return await mantiumAi
      .Prompts('OpenAI')
      .execute({
        id: prompt_id,
        input: prompt_info,
      })
      .then(async (res) => {
        /*
         * from the successful response collect the prompt_execution_id
         * and then pass this to the result method
         */
        if (res?.prompt_execution_id) {
          return await mantiumAi
            .Prompts('OpenAI')
            .result(res.prompt_execution_id)
            .then((response) => {
              return response;
            });
        }
      });
  }

  apiKey = null;


  async login(req, res) {
    let authRoute = await Shopify.Auth.beginAuth(
      req,
      res,
      process.env.SHOPIFY_APP_URL,
      '/auth/callback',
      false,
    );
    return res.redirect(authRoute);
  }

  async authCallback(req, res) {
    try {
      const session = await Shopify.Auth.validateAuthCallback(
        req,
        res,
        req.query,
      );

      console.log('session stored ::', session)
      // I've got the session but how do I store in SESSION_STORAGE and then access it?

    } catch (error) {
      console.error(error);
      req.res(401).json(error)
    }
    // wherever you want your user to end up after OAuth completes
    return res.redirect(`/?host=${req.query.host}&shop=${req.query.shop}`);
  }


  async getMessage(req, res) {
    // const request.body.rewind;
    var data = req.body.read;


    console.log('req.body', req.body);

    const { title, body_html, tags, vendor, product_id } = req.body;

    const keywords = tags && tags.length ? tags : 'durable, value to money';

    const prompt_input = `Product: ${title} Keywords:   ${keywords}`;

    // let response = await this.getAnswer(prompt_input);


    const { API_KEY, API_SECRET_KEY, SCOPES, SHOP, HOST, SHOPIFY_ADMIN_API_ACCESS_TOKEN } = process.env;


    // /admin/api/2022-04/products/632910392.json



    const body = {
      "product": {
        "title": "Burton Custom Freestyle 151",
        "body_html": "<strong>Weldone Kedar Kulkarni!</strong>"
      }
    }

    const options = {
      url: `https://${SHOP}.myshopify.com/admin/api/2022-04/products/6891518296200.json`,
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_ACCESS_TOKEN},
      body: JSON.stringify(body)
    }

    console.log('body ::',body)
    console.log('options ::',options)
try {

  request.put(options, function(error, response, body){
    // console.log('error', error)
    // console.log('response', response)
    console.log(body);
  });

} catch (err) {
  console.log('err')
}





    // const client = new Clients.Rest(
    //   "mtman.myshopify.com",
    //   "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"
    // );



    //initialize the library

    // const client = new Shopify.Clients.Rest(process.env.SHOPIFY_APP_URL, process.env.API_KEY);

    // console.log('client', client);

    // Shopify.Context.initialize({
    //   API_KEY,
    //   API_SECRET_KEY,
    //   SCOPES: [SCOPES],
    //   HOST_NAME: HOST.replace(/https:\/\//, ""),
    //   IS_EMBEDDED_APP: true,
    //   API_VERSION: ApiVersion.April22 // all supported versions are available, as well as "unstable" and "unversioned"
    // });


/*

    // Load the current session to get the `accessToken`.
    const session = await Shopify.Utils.loadCurrentSession(req, res);



    const client = new Shopify.Clients.Rest(
      session.shop,
      session.accessToken
    );

    // Build your post request body.
    const body = {
      product: {
        title: "Hiking backpack"
      }
    };

    // Use `client.post` to send your request to the specified Shopify REST API endpoint.
    await client.post({
      path: 'products',
      data: body,
      type: DataType.JSON,
    });

    console.log('session :::', session)
    console.log('response :::', response)
*/
/*
    const body = {
      product: {
        title: "Hiking backpack"
      }
    };
    // `session` is built as part of the OAuth process
    const client = new Shopify.Clients.Rest(
      session.shop,
      session.accessToken
    );
    await client.post({
      path: 'products',
      data: body,
      type: DataType.JSON,
    });
*/









    // console.log('response', response);

    // const test_session = await Shopify.Utils.loadCurrentSession(req, res);
    // const product = new Product({session: test_session});
    // product.id = 6875797553288;
    // product.body_html = response.output;
    // await product.save({});

    // return res.status(200).send('Webhook successfully received.');
    res.status(200).send('OK');
    // console.log('res.body', res.body);
    // console.log('data', data);
  }
}
