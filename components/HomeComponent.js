'use strict';

import {Component, html} from '../kwm-js';

/**
 * This is the page home component and will be rendered when the user navigates to the '/' home route.
 *
 * You need to create the base class 'Component' first before using me!
 **/
export class HomeComponent extends Component {
    // Any component data goes here in the constructor
    text = 'Welcome HOME 🥳';

    // render function -> defines shape of the component
    render() {
        return html`
        <section id="main_content">
            <h1>🏠 ${this.text}</h1>
            <p>Congratulations! You have successfully created your first component and rendered it.</p>
            <p><a href="#/contact">Contact us!</a></p>
            <p><a href="#/i-dont-exist">I lead to a non existent page</a></p>

            <div style="margin-bottom: 10px">
                <hero-teaser></hero-teaser>
            </div>
            <div class="product-grid">
                <product-card></product-card>
                <product-card></product-card>
                <product-card></product-card>
            </div>
        </section>
        `;
    }
}

// usage in HTML like: <home-component></home-component>
// usage in JS like: const homeComponent = new HomeComponent();
customElements.define('home-component', HomeComponent);