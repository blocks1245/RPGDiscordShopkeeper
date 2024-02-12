const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { Items } = require('../../database/db-controller.js');

ItemsInstance = new Items();

const EnterLines = [
    "Greetings, wanderer! The scent of adventure follows you. What trinket or tool can I offer for your grand journey?",
    "Ahoy there! The doors creak open for another seeker. Feast your eyes upon the treasures of Robin's humble vault.",
    "Well met, kind soul! In this emporium, dreams take form. What fanciful artifact doth your heart desire?",
    "Hail, noble patron! Each item here tells a story. Will you be the one to continue its tale?",
    "Greetings, intrepid one! The echoes of ages past linger within these walls. What whispers of the ancients beckon to you?",
    "Salutations, wayfarer! Seek ye the mundane or the mystic? Speak, and I shall unveil the mysteries of choice.",
    "Well met, fellow traveler! The moonlight reveals wonders untold. What rare gem or enchanted relic shall accompany you?",
    "Greetings, seeker of the extraordinary! Step into the realm where enchantment and reality dance. What visions fill your dreams?",
    "Hail and well met! The tapestry of fate welcomes you. What secret yearnings lay hidden in your heart, awaiting revelation?",
    "Greetings, brave adventurer! A sip from the goblet of wonder awaits. What elixir of fortune shall I concoct for thee?",
    "Salutations, kindred spirit! Robin's emporium weaves destiny into every sale. What fate-altering item calls your name?",
    "Well met, stalwart soul! Amidst these shelves, legends are born. What tale shall you inscribe in the annals of this emporium?",
    "Ah, a new face! Welcome to Robin's chamber of marvels. What relic or charm shall cement your place in the tales of old?",
    "Greetings, honored guest! The stars themselves bear witness to the transactions within. What cosmic artifact beckons to you?",
    "Hail, seeker of the arcane! Robin's gaze pierces the veil of the mundane. What spectral wonders shall be revealed to thee?",
    "Greetings, fellow dreamer! This emporium is a canvas, and your desires paint the masterpiece. What hues shall adorn your destiny?",
    "Salutations, noble traveler! Each step within these walls is a stride through the pages of fate. What chapter shall unfold for you?",
    "Well met, gentle soul! The winds carry whispers of your arrival. What mystical harmonies shall resonate in your heart?",
    "Hail, seeker of wonders! In the dance of light and shadow, I unveil the treasures of yore. What relic shall become your companion?",
    "Greetings, kindred spark! The embers of curiosity glow bright. What spark of inspiration shall ignite the flames of your quest?",
    "Greetings, adventurer! A fine day for shopping, isn't it? I'm Robin, the purveyor of wonders and trinkets. What brings you to my humble abode?",
    "Ah, a newcomer! Welcome to Robin's Emporium of Oddities. Need a potion, a blade, or perhaps something more elusive?",
    "Hail, good traveler! Step into my humble emporium, where steel meets sorcery. What quest brings you to my door?",
    "Well met, stranger! In the shadows of these ancient shelves lie treasures untold. What artifact or charm catches your fancy?",
    "Greetings, kindred spirit! The winds of fate have guided you to Robin's Den of Enchantment. What boon do you seek this day?",
    "Ho, weary wanderer! The tales of my wares spread far and wide. Seek ye the mundane or the mystical? Speak, and it shall be yours.",
    "Salutations, noble adventurer! I, the keeper of secrets, welcomes you. What brings you to the heart of my arcane repository?",
    "Well met, gallant soul! Here amidst the tapestries of fate, Robin's Emporium beckons. What relics or charms shall accompany you on your noble journey?",
    "Hail, brave heart! In my realm, magic intertwines with the mundane. What whispers from the arcane weave entice you today?",
    "Greetings, honored guest! Beneath the timeworn beams of this emporium, tales are told through wares. Pray, share your story, and let me craft a chapter.",
    "Ah, fellow seeker of the mystical! The air crackles with ancient energies. What quest do you embark upon, and how may I aid your noble endeavor?",
    "Ho there, seeker of the extraordinary! Amidst these oaken shelves, secrets are kept and wonders revealed. What peculiarities call to you, noble soul?",
    "Salutations, noble adventurer! Beneath the flickering candlelight, mysteries unfold. What brings you to this sanctum of mine, the purveyor of arcane curiosities?",
    "Greetings, traveler of realms! The echoes of past enchantments resonate within these walls. What relic or charm seeks to join your destiny today?",
    "Hail, seeker of the arcane! The stars themselves bear witness to the transactions within. What cosmic artifact beckons to you?",
    "As you step into the shop, you come to the startling realisation that you have no idea how you got here.",
    "Your pockets seem heavy, traveler, let me empty them for you!",
];

