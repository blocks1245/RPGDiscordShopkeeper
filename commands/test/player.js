const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { Player } = require('../../database/db-controller.js');

const player = new Player();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('player')
        .setDescription('Player commands')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('The name of the player')
                .setRequired(false),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('edit')
                .setDescription(`Edit a player's information`)
                .addStringOption(option =>
                    option
                        .setName('name')
                        .setDescription('The name of the player')
                        .setRequired(true),
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('List all players')
            ),
    async execute(interaction) {
        const userid = interaction.user.id;
        switch (interaction.options.getSubcommand()) {
            case 'edit':
                await edit();
                break;
            case 'list':
                await list();
                break;
            case null:
                await handleBaseCommand();
            default:
                await interaction.reply('Unknown subcommand');
                break;
        }
    }
};

async function edit() {

}

async function list() {

}

async function handleBaseCommand() {
    const name = interaction.options.getString('name');
    if (name) {
        const fetchedPlayer = await player.fetchPlayerByName(name);
    } else {
        const fetchedPlayer = await player.fetchPlayerById(interaction.user.id);
    }
    if (fetchedPlayer) {
        const embed = new EmbedBuilder()
            .setTitle(fetchedPlayer.name)
            .setDescription(fetchedPlayer.description)
            .setColor('#3498db'); //TODO: change color to preferred color by player
        // TODO: add more fields to the embed
        // TODO: add thumbnail to the embed if available
    } else {
        await interaction.reply({ content: 'That player was not found', ephemeral: true });
    }
}
