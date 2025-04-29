// tests/QuizModel.test.js

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { quizModelInstance } from '../models/QuizModel.js';

describe('QuizModel', () => {
  let QuizModelClass;
  let model;
  let originalFetch;
  let originalStorage;

  beforeEach(() => {
    // Capture class and make fresh instance
    QuizModelClass = quizModelInstance.constructor;
    // Clear localStorage
    localStorage.clear();
    // Create new model
    model = new QuizModelClass();
    // Mock fetch
    originalFetch = window.fetch;
    window.fetch = vi.fn();
  });

  afterEach(() => {
    // Restore fetch
    window.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('fetchQuestions() fetches questions and updates this.questions.value', async () => {
    const fakeResp = [{ id: 1, question: 'Q?' }];
    fetch.mockResolvedValue({
      json: () => Promise.resolve(fakeResp)
    });

    await model.fetchQuestions('entertainment', 2);
    const calledUrl = fetch.mock.calls[0][0];
    const url = new URL(calledUrl);

    // Check query params
    expect(url.origin + url.pathname).toBe('https://open-trivia-api.jkoster.com/question');
    expect(url.searchParams.get('limit')).toBe('2');
    expect(url.searchParams.get('categories')).toBe('entertainment');
    expect(model.questions.value).toEqual(fakeResp);
  });

  it('fetchCategories() fetches and updates categories', async () => {
    const fakeCats = ['music', 'world'];
    fetch.mockResolvedValue({
      json: () => Promise.resolve(fakeCats)
    });

    // ensure categories is empty
    expect(model.categories.value).toEqual([]);
    await model.fetchCategories();

    expect(fetch).toHaveBeenCalledWith(
      'https://open-trivia-api.jkoster.com/category'
    );
    expect(model.categories.value).toEqual(fakeCats);
  });

  it('(bonus) initializes categories from saved localStorage', () => {
    const saved = ['sports', 'history'];
    localStorage.setItem('categories', JSON.stringify(saved));

    const m2 = new QuizModelClass();
    expect(m2.categories.value).toEqual(saved);
  });

  it('(bonus) syncs categories changes to localStorage', () => {
    model.categories.value = ['foo', 'bar'];
    expect(localStorage.getItem('categories')).toBe(JSON.stringify(['foo', 'bar']));

    // resetting to empty
    model.categories.value = [];
    expect(localStorage.getItem('categories')).toBe(JSON.stringify([]));
  });
});
