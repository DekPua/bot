const { ShardingManager, Message } = require('discord.js');
const manager = require('./index');

jest.mock('discord.js');

describe('Sharded Discord Bot', () => {
  beforeEach(() => {
    ShardingManager.mockClear();
  });

  it('correctly spawns shards', () => {
    expect(manager.spawn).toHaveBeenCalled();
  });
});
