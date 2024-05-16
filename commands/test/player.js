const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { Player } = require('../../database/db-controller.js');

const player = new Player();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('player')
        .setDescription('Player commands')
        .addSubcommand(subcommand =>
            subcommand
                .setName('info')
                .setDescription('Get information about a player')
                .addStringOption(option =>
                    option
                        .setName('name')
                        .setDescription('The name of the player')
                        .setRequired(false),
                ),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('edit')
                .setDescription(`Edit a player's information`)
                .addStringOption(option =>
                    option
                        .setName('name')
                        .setDescription('The name of the player')
                        .setRequired(false),
                )
                .addStringOption(option =>
                    option
                        .setName('description')
                        .setDescription('The description of the player')
                        .setRequired(false),
                )
                .addIntegerOption(option =>
                    option
                        .setName('coppercoin')
                        .setDescription('The amount of coppercoin the player has')
                        .setRequired(false),
                )
                .addAttachmentOption(option =>
                    option
                        .setName('image')
                        .setDescription('The image of the player')
                        .setRequired(false),
                ),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('List all players'),
        ),
    async execute(interaction) {
        switch (interaction.options.getSubcommand()) {
            case 'info':
                await info(interaction);
                break;
            case 'edit':
                await edit(interaction);
                break;
            case 'list':
                await list(interaction);
                break;
            default:
                await interaction.reply('Unknown subcommand', { ephemeral: true });
                break;
        }
    }
};

async function info(interaction) {
    //TODO make it work
    const name = interaction.options.getString('name');
    let fetchedPlayer;
    if (name) {
        fetchedPlayer = await player.fetchPlayerByName(name);
    } else {
        fetchedPlayer = await player.fetchPlayerByDiscordId(interaction.user.id);
    }
    if (fetchedPlayer) {
        const embed = new EmbedBuilder()
            .setTitle(fetchedPlayer.name)
            .setDescription(fetchedPlayer.description)
            .setColor('#3498db') //TODO: change color to preferred color by player?
            .addFields({ name: 'Coppercoin', value: `${fetchedPlayer.coppercoin} :coin:`, inline: true });
        if (fetchedPlayer.image) {
            embed.setThumbnail(await fetchedPlayer.image);
            await interaction.reply({ embeds: [embed] });
        } else {
            await interaction.reply({ embeds: [embed] });
        }
    } else {
        await interaction.reply({ content: 'That player was not found', ephemeral: true });
    }
}

async function edit(interaction) {
    const name = interaction.options.getString('name');
    const description = interaction.options.getString('description');
    const coppercoin = interaction.options.getInteger('coppercoin');
    const image = interaction.options.getAttachment('image');

    const fetchedPlayer = await player.fetchPlayerByDiscordId(interaction.user.id);
    if (fetchedPlayer) {
        playerName = name || fetchedPlayer.name;
        playerDescription = description || fetchedPlayer.description;
        playerCoppercoin = coppercoin || fetchedPlayer.coppercoin;
        playerImage = image ? image.attachment : fetchedPlayer.image;

        if (playerName.length > 255) {
            await interaction.reply({ content: 'Name is too long, please shorten it to less than 255 characters', ephemeral: true });
            return;
        } else if (playerDescription.length > 1024) {
            await interaction.reply({ content: 'Description is too long please shorten it to less than 1024 characters', ephemeral: true });
            return;
        } else {
            await player.updatePlayer(interaction.user.id, playerName, playerDescription, playerCoppercoin, playerImage);
            interaction.reply({ content: 'Player updated', ephemeral: true });
        }
    } else {
        if (name) {
            // TODO: edit this to be only the edit function instead of the put function
            await player.putPlayer(name, interaction.user.id);
            interaction.reply({ content: 'Player added', ephemeral: true });
        } else {
            await interaction.reply({ content: 'No player found, to add a new player please start by adding a name', ephemeral: true });
        }
    }
}

async function list(interaction) {
    const fetchedPlayers = await player.fetchAllNames();
    if (fetchedPlayers && fetchedPlayers.length > 0) {
        const embed = new EmbedBuilder()
            .setTitle('Players')
            .setColor('#3498db')
            .setDescription(fetchedPlayers.join('\n'));
        await interaction.reply({ embeds: [embed] });
    } else {
        await interaction.reply({ content: 'No players found', ephemeral: true });
    }
}
