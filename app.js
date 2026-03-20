'use strict';

import {HeroTeaser} from "./components/HeroTeaser.js";
import {ProductCard} from "./components/ProductCard.js";
import {HomeComponent} from "./components/HomeComponent.js";
import {ContactComponent} from "./components/ContactComponent.js";
import {AboutComponent} from "./components/AboutComponent.js";
import {TodoComponent} from "./components/TodoComponent.js";
import {Router} from './kwm-js';
import {BlogComponent} from "./components/BlogComponent.js";
import {NavigationComponent} from "./components/NavigationComponent.js";
import {AiChatComponent} from "./components/AiChatComponent.js";
import {QuizComponent} from "./components/QuizComponent.js";
import{routes} from "./routes.js";
import {QuizModel} from "./models/QuizModel.js";

new Router(
    document.getElementById("kwmJS"),
    routes,
);

const quiz = new QuizModel();
window.quiz =quiz;

// Navigating / loading to the home page should display the Hero-Teaser & Product-Cards similar like in the example picture