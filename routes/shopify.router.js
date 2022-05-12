import { ShopifyWebhook } from './../controller/shopify.js';
let shopify = new ShopifyWebhook();

export default function shopifyRoutes(app) {
  app.post('/shopify', (req, res) => shopify.getMessage(req, res));

  app.get('/shopify', (req, res) => shopify.getMessage(req, res));

  app.get('/success', function (req, res) {
    res.json(req.session.shopify);
  });

  app.get('/fail', function (req, res) {
    res.send('Authentication failed');
  });

  app.get('/login', (req, res) => shopify.login(req, res));

  app.get('/auth/callback', (req, res) => shopify.authCallback(req, res));
}
