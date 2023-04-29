const cheerio = require('cheerio');
const Discord = require('discord.js');

const client = new Discord.Client();
const channelID = 'CHANNEL_ID_HERE'; // Replace with the ID of the channel you want to send the messages to
const webhookID = 'WEBHOOK_ID_HERE'; // Replace with the ID of your webhook
const webhookToken = 'WEBHOOK_TOKEN_HERE'; // Replace with your webhook token

// Store previously sent article titles
let sentTitles = [];

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  
  // Scrape news titles and send them to Discord channel every minute
  setInterval(() => {
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

        // Create message with sorted news titles
        let message = '';
        articles.forEach(article => {
          if (!sentTitles.includes(article.title)) { // Check if title has already been sent
            message += `${article.title}\n`;
            sentTitles.push(article.title); // Add title to list of sent titles
          }
        });

        // Send message to Discord channel using webhook
        if (message.length > 0) { // Check if there are new articles to send
          const webhookClient = new Discord.WebhookClient(webhookID, webhookToken);
          webhookClient.send(message, {
            username: 'Anime News Bot',
            avatarURL: 'https://i.imgur.com/yW8jMwB.png'
          });

          // Send a DM to a specific user to notify them of the new articles
          const user = client.users.cache.get('USER_ID_HERE'); // Replace with the ID of the user you want to notify
          user.send(`New articles:\n${message}`);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, 60000); // Send messages every minute
});

client.login('BOT_TOKEN_HERE'); // Replace with your Discord bot token```
