global.config = require('./config');
global.colors = require('colors');
global.moment = require('moment');
const { Telegraf } = require('telegraf');
global.bot = new Telegraf(global.config.token);

require('./functions/loadCommands')();
require('./functions/loadEvents')();

bot.start((ctx) => {
    ctx.reply(`Merhaba ${ctx.from.first_name}!`);
});

bot.launch().catch((err) => {
    console.log(colors.red(`${moment().format('HH:mm:ss DD.MM.YYYY')} - Bot Başlatılamadı!\n${err}`));
});