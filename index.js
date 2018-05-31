const logger = require('./logger');
const axios = require('axios');
const cheerio = require('cheerio');

const IFTTT_WEBHOOK_URL = 'https://maker.ifttt.com/trigger';
const IFTTT_WEBHOOK_KEY = 'bxli8waXgE-Qp3-jQAe1bg';
const SUPOST_CATEGORY = 'Housing';
const SUPOST_URL = 'http://supost.com/search/cat/3';

const listings = {};

const sendAlert = async (data) => {
  await axios.post(`${IFTTT_WEBHOOK_URL}/new_post/with/key/${IFTTT_WEBHOOK_KEY}`, {
    value1: SUPOST_CATEGORY,
    value2: data.title,
    value3: data.link,
  });
};

const fetchListings = async (notify) => {
  let res = await axios.get(SUPOST_URL);
  const $ = cheerio.load(res.data);
  $('.one-result').each((i, elem) => {
    let node = $(elem).children('a');
    let link = 'http://supost.com' + node.attr('href');
    let title = node.text();
    if (!listings[link]) {
      if (notify) {
        sendAlert({
          title: title,
          link: link,
        });
      }
      listings[link] = title;
      logger.info(`${title} : ${link}`);
    }
  });
};

(async () => {
  await fetchListings(false);
  setInterval(fetchListings.bind(this, true), 1000 * 10);
})();
