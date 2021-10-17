import { Readability } from '@mozilla/readability';
import * as JSDOM from 'jsdom'

const main = () => {
  const doc = new JSDOM.JSDOM("<body>Look at this cat: <img src='./cat.jpg'></body>", {
    url: "https://www.example.com/the-page-i-got-the-source-from"
  });
  const reader = new Readability(doc.window.document);
  const article = reader.parse();
  console.log(article);
}

main()
