import dotenv from 'dotenv'
import koa from 'koa'
import logger from 'koa-logger'
import json from 'koa-json'
import bodyParser from 'koa-bodyparser'
import router from '@koa/router'
import articleHandler from 'handlers/article-handler'
import { Article } from 'models/article'

dotenv.config();

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
r.get('/api/article', protect, articleHandler.list)
r.get('/api/article/:id', protect, articleHandler.get)
r.post('/api/article', protect, articleHandler.post)

app.use(json());
app.use(bodyParser());
app.use(logger());
app.use(r.routes()).use(r.allowedMethods());


Article.sync({ alter: true }).then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
  });
})
  .catch((err) => {
    console.error(err);
});
