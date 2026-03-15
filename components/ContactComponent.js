'use strict';

import {Component, html} from '../kwm-js';

/**
 * This is the page home component and will be rendered when the user navigates to the '/' home route.
 *
 * You need to create the base class 'Component' first before using me!
 **/
export class ContactComponent extends Component {
    // Any component data goes here in the constructor
    text = 'Contact me 📨';

    // render function -> defines shape of the component
    render() {
        return html`
        <section id="main_content">
            <h1>${this.text}</h1>
            <p>This is the contact page.</p>
            <address>
                <p>Jane Doe</p>
                <p>123 Main Street</p>
                <p>Cityville, Country</p>
                <p>Email: <a href="mailto:jane@doe.com">Jane Doe</a></p>
            </address>
            <p><a href="#/home">Go Home!</a></p>
        </section>
        `;
    }
}

// usage in HTML like: <home-component></home-component>
// usage in JS like: const homeComponent = new HomeComponent();
customElements.define('contact-component', ContactComponent);