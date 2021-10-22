import dotenv from "dotenv";
import koa from "koa";
import logger from "koa-logger";
import json from "koa-json";
import bodyParser from "koa-bodyparser";
import router from "@koa/router";
import cors from "@koa/cors";
import articleHandler from "handlers/article-handler";
import { Article } from "models/article";
import compose from "koa-compose";

import admin from "firebase-admin";
import { getAuth } from 'firebase-admin/auth';
import credentials from "./service-info.json";
import HttpUtils from "utils/http";

admin.initializeApp({
  credential: admin.credential.cert({
    clientEmail: credentials.client_email,
    privateKey: credentials.private_key,
    projectId: credentials.project_id,
  }),
});

dotenv.config();

const app = new koa();
const r = new router();

const _keys = process.env.ALLOWED_KEYS?.split(",") ?? [];

const keyAuth: koa.Middleware<koa.DefaultState, koa.DefaultContext> = async (
  ctx,
  next,
) => {
  const { key } = ctx.query;
  if (!key) {
    ctx.throw(403, "Api key needed");
  }
  if (!_keys.find((k) => k === key)) {
    ctx.throw(403, "Unauthorized");
  }
  await next();
};

const firebaseAuth: koa.Middleware<koa.DefaultState, koa.DefaultContext> =
  async (ctx, next) => {
    const { authorization } = ctx.headers;
    if (!authorization) {
      return ctx.throw(403, 'missing authorization header');
    }

    const [err, token] = HttpUtils.parseBearerToken(authorization);
    if (err) {
      return ctx.throw(400, err.message);
    }

    try {
      const user = await getAuth().verifyIdToken(token);
      ctx.state.uid = user.uid;
    } catch (err) {
      console.error(err);
      return ctx.throw(403, 'unauthorized');
    }
    await next();
  };

const protect = compose([keyAuth, firebaseAuth]);

r.get("/", async (ctx, next) => {
  ctx.body = { msg: "hello world!" };
  await next();
});
r.get("/api/article", protect, articleHandler.list);
r.get("/api/article/:id", protect, articleHandler.get);
r.post("/api/article", protect, articleHandler.post);

app.use(cors());
app.use(json());
app.use(bodyParser());
app.use(logger());
app.use(r.routes()).use(r.allowedMethods());

Article.sync({ alter: true })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`listening on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
