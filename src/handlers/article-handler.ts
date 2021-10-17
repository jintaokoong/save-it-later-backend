import koa from 'koa'

const get: koa.Middleware = async (ctx, next) => {
  ctx.body = { msg: `test route ${ctx.params['id']}` }
  await next();
}

const post: koa.Middleware = async (ctx, next) => {
  ctx.status = 200;
  console.log(ctx.request.body);
  await next();
}

const articleHandler = {
  post,
  get,
}

export default articleHandler;
