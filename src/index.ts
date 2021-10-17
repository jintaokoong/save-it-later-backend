import { Readability } from '@mozilla/readability';
import * as JSDOM from 'jsdom'
import fetch from 'cross-fetch';
import * as fs from 'fs'

const main = () => {
  const url ='https://www.cincainews.com/news/tech-gadgets/2021/10/14/tm-stops-offering-public-ip-for-customers-on-unifi-100mbps-plan-and-below/2013227';
  fetch(url)
    .then(res => res.text())
    .then(t => {
    const doc = new JSDOM.JSDOM(t, {
      url: url
    });
    const reader = new Readability(doc.window.document);
    const article = reader.parse();
    if (article) {
      fs.writeFile('content.html', article.content, (err) => {
        console.error(err);
      });
    }
  })

}

main()
