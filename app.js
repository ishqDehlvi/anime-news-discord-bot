const axios = require('axios');
const cheerio = require('cheerio');

axios.get('https://www.animenewsnetwork.com/')
  .then(response => {
    const $ = cheerio.load(response.data);
    const articles = [];

    $('.wrap').each((index, element) => {
      const title = $(element).find('h3 > a').text().trim();
      const time = $(element).find('.byline > time').attr('datetime');
      articles.push({ title, time });
    });

    // Sort articles by time in descending order
    articles.sort((a, b) => new Date(b.time) - new Date(a.time));

    console.log(articles);
  })
  .catch(error => {
    console.log(error);
  });
