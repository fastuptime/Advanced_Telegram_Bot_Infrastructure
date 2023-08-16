module.exports = function () {
    bot.use(async (ctx, next) => {
        console.log(colors.green(`[#] ${moment().format('YYYY-MM-DD HH:mm:ss')}`) + colors.yellow(` > Event: ${ctx.updateType} Member: ${ctx.from.first_name} ${ctx.from.last_name} (${ctx.from.username}) | Message: ${ctx.message.text}` + (ctx.message.reply_to_message ? ` | Reply: ${ctx.message.reply_to_message.text}` : '')));
        await next();
    });
};