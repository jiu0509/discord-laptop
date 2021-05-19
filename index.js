 const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`${client.user.tag}님이 로그인 되셨습니다.`);
});
client.on('message', message => { console.log(message.content);
});






client.login('ODQxMzAwMDA3MzA2Nzg4ODc1.YJkvsA.-aWCxeTyk6SgKeLrL2ZsFdcwvLU');
//인사 변수
const 인사대답1 = '안녕하세요'
const 인사대답2 = '안녕하세요'
const 인사대답3 = 'hihi~~'

const N = 0
const W = 1



client.on('message', message => {
  if (message.content === "신호!") {
  message.reply("신호가 감지되었습니다")

  }
});

//인사
client.on('message', message => {
  if (message.content === '/안녕') {
    setTimeout(function () {
          message.reply(인사대답1)
    }, 1000);

  }
});
client.on('message', message => {
  if (message.content === '/안녕하세요') {
    setTimeout(function () {
          message.reply(인사대답2)
    }, 1000);

  }
});
client.on('message', message => {
  if (message.content === '/하이') {
    setTimeout(function () {
          message.reply(인사대답3)
    }, 1000);

  }
});
//노트북봇 초대
client.on('message', message => {
  if (message.content === '/봇 초대') {
    message.reply('https://discord.com/oauth2/authorize?client_id=841300007306788875&permissions=8&scope=bot')
  }
});
//음성채팅방

const ytdl = require("ytdl-core");
const {
	prefix,
} = require('./config.json');
const queue = new Map();


client.once("reconnecting", () => {
  console.log("Reconnecting!");
});

client.once("disconnect", () => {
  console.log("Disconnect!");
});

client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`${prefix}play`)) {
    execute(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}skip`)) {
    skip(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}stop`)) {
    stop(message, serverQueue);
    return;
  } else {
    message.channel.send("명령어를 입력하세요.(음악실행명령어: +play + URL)");
  }
});

async function execute(message, serverQueue) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "채널에 있어야 실행됩니다"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "음성채널에서 말할 수 있는 권한이 필요합니다."
    );
  }

  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
   };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} 목록에 추가되었습니다.`);
  }
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "음악을 멈추려면 음성 채널에 있어야합니다!"
    );
  if (!serverQueue)
    return message.channel.send("건너 뛸 수있는 노래가 없습니다!");
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "음악을 멈추려면 음성 채널에 있어야합니다!"
    );
    
  if (!serverQueue)
    return message.channel.send("멈출 수있는 노래가 없습니다!");
    
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`노래를 재생합니다 start music: **${song.title}**`);
}

//
client.on('message', message => {
  if (message.content === '시간') {
    setTimeout(function () {
          message.reply('')
    }, 1000);

  }
});
