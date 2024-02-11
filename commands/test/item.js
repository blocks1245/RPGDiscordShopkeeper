const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder,  } = require('discord.js');
const { Items } = require('../../database/db-controller.js');

const items = new Items();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('item')
		.setDescription('returns the info on an item')
		.addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add an item to the shop')
                .addStringOption(option =>
                    option
                        .setName('name')
                        .setDescription('The name of the item you want to add')
                        .setRequired(true),
                )               
                .addStringOption(option =>
                    option
                        .setName('category')
                        .setDescription('The category of the item you want to add')
                        .addChoices(
                            {name: 'Weapon', value: 'weapon'},
                            {name: 'Armor', value: 'armor'},
                            {name: 'Consumable', value: 'consumable'},
                            {name: 'Magic Item', value: 'Magic Item'},
                            {name: 'Misc', value: 'misc'},
                            )
                        .setRequired(true),
                )
                .addIntegerOption(option =>
                    option
                    .setName('price')
                    .setDescription('The price of the item')
                    .setRequired(true),
                )
                .addBooleanOption(option =>
                    option
                        .setName('homebrew')
                        .setDescription('Whether the item is homebrew or not')
                        .setRequired(true),
                )
				.addStringOption(option =>
                    option
                        .setName('description')
                        .setDescription('The description of the item available for all players')
                        .setRequired(false),
                )
                .addStringOption(option =>
                    option
                        .setName('dminfo')
                        .setDescription('The description of the item available to the DMs')
                        .setRequired(false),
                )
                .addStringOption(option =>
                    option
                        .setName('imageurl')
                        .setDescription('The url to the image of the item')
                        .setRequired(false),
                ),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('removes an item from the database')
				.addStringOption(option =>
					option
						.setName('name')
						.setDescription('The name of the item')
						.setRequired(true)),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('edit')
				.setDescription('edits an item in the database')
				.addStringOption(option =>
					option
						.setName('name')
						.setDescription('The name of the item')
						.setRequired(true)
				)
				.addStringOption(option =>
					option
						.setName('category')
						.setDescription('The category of the item you are editing')
						.addChoices(
							{name: 'Weapon', value: 'weapon'},
							{name: 'Armor', value: 'armor'},
							{name: 'Consumable', value: 'consumable'},
							{name: 'Magic Item', value: 'Magic Item'},
							{name: 'Misc', value: 'misc'},
							)
						.setRequired(false),
				)
				.addStringOption(option =>
					option
						.setName('description')
						.setDescription('The description of the item available for all players')
						.setRequired(false),
				)
				.addIntegerOption(option =>
					option
						.setName('price')
						.setDescription('The price of the item')
						.setRequired(false),
				)
				.addBooleanOption(option =>
					option
						.setName('homebrew')
						.setDescription('Whether the item is homebrew or not')
						.setRequired(false),
				)
				.addStringOption(option =>
					option
						.setName('dminfo')
						.setDescription('The description of the item available to the DMs')
						.setRequired(false),
				)
				.addStringOption(option =>
					option
						.setName('imageurl')
						.setDescription('The url to the image of the item')
						.setRequired(false),
				),
		
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('get')
				.setDescription('gets an item from the database')
				.addStringOption(option =>
					option
						.setName('name')
						.setDescription('The name of the item')
						.setRequired(true)),
		),

	async execute(interaction) {
		let DMRole = interaction.guild.roles.cache.find(role => role.name === 'DM');
        let PlayerRole = interaction.guild.roles.cache.find(role => role.name === 'Player');
		switch (interaction.options.getSubcommand()) {
			case 'add':
				if (interaction.member.roles.cache.has(DMRole.id)) {
					await this.addItem(interaction);
				} else {
					await interaction.reply({ content: 'You do not have permission to use this command', ephemeral: true });
				}
				break;
			case 'remove':
				if (interaction.member.roles.cache.has(DMRole.id)) {
					await this.removeItem(interaction);
				} else {
					await interaction.reply({ content: 'You do not have permission to use this command', ephemeral: true });
				}
				break;
			case 'edit':
				if (interaction.member.roles.cache.has(DMRole.id)) {
					await this.editItem(interaction);
				} else {
					await interaction.reply({ content: 'You do not have permission to use this command', ephemeral: true });
				}
				break;
			case 'get':
				await this.getItem(interaction);
				break;
			default:
				break;
		}

	},

	// add an item to the item database
	async addItem(interaction) {
		const name = interaction.options.getString('name').toUpperCase();
		const category = interaction.options.getString('category').toUpperCase();
		const description = interaction.options.getString('description');
		const price = interaction.options.getInteger('price');
		const homebrew = interaction.options.getBoolean('homebrew');
		let dminfo = interaction.options.getString('dminfo');
		const image = interaction.options.getString('imageurl');
		
		if (!dminfo) {
			dminfo = '';
		}
		if (await ItemsInstance.nameCheck(name)) {
			await interaction.reply({ content: 'Item already exists', ephemeral: true });
			return;
		}
		await ItemsInstance.putItem(name, category, description, price, dminfo, image, homebrew);

		const newItemList = await ItemsInstance.fetchItem(name);
		const newItem = newItemList[0];
		const addEmbed = new EmbedBuilder()
			.setTitle(newItem.name.toString())
			.setDescription(newItem.description)
			.addFields(
				{ name: 'Price', value: newItem.price.toString(), inline: false },
			)
			.setFooter({ text: `id: ${newItem.id.toString()}` })
			.setColor('#340507');
			if (newItem.image) {
				addEmbed.setImage(newItem.image);
			}
			if (newItem.dminfo) {
				addEmbed.addFields(
					{ name: 'DM Info', value: newItem.dminfo, inline: false },
				);
			}

		await interaction.reply({
			embeds: [addEmbed],
		});
	},

	async removeItem(interaction) {
		const name = interaction.options.getString('name');
		const removeEmbed = new EmbedBuilder()
			.setTitle('Remove this item?')
			.setDescription(name)
			.setColor('#340507');
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('confirm')
					.setLabel('Confirm')
					.setStyle('Danger'),
				new ButtonBuilder()
					.setCustomId('cancel')
					.setLabel('Cancel')
					.setStyle('Secondary'),
		);
		const message = await interaction.reply({
			embeds: [removeEmbed],
			components: [row],
		});
	
		const filter = (response) => {
			const isButtonInteraction = response.customId && ['confirm', 'cancel'].includes(response.customId);
			const isSameUser = response.user.id === interaction.user.id;
			return isButtonInteraction && isSameUser;
		};
	
		const collected = await message.awaitMessageComponent({ filter, time: 15000 }).catch(() => null);
	
		const removedEmbed = new EmbedBuilder()
			.setTitle('Item removed')
			.setDescription(name)
			.setColor('#340507');
		const cancelEmbed = new EmbedBuilder()
			.setTitle('Removal canceled')
			.setDescription(name)
			.setColor('#340507');


		if (collected) {
			switch (collected.customId) {
				case 'confirm':
					await interaction.editReply({ embeds: [removedEmbed], components: [] });
					await ItemsInstance.deleteItem(name);
					break;
				case 'cancel':
					await interaction.editReply({ embeds: [cancelEmbed], components: [] });
					break;
			}
		} else {
			await interaction.followUp('You took too long to respond.');
		}
	},

	async editItem(interaction) {
		const name = interaction.options.getString('name').toUpperCase();
		const category = interaction.options.getString('category').toUpperCase();
		const description = interaction.options.getString('description');
		const price = interaction.options.getInteger('price');
		const homebrew = interaction.options.getBoolean('homebrew');
		let dminfo = interaction.options.getString('dminfo');
		const image = interaction.options.getString('imageurl');
		const item = await ItemsInstance.fetchItem(name);
		const editEmbed = new EmbedBuilder()
			.setTitle('Edit this item?')
			.setDescription(name)
			.setColor('#340507');
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('confirm')
					.setLabel('Confirm')
					.setStyle('Success'),
				new ButtonBuilder()
					.setCustomId('cancel')
					.setLabel('Cancel')
					.setStyle('Secondary'),
		);
		const message = await interaction.reply({
			embeds: [editEmbed],
			components: [row],
			ephemeral: true,
		});

		const filter = (response) => {
			const isButtonInteraction = response.customId && ['confirm', 'cancel'].includes(response.customId);
			const isSameUser = response.user.id === interaction.user.id;
			return isButtonInteraction && isSameUser;
		};

		const collected = await message.awaitMessageComponent({ filter, time: 15000 }).catch(() => null);

		const confirmEmbed = new EmbedBuilder()
			.setTitle('Edit confirmed')
			.setDescription(name)
			.setColor('#340507');
		const cancelEmbed = new EmbedBuilder()
			.setTitle('Edit canceled')
			.setDescription(name)
			.setColor('#340507');

		if (collected) {
			switch (collected.customId) {
				case 'confirm':
					await interaction.editReply({ embeds: [confirmEmbed], components: [], ephemeral: true });
					await ItemsInstance.updateItem(name, category, description, price, dminfo, image, homebrew);
					break;
				case 'cancel':
					await interaction.editReply({ embeds: [cancelEmbed], components: [], ephemeral: true });
					break;
			}
		} else {
			await interaction.followUp('You took too long to respond.');
		}
	},


	// get an item from the item database
	async getItem(interaction) {
		let DMRole = interaction.guild.roles.cache.find(role => role.name === 'DM');
		const name = interaction.options.getString('name').toUpperCase();
		const itemList = await items.fetchItem(name);
		const item = itemList[0];
		if (item === undefined) {
			await interaction.reply({ content: 'Item not found', ephemeral: true });
			return;
		}

		item.description = item.description.replaceAll('\\n', '\n');
		if (item.dminfo) {
			item.dminfo = item.dminfo.replace('\\n', '\n');
		}

		console.log(item);
		const embed = new EmbedBuilder()
			.setTitle(item.name)
			.setDescription(item.description)
			.setColor('#340507');
		embed.addFields(
			{ name: 'Price', value: item.price.toString(), inline: false },
			{ name: 'Category', value: item.category, inline: false },
		);
		if (interaction.member.roles.cache.has(DMRole.id)) {
			if (item.dminfo) {
				embed.addFields(
					{ name: 'DM Info', value: item.dminfo, inline: false },
				);
			}
		}
		if (item.imageurl) {
			try {
				embed.setImage(item.imageurl);
			} catch (error) {
				console.log("image url is not valid");
		}
	}
		await interaction.reply({ embeds: [embed], ephemeral: true });
	},
};
