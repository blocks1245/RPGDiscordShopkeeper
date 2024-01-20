const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder,  } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('xp calculator')
        .setDescription('Calculate xp per player')
        .addIntegerOption(option =>
            option.setName('players')
                .setDescription('The number of players')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('challenge cr')
                .setDescription('The cr of the challenge/adventure')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('apl')
                .setDescription('average party level')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('level difference')
                .setDescription('The amount of levels the party is below the highest level player (positive for below, negative for above)')
                .setRequired(true)),
    async execute(interaction) {
        const players = interaction.options.getInteger('players');
        const cr = interaction.options.getInteger('challenge cr');
        const apl = interaction.options.getInteger('apl');
        const levelDifference = interaction.options.getInteger('level difference');
        const n = apl - cr;
        const xp = (100 * cr(n/2+3)*(levelDifference/4+1));
        const embed = new EmbedBuilder()
            .setTitle('Calculator')
            .setDescription(`The result is \`${xp}\`.`)
            .setColor('RANDOM');
        await interaction.reply({ embeds: [embed] });
    },
};