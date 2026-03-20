'use strict';
import {Component, html, observable, on} from "../kwm-js";
import {QuizModel} from '/models/QuizModel.js';


//Should log the questions and categories fetched from the API to the console

export class QuizComponent extends Component {
    model = new QuizModel();
    //categories = this.model.categories.get();

    questions = this.model.questions; //Observable
    currentQuestion = observable(null);
    currentQuestionIndex = observable(0);

    answersList = observable([]);

    numberOfQuestions = observable(2);


    selectedCategory = observable(null);
    correct = 0;
    
     async selectQuizCategory(quizCategory) {
        this.selectedCategory.set(quizCategory);
        await this.model.fetchQuestions(quizCategory, this.numberOfQuestions.get());
    }

    async startQuiz(quizCategory) {
        await this.selectQuizCategory(quizCategory)
        const questions = this.questions.get()
        this.currentQuestion.set(questions[0]);
        this.currentQuestionIndex.set(0);
    }

    answerQuestion(answer){
         const currentAnswers = this.answersList.get();
         const currentQuestion = this.currentQuestion.get();

         //const is_correct = currentQuestion.answers.find(a => a.answer === answer).is_correct;

         const questionWithAnswer = {
             "question": currentQuestion,
             "answer": answer
         }

         const updatedAnswers = [...currentAnswers, questionWithAnswer];
         this.answersList.set(updatedAnswers);
         const allQuestions = this.questions.get()
         const currentQuestionIndex = this.currentQuestionIndex.get();
         const answeredAllQuestions = currentQuestionIndex + 1 === allQuestions.length;

         if (answeredAllQuestions) {
             this.currentQuestion.set(null);
         }
         else {
             this.currentQuestion.set(allQuestions[currentQuestionIndex+1]);
             this.currentQuestionIndex.set(currentQuestionIndex+1);
         }
     }

     isCorrect(qa){
         const answer = qa.question.answers.find(a=> a.answer === qa.answer)
         return answer.is_correct
     }

     score(){
         const allAnswers = this.answersList.get();

         return allAnswers.filter(qa => this.isCorrect(qa)).length;
     }


    render() {
        const categories = this.model.categories.get();
        const activeCategory = this.selectedCategory.get();
        const currIndex = this.currentQuestionIndex.get();
        const score = this.score();

        return html` 
            <section class="quiz-page">
               <div class="quiz-hero">
                    <h1 class="quiz-logo"><span class="quiz-logo__q">Q</span>uiz</h1>
                    <p class="quiz-hero__sub">Test your knowledge</pclass>
                </div>
               <div class="quiz-setup"> 
                   <div class="quiz-count-row">
                       <div class="quiz-count-label">
                           Questions
                       </div>
                       <div class="quiz-count-wrap">
                           <button class="quiz-count-btn">
                               -
                           </button>
                           <div class="quiz-count-input">
                               <input
                                       type="text"
                                       placeholder="Enter Amount"
                                       value="${this.numberOfQuestions.get()}"
                                       ${on('input',(e) => this.numberOfQuestions.set(e.target.value))}
                               />
                           </div>
                           <button class="quiz-count-btn">
                               +
                           </button>
                       </div>
                       
                   </div> 
                   <p class="quiz-category-heading">Select a category</p>
                   <div class="quiz-category-grid">
                       ${categories.map(quizCategory => (
                               html`
                                   <button
                                           ${on('click', () => this.startQuiz(quizCategory))}
                                           class="quiz-category-tile"
                                           data-category="${quizCategory}"
                                   >
                                       <span class="quiz-category-tile__name">
                                           ${quizCategory}
                                       </span>
                                       
                                   </button>
                               `
                       ))}
                   </div> 
                   <div class="quiz-page--question">
                       <div class="quiz-top-bar">
                           <div class="quiz-topic-tag">
                               ${activeCategory}
                           </div>
                           <div class="quiz-counter">
                               ${currIndex+1} / ${this.numberOfQuestions.get()}
                           </div>
                       </div>
                       <div class="quiz-progress-track">
                           <div class="quiz-dot"> 
                           </div>                           
                       </div>
                       <div class="quiz-question-screen">
                           <div class="quiz-card">
                               <div class="quiz-question">
                                   ${this.currentQuestion.get()?.question}
                               </div>
                             
                           </div>
                           <div class="quiz-answer-pair">
                               <button
                                       ${on('click', () => this.answerQuestion('True'))}
                                       class="quiz-answer-btn quiz-answer-btn--true"
                               >
                                   <span class="quiz-answer-btn__mark">✔️</span>
                                   <span class="quiz-answer-btn__word">True</span> 
                               </button>
                               <button
                                       ${on('click', () => this.answerQuestion('False'))}
                                       class="quiz-answer-btn quiz-answer-btn--false"
                               >
                                   <span class="quiz-answer-btn__mark">❌</span>
                                   <span class="quiz-answer-btn__word">False</span>
                               </button>
                           </div>
                       </div>
                   </div>
                   <div class="quiz-page--results">
                    <div class="quiz-results">
                        <div class="quiz-results__eyebrow">
                            Round Complete
                        </div>
                        <div class="quiz-results__heading">
                            Well done!
                        </div>
                        <div class="quiz-score-wrap">
                            <div class="quiz-score-ring">
                                <div>
                                    <span class="quiz-score-num">${score}</span>
                                    <span class="quiz-score-denom">/ ${this.numberOfQuestions.get()}</span>
                                    <span class="quiz-score-pct">${(score*100/this.numberOfQuestions.get()).toFixed(0)}%</span>
                                </div>
                            </div>

                            <div class="quiz-score-stats">
                                <div class="quiz-score-stat--correct">
                                    <span class=".quiz-score-stat--correct">${score}</span>
                                    <span class=".quiz-score-stat__l">Correct</span>
                                </div>
                                <div class="quiz-score-stat--wrong">
                                    <span class=".quiz-score-stat--wrong">${this.numberOfQuestions.get() - score}</span>
                                    <span class=".quiz-score-stat__l">Wrong</span
                                </div>
                            </div>
                        </div>
                        
                        <ul class="quiz-breakdown">
                            
                            ${this.answersList.get().map((answerObj, index) => {
                                const is_correct = this.isCorrect(answerObj);
                                return html`
                                <li class="quiz-breakdown__item ${is_correct ? 'quiz-breakdown__item--correct' : 'quiz-breakdown__item--wrong'}">
                                    <span class="quiz-breakdown__num">${index + 1}.</span>
                                    <span class="quiz-breakdown__q">${answerObj.question.question}</span>
                                    <span class="quiz-breakdown__result">
                                    Your answer: ${answerObj.answer}, Correct: ${is_correct}
                                </span>
                                </li>
                                `
                                }
                                 
                            )}
                        </ul>
                        <button class="quiz-replay-btn">
                            Play again -->
                        </button>
                    </div>
                   </div>
                </div>
                   
            </section>
            
            `;



    }
}

customElements.define("quiz-component", QuizComponent);
