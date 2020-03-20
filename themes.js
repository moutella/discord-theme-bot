const Discord = require("discord.js");
const config = require('./config.json');


var _ = require("underscore");
const client = new Discord.Client();

const songs = {
  "373573076899856384": ["themes/intro_lopes.mp3"],
  "183402728985329664": ["themes/tema_john_1.mp3"],
  "211529043521044480": ["themes/intro_diogo.mp3"],
  "305569254709919754": ["themes/intro_mateus.1.mp3"]
  //antonioli: '181189226216423425': [],
  //tbt: '305514937701236737': [],
  //'376936807637450754': ['yago']
};

const outros = {
  "373573076899856384": ["themes/lopesout.mp3"],
  "183402728985329664": ["themes/lopesout.mp3"]
};
var playing = false;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async msg => {
  console.log(msg.author);
  console.log(msg.guild.voiceStates.cache);
  if (msg.content === "ping") {
    msg.reply("pong");
  }
  if (msg.content === "o negócio") {
    msg.reply("O negócio é comer pão com manteiga!");
  }
  if (msg.content === "rapaiz") {
    if (msg.member.voice.channel) {
      const connection = await msg.member.voice.channel.join();
      const dispatcher = connection.play("sounds/rapaz.mp3");
      dispatcher.on("finish", () => {
        console.log("Finished playing!");
        dispatcher.destroy();
        playing = false;
        connection.disconnect();
      });
    }
  }
});

client.on("voiceStateUpdate", async (oldState, newState) => {
  if (
    !newState.member.user.bot &&
    songs[newState.member.user.id] &&
    !playing &&
    newState.channel &&
    !oldState.channel
  ) {
    playing = true;
    const connection = await client.voice.joinChannel(newState.channel);
    const song = _.sample(songs[newState.member.user.id]);
    const dispatcher = connection.play(song);
    dispatcher.on("finish", () => {
      console.log("Finished playing!");
      dispatcher.destroy();
      playing = false;
      connection.disconnect();
    });
  }
  if (
    !newState.member.user.bot &&
    !newState.channel &&
    oldState.channel &&
    outros[oldState.member.user.id]
  ) {
    playing = true;
    const connection = await client.voice.joinChannel(oldState.channel);
    const song = _.sample(outros[newState.member.user.id]);
    const dispatcher = connection.play(song);
    dispatcher.on("finish", () => {
      console.log("Finished playing!");
      dispatcher.destroy();
      playing = false;
      connection.disconnect();
    });
  }
});

client.login(config.token);
