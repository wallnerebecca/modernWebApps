"use strict";

import KWM_Component from "../core/kwm-component.js";

export default class HeroTeaserComponent extends KWM_Component {
  constructor() {
    super();
  }

  template() {
    return /*html*/ `
            <section class="hero-teaser" style="background-image: url(${this.getAttribute("background-image") ?? "https://picsum.photos/seed/example/1080/1920"})">
                <div class="content">
                    <h1>${this.getAttribute("heading") ?? "Hero Teaser Heading"}</h1>
                    <p>${this.getAttribute("text") ?? "Hero Teaser Text - I am very reusable"}</p>
                    <p><a class="cta" href="${this.getAttribute("link") ?? "#/"}">${this.getAttribute("btn-text") ?? "Explore"}</a></p>
                </div>
            </section>
        `;
  }
}

customElements.define("hero-teaser-component", HeroTeaserComponent);
