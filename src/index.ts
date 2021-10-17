import { Readability } from '@mozilla/readability';
import * as JSDOM from 'jsdom'
import DOMPurify from 'isomorphic-dompurify';
import fetch from 'cross-fetch';
import * as fs from 'fs'

const main = () => {
  const url ='https://www.cincainews.com/news/tech-gadgets/2021/10/14/tm-stops-offering-public-ip-for-customers-on-unifi-100mbps-plan-and-below/2013227';
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

main()
