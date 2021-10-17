import { Readability } from '@mozilla/readability';
import * as JSDOM from 'jsdom'
import DOMPurify from 'isomorphic-dompurify';
import fetch from 'cross-fetch';
import * as fs from 'fs'

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

const run = () => {
  return;
}

run()