const BuyLines = [
    "Do take care out there. I don't want to see my goods return too quickly.",
    "Ah, a wise choice! May your new possession serve you well on your journey.",
    "Excellent taste! Your acquisition is sure to bring you good fortune.",
    "A fine selection, indeed! Your purchase will prove invaluable in your adventures.",
    "Ah, a classic favorite among adventurers! May your newfound possession aid you in your noble endeavors.",
    "A shrewd decision! Your chosen item is known far and wide for its exceptional quality.",
    "Well chosen! Your acquisition has a storied history and will undoubtedly find purpose in your hands.",
    "A discerning eye you have! Your chosen item is a testament to your keen judgment.",
    "An astute purchase! With your new possession, you'll be well-equipped for whatever challenges lie ahead.",
    "A worthy investment! Your acquisition is not just an object; it's a companion on your journey.",
    "May your new possession be your steadfast ally in the trials that await. Safe travels!",
];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shop')
		.setDescription('Shop commands')
        .addSubcommand(subcommand =>
            subcommand
                .setName('available')
                .setDescription('Shows the available items in the shop'),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('buy')
                .setDescription('Buy an item from the shop')
                .addStringOption(option =>
                    option
                        .setName('item')
                        .setDescription('The item you want to buy')
                        .setRequired(true),
                ),
        ),
    async execute(interaction) {
        let DMRole = interaction.guild.roles.cache.find(role => role.name === 'DM');
        let PlayerRole = interaction.guild.roles.cache.find(role => role.name === 'Player');
        switch (interaction.options.getSubcommand()) {
            case 'available':
                await available();
                break;
            case 'buy':
                await buy();
                break;
            case 'sell':
                await interaction.reply({ content: 'This command is not yet implemented', ephemeral: true });
                break;
            case 'add':
                await interaction.reply({ content: 'This command is not yet implemented', ephemeral: true });
                break;
            default:
                await interaction.reply('Unknown subcommand', { ephemeral: true });
                break;
        }

        async function available() {
            availableItems = await ItemsInstance.fetchAvailable();

                if (availableItems.length === 0) {
                    await interaction.reply({ content: 'The shop is closed for now. Please come back later.', ephemeral: true});
                    return;
                }

                // Create a matrix to organize items by category
                const itemsMatrix = {};
                for (const item of availableItems) {
                    if (!itemsMatrix[item.category]) {
                        itemsMatrix[item.category] = [];
                    }
                    itemsMatrix[item.category].push(item);
                }
                
                const availableEmbed = new EmbedBuilder()
                    .setTitle('Available items')
                    .setDescription(EnterLines[Math.floor(Math.random() * EnterLines.length)])
                    .setColor('#340507')
                    .setThumbnail('attachment://Thumbnail.png');
                
                // Add fields for each category
                for (const category in itemsMatrix) {
                    if (Object.hasOwnProperty.call(itemsMatrix, category)) {
                        const itemsInCategory = itemsMatrix[category];
                        const formattedItems = itemsInCategory.map(item => `* ${item.name} :coin:*${item.price}*`).join('\n');
                        availableEmbed.addFields({ name: category+'s', value: formattedItems, inline: false });
                    }
                }

                file = { files: ['Thumbnail.png'] };
                
                await interaction.reply({ embeds: [availableEmbed], ...file });
        }

        async function buy() {
            if (!interaction.member.roles.cache.has(PlayerRole.id)) {
                await interaction.reply({ content: 'Im sorry stranger but you are not allowed to buy items here.', ephemeral: true });
                return;
            }
            const item = interaction.options.getString('item');
            await interaction.reply(`You bought ${item}`);
        }


    },
};
