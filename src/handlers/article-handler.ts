import koa from 'koa'
import fetch from 'cross-fetch'
import DOMPurify from 'isomorphic-dompurify'
import * as JSDOM from 'jsdom'
import { Readability } from '@mozilla/readability'
import { Article } from 'models/article'

const list: koa.Middleware = async (ctx, next) => {
  ctx.body = await Article.findAll({
    attributes: { exclude: ['content'] },
    where: { createdBy: ctx.state.uid },
  })
  await next()
}

const get: koa.Middleware = async (ctx, next) => {
  const { id } = ctx.params
  const article = await Article.findByPk(id)
  if (!article || article.getDataValue('createdBy') !== ctx.state.uid) {
    ctx.status = 404
    ctx.body = {
      message: 'article not found',
    }
    return await next()
  }
  ctx.status = 200
  ctx.body = article
  await next()
}

const post: koa.Middleware = async (ctx, next) => {
  ctx.status = 200
  const { url } = ctx.request.body
  if (!url) {
    ctx.status = 400
    ctx.body = {
      message: 'url is required',
    }
    return await next()
  }

  try {
    const res = await fetch(url)
    const text = await res.text()
    const purified = DOMPurify.sanitize(text)
    const doc = new JSDOM.JSDOM(purified, {
      url: url,
    })
    const reader = new Readability(doc.window.document)
    const article = reader.parse()
    const result = await Article.create({
      title: article?.excerpt,
      url: url,
      content: article?.content,
      textContent: article?.textContent,
      createdBy: ctx.state.uid,
    })
    ctx.status = 200
    ctx.body = {
      id: result.getDataValue('id'),
      url: result.getDataValue('url'),
      title: result.getDataValue('title'),
      textContent: result.getDataValue('textContent'),
      createdBy: result.getDataValue('createdBy'),
    }
  } catch (err) {
    console.error(err)
    ctx.status = 500
    ctx.body = {
      message: 'error caching content',
    }
  }
  await next()
}

const articleHandler = {
  post,
  list,
  get,
}

export default articleHandler
