// tests/AiChatModel.test.js

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { aiChatModelInstance } from '../models/AiChatModel.js';

describe('AiChatModel', () => {
  let AiChatModel;
  let model;

  beforeEach(() => {
    // Clear storage between tests
    localStorage.clear();

    // Grab the class from the singleton’s constructor and make a fresh instance
    AiChatModel = aiChatModelInstance.constructor;
    model = new AiChatModel();

    // Mock fetch globally
    window.fetch = vi.fn();
  });

  it('setApiKey() updates the openAiApiKey', () => {
    model.setApiKey('new-key-123');
    expect(model.openAiApiKey.value).toBe('new-key-123');
  });

  it('getAnswer() appends user & assistant messages and calls fetch with correct request configuration data', async () => {
    // arrange
    model.setApiKey('secret-token');
    const userText = 'Hello, world!';
    const assistantMsg = { role: 'assistant', content: 'Hi there!' };
    const fakeApiRes = { choices: [{ message: assistantMsg }] };

    fetch.mockResolvedValue({
      json: () => Promise.resolve(fakeApiRes)
    });

    // act
    await model.getAnswer(userText);

    // assert fetch was called correctly
    expect(fetch).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer secret-token'
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [ { role: 'user', content: userText } ]
        })
      })
    );

    // assert messages array now has both user and assistant entries
    expect(model.messages.value).toEqual([
      { role: 'user',      content: userText },
      { role: 'assistant', content: assistantMsg.content }
    ]);
  });

  it('supports multiple getAnswer() calls building conversation history', async () => {
    model.setApiKey('key');
    const responses = [
      { choices: [{ message: { role: 'assistant', content: 'First reply' } }] },
      { choices: [{ message: { role: 'assistant', content: 'Second reply' } }] }
    ];
    fetch
      .mockResolvedValueOnce({ json: () => Promise.resolve(responses[0]) })
      .mockResolvedValueOnce({ json: () => Promise.resolve(responses[1]) });

    await model.getAnswer('Q1');
    await model.getAnswer('Q2');

    expect(model.messages.value).toEqual([
      { role: 'user',      content: 'Q1' },
      { role: 'assistant', content: 'First reply' },
      { role: 'user',      content: 'Q2' },
      { role: 'assistant', content: 'Second reply' }
    ]);
  });

  it('resetChat() empties the messages array and resets the chat conversation', () => {
    // seed with one message
    model.messages.value = [{ role: 'user', content: 'hi' }];
    model.resetChat();
    expect(model.messages.value).toEqual([]);
  });

  it('(bonus) setApiKey() updates localStorage', () => {
    model.setApiKey('new-key-123');
    expect(localStorage.openAiApiKey).toBe('new-key-123');
  });

  it('(bonus) initializes openAiApiKey from saved localStorage', () => {
    const savedKey = 'saved-key-123';
    localStorage.setItem('openAiApiKey', savedKey);
    const m2 = new AiChatModel();
    expect(m2.openAiApiKey.value).toEqual(savedKey);
  });

  it('(bonus) syncs message history to localStorage', () => {
    const savedMessages = [{ role: 'user', content: 'Hello' }];
    model.messages.value = savedMessages;
    expect(localStorage.getItem('messages')).toBe(JSON.stringify(savedMessages));
  });

  it('(bonus) initializes messages from saved localStorage', () => {
    const savedMessages = [{ role: 'user', content: 'Hello' }];
    localStorage.setItem('messages', JSON.stringify(savedMessages));
    const m2 = new AiChatModel();
    expect(m2.messages.value).toEqual(savedMessages);
  });
});
