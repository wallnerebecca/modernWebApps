import { observable } from "../kwm-js";

const API_ROOT = "https://open-trivia-api.onrender.com";

export class QuizModel {
    questions = observable([]);
    categories = observable([]);

    constructor()
    {
        this.fetchCategories();
    }


    async fetchCategories() {
        return fetch('https://open-trivia-api.onrender.com/category')
            .then(response => response.json())
            .then(categories => {
                this.categories.set(categories);
                return categories;
            });
    }

    async fetchQuestions(category,limit = 10) {
        return fetch(`https://open-trivia-api.onrender.com/question?type=true_false&categories=${category}&limit=${limit}`)
            .then(res => res.json())
        .then(questions => {
            this.questions.set(questions);
            return questions;
        })
    }

}



function runCategories(apiUrl) {
    initC
}
