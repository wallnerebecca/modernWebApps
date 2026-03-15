'use strict';

import {Component, html} from '../kwm-js';

/**
 * This is the page home component and will be rendered when the user navigates to the '/' home route.
 *
 * You need to create the base class 'Component' first before using me!
 **/
export class AboutComponent extends Component {
    // Any component data goes here in the constructor
    text = 'About me ℹ️';

    // render function -> defines shape of the component
    render() {
        return html`
        <section id="main_content">
            <h1>${this.text}</h1>
            <p>
                Hello! I am Jane Doe!
            </p>
            <p><a href="#/contact">Contact us!</a></p>
            <p><a href="#/home">Go Home!</a></p>
        </section>
        `;
    }
}

// usage in HTML like: <home-component></home-component>
// usage in JS like: const homeComponent = new HomeComponent();
customElements.define('about-component', AboutComponent);