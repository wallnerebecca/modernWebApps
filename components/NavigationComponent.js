'use strict';

import {Component, html} from '../kwm-js';
import {routes} from '../routes.js';

/**
 * This is the page home component and will be rendered when the user navigates to the '/' home route.
 *
 * You need to create the base class 'Component' first before using me!
 **/
export class NavigationComponent extends Component {
    // Any component data goes here in the constructor
    text = 'Welcome HOME 🥳';

    // render function -> defines shape of the component
    render() {
        return html`
            <nav id="kwmJS-navigation">
                <ul>
                    ${routes.map(route => html`<li><a href="#${route.path}">${route.name}</a></li>`)}
                </ul>
            </nav>
        `;
    }
}

// usage in HTML like: <home-component></home-component>
// usage in JS like: const homeComponent = new HomeComponent();
customElements.define('navigation-component', NavigationComponent);