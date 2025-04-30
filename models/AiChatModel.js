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
        
    }

}

// Singelton Instance of the Model - only one instance of a model is allowed
export const aiChatModelInstance = new AiChatModel();

