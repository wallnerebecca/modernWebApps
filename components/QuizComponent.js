"use strict";
import KWM_Component from '../core/kwm-component.js';
import KWM_Observable from '../core/kwm-observable.js';

/**
 * Quiz Component
 * 
 * This component is responsible for rendering the quiz page.
 * It fetches the questions from the API using a model and renders them.
 */
export default class QuizComponent extends KWM_Component {

    constructor() {
        super();

    }

    template() {
        return /*html*/`
        <h1>Quiz UI goes here</h1>
        
    `;
    }
}

customElements.define('quiz-component', QuizComponent);
