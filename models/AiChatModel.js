import KWM_Observable from '../core/kwm-observable.js';

// https://api.openai.com/v1/chat/completions - POST
// REQUEST Example:
// 
// method: "POST",
// headers: {
//     "Content-Type": "application/json",
//     "Authorization": "Bearer ApiKeyGoesHere"
// },
// body: '{
//     "model": "gpt-4o-mini",
//     "messages": [{
//          "role":"user",
//          "content":"The message content goes here..."
//      }]
// }'
// 
// RESPONSE Example:
// 
// {
//     "id": "chatcmpl-8sH70IAhiID98Th5qEWN64K4GiVzJ",
//     "object": "chat.completion",
//     "created": 1707946182,
//     "model": "gpt-4o-mini",
//     "choices": [
//       {
//         "index": 0,
//         "message": {
//           "role": "assistant",
//           "content": "Hello! How can I assist you today?"
//         },
//         "logprobs": null,
//         "finish_reason": "stop"
//       }
//     ],
//     "usage": {
//       "prompt_tokens": 8,
//       "completion_tokens": 9,
//       "total_tokens": 17
//     },
//     "system_fingerprint": null
// }

class AiChatModel {

    constructor() {
        const savedApiKey = localStorage.openAiApiKey ?? '';
        const savedMessages = localStorage.messages ? JSON.parse(localStorage.messages) : [];

        this.messages = new KWM_Observable(savedMessages);
        this.openAiApiKey = new KWM_Observable(savedApiKey);

        this.openAiApiKey.subscribe((value) => {
            localStorage.openAiApiKey = value; // Sync the API key to local storage
        });

        this.messages.subscribe((value) => {
            localStorage.messages = JSON.stringify(value); // Sync the messages to local storage
        });
    }

    setApiKey(apiKey) {
        this.openAiApiKey.value = apiKey;
    }

    resetChat() {
        this.messages.value = [];
    }

    async getAnswer(message) {
        const newUserMessage = {
            role: 'user',
            content: message
        }

        this.messages.value = [...this.messages.value, newUserMessage];

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.openAiApiKey.value
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: this.messages.value
            })
        }).then(res => res.json());

        const assistantResponseMessage = response.choices[0].message

        this.messages.value = [...this.messages.value, assistantResponseMessage];
    }
}

// Singelton Instance of the Model - only one instance of a model is allowed
export const aiChatModelInstance = new AiChatModel();
