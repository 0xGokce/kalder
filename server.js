const next = require('next')

// import 'isomorphic-fetch';

import Koa from 'koa';
import Router from "koa-router";
import createShopifyAuth, {verifyRequest} from '@shopify/koa-shopify-auth';
import Shopify, {ApiVersion} from '@shopify/shopify-api';

// Loads the .env file into process.env. This is usually done using actual environment variables in production
import dotenv from "dotenv";
dotenv.config();

const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== 'production'
const app = next({dev}) // next server passing in the dev middleare
const handle = app.getRequestHandler()


// initializes the library
Shopify.Context.initialize({
    API_KEY: process.env.SHOPIFY_API_KEY,
    API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
    SCOPES: process.env.SHOPIFY_APP_SCOPES,
    HOST_NAME: process.env.SHOPIFY_APP_URL.replace(/^https:\/\//, ''),
    API_VERSION: ApiVersion.October20,
    IS_EMBEDDED_APP: true,
    // More information at https://github.com/Shopify/shopify-node-api/blob/main/docs/issues.md#notes-on-session-handling
    SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
  });

  // Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPIFY_SHOPS = {};

// app.keys = [Shopify.Context.API_SECRET_KEY];

app.prepare().then(() => {
    const server = new Koa()
    server.keys = [Shopify.Context.API_SECRET_KEY];
    const router = new Router()
  
    router.all('(.*)', async (ctx) => {
      await handle(ctx.req, ctx.res)
      ctx.respond = false
    })
  
    server.use(async (ctx, next) => {
      ctx.res.statusCode = 200
      await next()
    })
  
    server.use(router.routes())
    server.listen(port, () => {
      console.log(`> Ready on http://localhost:${port}`)
    })

    app.use(
        createShopifyAuth({
          async afterAuth(ctx) {
            const { shop, accessToken, scope} = ctx.state.shopify;
            const host = ctx.query.host;
            ACTIVE_SHOPIFY_SHOPS[shop] = scope;
      
            // Your app should handle the APP_UNINSTALLED webhook to make sure merchants go through OAuth if they reinstall it
            const response = await Shopify.Webhooks.Registry.register({
              shop,
              accessToken,
              path: "/webhooks",
              topic: "APP_UNINSTALLED",
              webhookHandler: async (topic, shop, body) => delete ACTIVE_SHOPIFY_SHOPS[shop],
            });
      
            if (!response.success) {
              console.log(
                `Failed to register APP_UNINSTALLED webhook: ${response.result}`
              );
            }
      
            // Redirect to app with shop parameter upon auth
            ctx.redirect(`/?shop=${shop}`);
          },
        }),
      );

      router.post("/webhooks", async (ctx) => {
        try {
          await Shopify.Webhooks.Registry.process(ctx.req, ctx.res);
          console.log(`Webhook processed, returned status code 200`);
        } catch (error) {
          console.log(`Failed to process webhook: ${error}`);
        }
      });

      // Everything else must have sessions
    router.get("(.*)", verifyRequest(), async (ctx) => {
    // Your application code goes here
    });

    app.use(router.allowedMethods());
    app.use(router.routes());
    app.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
    });

});



// const router = new Router();

// Sets up shopify auth
// app.use(
//   shopifyAuth({
//     async afterAuth(ctx) {
//       const { shop, accessToken } = ctx.state.shopify;
//       ACTIVE_SHOPIFY_SHOPS[shop] = true;

//       // Your app should handle the APP_UNINSTALLED webhook to make sure merchants go through OAuth if they reinstall it
//       const response = await Shopify.Webhooks.Registry.register({
//         shop,
//         accessToken,
//         path: "/webhooks",
//         topic: "APP_UNINSTALLED",
//         webhookHandler: async (topic, shop, body) => delete ACTIVE_SHOPIFY_SHOPS[shop],
//       });

//       if (!response.success) {
//         console.log(
//           `Failed to register APP_UNINSTALLED webhook: ${response.result}`
//         );
//       }

//       // Redirect to app with shop parameter upon auth
//       ctx.redirect(`/?shop=${shop}`);
//     },
//   }),
// );


// IRRELEVANT FOR US; STANDALONE APP 

// router.get("/", async (ctx) => {
//   const shop = ctx.query.shop;

//   // If this shop hasn't been seen yet, go through OAuth to create a session
//   if (ACTIVE_SHOPIFY_SHOPS[shop] === undefined) {
//     ctx.redirect(`/auth?shop=${shop}`);
//   } else {
//     // Load app skeleton. Don't include sensitive information here!
//     ctx.body = '🎉';
//   }
// });




