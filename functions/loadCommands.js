
const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);
const localdb = require("croxydb");
module.exports = function (client, ops) {
    let commands = [];
    globPromise(`${__dirname}/../commands/**/*.js`).then((files) => {
        files.forEach((f) => {
            const props = require(f);
            
            let same = commands.filter((c) => c.command == props.name);
            if (same.length > 0) return console.log(colors.red(`[!] ${moment().format(("YYYY-MM-DD HH:mm:ss"))}`) + colors.yellow(` > ${props.name} komutunun ismi başka bir komutla aynı.`));

            commands.push({
                command: props.name,
                description: props.description,
            });

            console.log(colors.green(`[+] ${moment().format(("YYYY-MM-DD HH:mm:ss"))}`) + colors.yellow(` > Yüklenen komut: ${props.name}`));

            bot.command(props.name, (ctx) => {
                
                if (props.cooldown) {
                    if (localdb.has(`cooldown.${ctx.from.id}.${props.name}`)) {
                        let cooldown = localdb.fetch(`cooldown.${ctx.from.id}.${props.name}`);
                        if (cooldown > Date.now()) {
                            let time = cooldown - Date.now();
                            let seconds = Math.floor(time / 1000);
                            let minutes = Math.floor(seconds / 60);
                            let hours = Math.floor(minutes / 60);
                            let days = Math.floor(hours / 24);

                            // let timeLeft = [];
                            // if (days) timeLeft.push(`${days} gün`);
                            // if (hours) timeLeft.push(`${hours % 24} saat`);
                            // if (minutes) timeLeft.push(`${minutes % 60} dakika`);
                            // if (seconds) timeLeft.push(`${seconds % 60} saniye`);

                            // ? Arada boşluk olmamasını istiyorsanız üsteki kodu kullanabilirsiniz.

                            return ctx.reply(`Bu komutu kullanmak için ${days ? `${days} gün,` : ""} ${hours ? `${hours % 24} saat,` : ""} ${minutes ? `${minutes % 60} dakika,` : ""} ${seconds % 60} saniye beklemelisiniz.`);
                        } else {
                            localdb.set(`cooldown.${ctx.from.id}.${props.name}`, Date.now() + props.cooldown * 1000);
                        }
                    } else {
                        localdb.set(`cooldown.${ctx.from.id}.${props.name}`, Date.now() + props.cooldown * 1000);
                    }
                }


                console.log(colors.green(`[+] ${moment().format(("YYYY-MM-DD HH:mm:ss"))}`) + colors.yellow(` > Kullanılan komut: ${props.name}`) + colors.red(` > Kullanıcı: ${ctx.from.username} (${ctx.from.id})`))

                let values = [];
                let err = false;
                let parsedParams = []
                let args = ctx.message.text.split(" ");
                let params = args.slice(1);

                for (const param of params) {
                    const [name, value] = param.split(":");
                    parsedParams.push({ name: name.toLowerCase(), value: value });
                }

                if (props.options) {
                    props.options.forEach((option) => {
                        if (err) return;
                        let Dname = parsedParams.find((p) => p.name == option.name.toLowerCase());
                        if (option.required) {
                            if (option.type == 1) {
                                if (Dname) {
                                    values.push({ name: Dname.name, value: Number(Dname.value) });
                                } else return ctx.reply(option.error) && (err = true);
                            } else if (option.type == 2) {
                                if (Dname) {
                                    values.push(Dname);
                                } else return ctx.reply(option.error) && (err = true);
                            } else if (option.type == 3) {
                                if (Dname) {
                                    if (Dname.value.toLowerCase() == "true" || Dname.value.toLowerCase() == "false") {
                                        values.push({ name: Dname.name, value: Dname.value.toLowerCase() == "true" ? true : false });
                                    } else return ctx.reply(option.error) && (err = true);
                                } else return ctx.reply(option.error) && (err = true);
                            } else if (option.type == 4) {
                                if (Dname) {
                                    // User bilgilerini çekme işlemi yapılmadı kendiniz geliştirebilirsiniz. Power By FastUptime
                                    values.push(Dname);
                                } else return ctx.reply(option.error) && (err = true);
                            } else if (option.type == 5) {
                                if (Dname) {
                                    let choice = option.choices.find((c) => c.value.toLowerCase() == Dname.value.toLowerCase());
                                    if (choice) {
                                        values.push(Dname);
                                    } else return ctx.reply(option.error) && (err = true);
                                } else return ctx.reply(option.error) && (err = true);
                            }
                        } else {
                            if (option.type == 1) {
                                if (Dname) {
                                    values.push(Dname);
                                } else values.push(null);
                            } else if (option.type == 2) {
                                if (Dname) {
                                    values.push(Dname);
                                } else values.push(null);
                            } else if (option.type == 3) {
                                if (Dname) {
                                    values.push(Dname);
                                } else values.push(null);
                            } else if (option.type == 4) {
                                if (Dname) {
                                    values.push(Dname);
                                } else values.push(null);
                            } else if (option.type == 5) {
                                if (Dname) {
                                    values.push(Dname);
                                } else values.push(null);
                            }
                        }
                    });
                }

                if (err) return;
                props.run(bot, ctx, values);
            });

            if (props.options) {
                props.options.forEach((option) => {
                    if (option.name.match(/[A-Z]/g)) {
                        console.log(colors.red(`[!] ${moment().format(("YYYY-MM-DD HH:mm:ss"))}`) + colors.yellow(` > ${props.name} komutunun ${option.name} seçeneğinin ismi büyük harf içeremez.`));
                        return;
                    }

                    if (option.type < 1 || option.type > 5) {
                        console.log(colors.red(`[!] ${moment().format(("YYYY-MM-DD HH:mm:ss"))}`) + colors.yellow(` > ${props.name} komutunun ${option.name} seçeneğinin tipi geçerli değil. (1-5)`));
                        return;
                    }

                    let same = props.options.filter((o) => o.name == option.name);
                    if (same.length > 1) {
                        console.log(colors.red(`[!] ${moment().format(("YYYY-MM-DD HH:mm:ss"))}`) + colors.yellow(` > ${props.name} komutunun ${option.name} seçeneğinin ismi başka bir seçenekle aynı.`));
                        return;
                    }

                    if (option.choices) {
                        option.choices.forEach((choice) => {
                            let same = option.choices.filter((c) => c.value == choice.value);
                            if (same.length > 1) {
                                console.log(colors.red(`[!] ${moment().format(("YYYY-MM-DD HH:mm:ss"))}`) + colors.yellow(` > ${props.name} komutunun ${option.name} seçeneğinin ${choice.name} seçeneğinin değeri başka bir seçenekle aynı.`));
                                return;
                            }

                            if (!choice.value || choice.value == "" || choice.value.match(/[A-Z]/g)) {
                                console.log(colors.red(`[!] ${moment().format(("YYYY-MM-DD HH:mm:ss"))}`) + colors.yellow(` > ${props.name} komutunun ${option.name} seçeneğinin ${choice.name} seçeneğinin değeri boş veya büyük harf içeremez.`));
                                return;
                            }

                        });
                    }
                    
                });
            }

            if (!props.description || props.description == "") {
                console.log(colors.red(`[!] ${moment().format(("YYYY-MM-DD HH:mm:ss"))}`) + colors.yellow(` > ${props.name} komutunun açıklaması eksik.`));
                return;
            }

            if (props.cooldown) {
                if (isNaN(props.cooldown)) {
                    console.log(colors.red(`[!] ${moment().format(("YYYY-MM-DD HH:mm:ss"))}`) + colors.yellow(` > ${props.name} komutunun cooldown değeri sayı olmalı.`));
                    return;
                }
            }
        });
    }).then(() => {
        bot.telegram.setMyCommands(commands);
    });
};