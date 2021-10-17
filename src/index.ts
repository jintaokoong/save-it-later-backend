import dotenv from 'dotenv';
dotenv.config();

import { Readability } from '@mozilla/readability';
import * as JSDOM from 'jsdom'
import DOMPurify from 'isomorphic-dompurify';
import fetch from 'cross-fetch';
import * as fs from 'fs';
import koa from 'koa';
import logger from 'koa-logger';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser'
import router from '@koa/router';

const app = new koa();
const r = new router();

const _keys = process.env.ALLOWED_KEYS?.split(',') ?? [];

const protect: koa.Middleware<koa.DefaultState, koa.DefaultContext> = async (ctx, next) => {
  const { key } = ctx.query;
  if (!key) {
    ctx.throw(403, 'Api key needed');
  }
  if (!_keys.find(k => k === key)) {
    ctx.throw(403, 'Unauthorized');
  }
  await next();
}

r.get('/', async (ctx, next) => {
  ctx.body = { msg: 'hello world!' };
  await next();
})
r.get('/article/:id', protect, async (ctx, next) => {
  ctx.body = { msg: `test route ${ctx.params['id']}` }
  await next();
})
r.post('/article', protect, async (ctx, next) => {
  ctx.status = 200;
  console.log(ctx.request.body);
  await next();
})

app.use(json());
app.use(bodyParser());
app.use(logger());
app.use(r.routes()).use(r.allowedMethods());

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});

const main = () => {
  const url ='https://levelup.gitconnected.com/how-to-properly-set-up-express-with-typescript-1b52570677c9';
  fetch(url)
    .then(res => res.text())
    .then(t => {
    const purified = DOMPurify.sanitize(t);
    const doc = new JSDOM.JSDOM(purified, {
      url: url
    });
    const reader = new Readability(doc.window.document);
    const article = reader.parse();
    if (article) {
      fs.writeFile('out/content.html', article.content, (err) => {
        err && console.error(err);
      });
    }
  })
}
