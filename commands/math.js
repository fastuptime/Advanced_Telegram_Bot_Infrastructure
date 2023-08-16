module.exports = {
    name: 'math',
    description: 'Math command',
    cooldown: 50,
    options: [
        {
            name: 'operation',
            error: 'Please provide a valid operation', // Optional
            type: 5, // 1 => Integer, 2 => String, 3 => Boolean, 4 => Tag a user @user, 5 => Choices,
            choices: [
                {
                    value: 'addition'
                },
                {
                    value: 'subtraction'
                },
                {
                    value: 'multiplication'
                },
                {
                    value: 'division'
                }
            ],
            required: true,
        },
        {
            name: 'number1',
            error: 'Please provide a valid number', // Optional
            type: 1, // 1 => Integer, 2 => String, 3 => Boolean, 4 => Tag a user @user, 5 => Choices,
            required: true,
        },
        {
            name: 'number2',
            error: 'Please provide a valid number', // Optional
            type: 1, // 1 => Integer, 2 => String, 3 => Boolean, 4 => Tag a user @user, 5 => Choices,
            required: true,
        },
    ],
    run: async (bot, ctx, values) => {
        const { operation, number1, number2 } = values.reduce((a, b) => ({ ...a, [b.name]: b.value }), {});
        let result;
        switch (operation) {
            case 'addition':
                result = number1 + number2;
                break;
            case 'subtraction':
                result = number1 - number2;
                break;
            case 'multiplication':
                result = number1 * number2;
                break;
            case 'division':
                result = number1 / number2;
                break;
        }
        ctx.reply(`Result: ${result}`);
    }
};