"use strict";
import HomeComponent from "./components/HomeComponent.js";
import NotFoundComponent from "./components/NotFoundComponent.js";
import ContactComponent from "./components/ContactComponent.js";
import AboutComponent from "./components/AboutComponent.js";
import HeroTeaserComponent from "./components/HeroTeaserComponent.js";
import TodoComponent from "./components/TodoComponent.js";
import QuizComponent from "./components/QuizComponent.js";
import AiChatComponent from "./components/AiChatComponent.js";

import KWM_Route from "./core/kwm-route.js";
import KWM_Router from "./core/kwm-router.js";

const myRouter = new KWM_Router({
  container: document.getElementById("kwmJS"),
  routes: [
    new KWM_Route({
      slug: "/",
      name: "Home",
      component: new HomeComponent(),
    }),
    new KWM_Route({
      slug: "/about",
      name: "About",
      component: new AboutComponent(),
    }),
    new KWM_Route({
      slug: "/todo",
      name: "Todo",
      component: new TodoComponent(),
    }),
    new KWM_Route({
      slug: "/contact",
      name: "Contact",
      component: new ContactComponent(),
      // (Bonus) make sure if the user is allowed to see the component - when not - redirect to 404
      canRender: () =>
        confirm("🛡️ Security check: Everything ok?")
          ? true
          : KWM_Router.redirect("/404"),
    }),
    new KWM_Route({
      slug: "/404",
      name: "Not Found",
      component: new NotFoundComponent(),
    }),
    
  ],
  slugHome: "/",
  slugNotFound: "/404",
});

myRouter.init();

// Navigating to the home page should display the Hero-Teaser similar like in the example picture
