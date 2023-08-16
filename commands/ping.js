module.exports = {
    name: 'ping',
    description: 'Pong!',
    cooldown: 5,
    run: async (bot, ctx, values) => {
        await ctx.reply('Pong!');
    }
};