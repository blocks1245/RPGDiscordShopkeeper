const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder,  } = require('discord.js');

function calcXP(cr) {
    xpList = [];
    for (let lvl = 1; lvl <= 20; lvl++) {
        const xp = ((55*cr**2+60*cr)*(0.8+0.2*(cr/lvl)));
        const roundedXp = Math.round(xp /50) * 50;
        xpList.push(roundedXp);
    }
    return xpList;
}

function xpToString(xpList) {
    let xpString = '';
    for (let i = 0; i < xpList.length; i++) {
        xpString += `- **Level ${i+1}:** ${xpList[i]}\n`;
    }
    return xpString;

}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('calculatexp')
        .setDescription('Calculate xp per player')
        .addIntegerOption(option =>
            option.setName('challengecr')
                .setDescription('The cr of the challenge/adventure')
                .setRequired(true)),
    async execute(interaction) {
        const cr = interaction.options.getInteger('challengecr');
        const embed = new EmbedBuilder()
            .setTitle('Calculator')
            .setDescription(xpToString(calcXP(cr)))
            .setColor('#3498db');
        await interaction.reply({ embeds: [embed] });
    },
};
