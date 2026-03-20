'use strict';

import {HomeComponent} from "./components/HomeComponent.js";
import {ContactComponent} from "./components/ContactComponent.js";
import {AboutComponent} from "./components/AboutComponent.js";
import {TodoComponent} from "./components/TodoComponent.js";
import {BlogComponent} from "./components/BlogComponent.js";
import {QuizComponent} from "./components/QuizComponent.js";




export const routes = [
    { path: "/", name: "Home", component: new HomeComponent() },
    { path: "/about", name: "About", component: new AboutComponent() },
    { path: "/contact", name: "Contact", component: new ContactComponent() },
    { path: "/todo", name: "Todo", component: new TodoComponent() },
    { path: "/blog", name: "Blog", component: new BlogComponent()},
    { path:"/quiz", name: "Quiz", component: new QuizComponent() }
]