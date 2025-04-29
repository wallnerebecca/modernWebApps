import KWM_Observable from "../core/kwm-observable.js";

// https://open-trivia-api.onrender.com/question?limit=1&categories=entertainment - GET
// [
//     {
//         "id": 182,
//         "topic": "entertainment",
//         "question": "Marvel character Zeus ruled the underworld.",
//         "type": "true_false",
//         "answers": [
//             {
//                 "answer": "True",
//                 "is_correct": false
//             },
//             {
//                 "answer": "False",
//                 "is_correct": true
//             }
//         ]
//     }
// ]

// https://open-trivia-api.onrender.com/categories - GET
// [
//     "entertainment",
//     "sports",
//     "religion-faith",
//     "history",
//     "newest",
//     "television",
//     "people",
//     "music",
//     "world"
// ]

class QuizModel {

    constructor() {
        const savedCategories = localStorage.categories ? JSON.parse(localStorage.categories) : [];

        this.categories = new KWM_Observable(savedCategories);
        this.questions = new KWM_Observable([]);

        this.categories.subscribe((categories) => {
            localStorage.categories = JSON.stringify(categories ?? []); // Sync the categories to local storage
        });

        this.apiRoot = 'https://open-trivia-api.jkoster.com';
    }

    async fetchQuestions(category, amount = 1) {
        const resp = await fetch(this.apiRoot + `/question?limit=${amount}&categories=${category}`).then(res => res.json());
        this.questions.value = resp;
    }

    async fetchCategories() {
        if (!this.categories.value || this.categories.value?.length == 0) {
            const resp = await fetch(this.apiRoot + '/category').then(res => res.json());
            this.categories.value = resp;
        }
    }
}

// Singelton Instance of the Model - only one instance of the model is allowed
export const quizModelInstance = new QuizModel()
