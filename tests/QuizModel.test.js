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

  it('initializes categories from empty localStorage as []', () => {
    expect(model.categories.value).toEqual([]);
    // No categories key in storage yet
    expect(localStorage.getItem('categories')).toBeNull();
  });

  it('initializes categories from saved localStorage', () => {
    const saved = ['sports', 'history'];
    localStorage.setItem('categories', JSON.stringify(saved));

    const m2 = new QuizModelClass();
    expect(m2.categories.value).toEqual(saved);
  });

  it('syncs categories changes back to localStorage', () => {
    model.categories.value = ['foo', 'bar'];
    expect(localStorage.getItem('categories')).toBe(JSON.stringify(['foo', 'bar']));

    // resetting to empty
    model.categories.value = [];
    expect(localStorage.getItem('categories')).toBe(JSON.stringify([]));
  });

  describe('fetchQuestions()', () => {
    it('fetches questions and updates this.questions.value', async () => {
      const fakeResp = [{ id: 1, question: 'Q?' }];
      fetch.mockResolvedValue({
        json: () => Promise.resolve(fakeResp)
      });

      await model.fetchQuestions('entertainment', 2);
      expect(fetch).toHaveBeenCalledWith(
        'https://open-trivia-api.jkoster.com/question?limit=2&categories=entertainment'
      );
      expect(model.questions.value).toEqual(fakeResp);
    });

    it('uses default amount = 1 when not provided', async () => {
      const fakeResp = [{ id: 2, question: 'Another?' }];
      fetch.mockResolvedValue({
        json: () => Promise.resolve(fakeResp)
      });

      await model.fetchQuestions('history');
      expect(fetch).toHaveBeenCalledWith(
        'https://open-trivia-api.jkoster.com/question?limit=1&categories=history'
      );
      expect(model.questions.value).toEqual(fakeResp);
    });
  });

  describe('fetchCategories()', () => {
    it('fetches and updates categories when empty', async () => {
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
      // and storage sync
      expect(localStorage.getItem('categories')).toBe(JSON.stringify(fakeCats));
    });

    it('does not fetch when categories already non-empty', async () => {
      model.categories.value = ['preloaded'];
      fetch.mockRejectedValue(new Error('Should not be called'));

      await model.fetchCategories();
      expect(fetch).not.toHaveBeenCalled();
      expect(model.categories.value).toEqual(['preloaded']);
    });

    it('treats null or undefined categories as empty and fetches', async () => {
      // manually set internals to null
      model.categories._value = null;
      const fakeCats = ['x'];
      fetch.mockResolvedValue({ json: () => Promise.resolve(fakeCats) });

      await model.fetchCategories();
      expect(fetch).toHaveBeenCalled();
      expect(model.categories.value).toEqual(fakeCats);
    });
  });
});
