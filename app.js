'use strict';

import {HeroTeaser} from "./components/HeroTeaser.js";
import {ProductCard} from "./components/ProductCard.js";
import {HomeComponent} from "./components/HomeComponent.js";
import {ContactComponent} from "./components/ContactComponent.js";
import {AboutComponent} from "./components/AboutComponent.js";
import {TodoComponent} from "./components/TodoComponent.js";
import {Router} from './kwm-js';
import {BlogComponent} from "./components/BlogComponent.js";

new Router(
    document.getElementById("kwmJS"),
    [
        { path: "/", name: "Home", component: new HomeComponent() },
        { path: "/about", name: "About", component: new AboutComponent() },
        { path: "/contact", name: "Contact", component: new ContactComponent() },
        { path: "/todo", name: "Todo", component: new TodoComponent() },
        { path: "/blog", name: "Blog", component: new BlogComponent()}
    ],
);

// Navigating / loading to the home page should display the Hero-Teaser & Product-Cards similar like in the example picture