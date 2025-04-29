"use strict";
import KWM_Component from '../core/kwm-component.js';
import KWM_Observable from '../core/kwm-observable.js';

import { aiChatModelInstance } from '../models/AiChatModel.js';

// --- Example for messages from OpenAI ---
// [
//     {
//         "role": "user",
//         "content": "Hello"
//     },
//     {
//         "role": "assistant",
//         "content": "Hello! How can I assist you today?"
//     }
// ]

/**
 * AiChat Component
 * 
 * This component is responsible for rendering the chat page. It fetches the messages from the API using a model and renders them.
 */
export default class AiChatComponent extends KWM_Component {

    constructor() {
        super();

    }
    
    template() {
        return /*html*/`
        <h1>Chat UI goes here</h1>
        
    `;
    }
}

customElements.define('ai-chat-component', AiChatComponent);