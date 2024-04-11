const { Client } = require('discord.js');
const assert = require('assert');

require('dotenv').config();

// Import the main file where you initialize your bot
const { bot } = require('../bot'); // Adjust the path as per your project structure

describe('Bot', function() {
  let client;

  before(function() {
    client = new Client();
    bot(client); // Initialize your bot
    client.login(process.env.TOKEN); // Replace 'YOUR_BOT_TOKEN' with your actual bot token
  });

  it('should login to Discord successfully', function(done) {
    client.once('ready', () => {
      assert.strictEqual(client.user.tag, 'DekPua#8811');
      done();
    });
  });

  // Add more tests here to cover other functionality of your bot

  after(function() {
    client.destroy(); // Destroy the client after all tests are complete
  });
});
