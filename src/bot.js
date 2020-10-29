"use strict";

const slack = require("slack");
const _ = require("lodash");
const config = require("./config");
const {generateFullReport} = require("./commands/report");

let bot = slack.rtm.client();

bot.started((payload) => {
  this.self = payload.self;
});

bot.message ( async (msg) => {
  if (msg.includes('help')){
    runHelp();
  } else if (msg.includes ('full')) {
    let report = await generateFullReport("https://example.com");
    return report;
  }
  if (!msg.user) return;
  if (!_.includes(msg.text.match(/<@([A-Z0-9])+>/gim), `<@${this.self.id}>`))
    return;

  slack.chat.postMessage(
    {
      token: config("SLACK_TOKEN"),
      icon_emoji: config("ICON_EMOJI"),
      channel: msg.channel,
      username: "Lighthouse",
      text: `beep boop: I hear you loud and clear!"`,
    },
    (err, data) => {
      if (err) throw err;

      let txt = _.truncate(data.message.text);

      console.log(`🤖  beep boop: I responded with "${txt}"`);
    }
  );
});

// Show Help Text
const runHelp = () => {
  const params = {
    icon_emoji: ':question:'
  };

  bot.postMessageToChannel(
    'general',
    `Write "/lighthouse run" for a full report or click on the customize report button to customize your report according to device sizes.`,
    params
  );
}

module.exports = bot;
