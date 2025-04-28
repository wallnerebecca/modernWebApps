import KWM_Bindings from "./kwm-bindings.js";
import KWM_Observable from "./kwm-observable.js";

/**
 * KWM Component
 *
 * A component is a class / HTMLELement that can be rendered into the DOM.
 * Every component has a template function that returns a string of HTML, that describes how the component looks like.
 * The template function is called every time the component is rendered.
 *
 * @author Jakob Osterberger - 2023
 */
export default class KWM_Component extends HTMLElement {
	// Important: WebComponent constructor does not allow any arguments!
	// Use html attributes to pass in data
	constructor() {
		super();

		this._bindings = null;
		this._mounted = false;
		this._focusedElem = null;
		this._templateCache = "";
	}

	/**
	 * Necessary beause we use the WebComponents API
	 */
	connectedCallback() {
		if (!this._mounted) {
			this.render();
			// (Optional) Lifecycle-Hook function for first render
			this.onFirstRender();
			this._mounted = true;
		}
	}

	/**
	 * Hook function running after rendering
	 */
	onRender() {
		// onRender: override me - I run every time the component is rendered
		return;
	}

	/**
	 * (Optional) Hook function running only once after rendering the first time
	 */
	onFirstRender() {
		// onFirstRender: override me - I run only once after the component is rendered the first time
		return;
	}

	/**
	 * Render the component into a container Element
	 */
	render(container) {
		this.catchFocus(); // (Optional) Save current focus

		const newTemplate = this.template(this);
		this._templateCache = newTemplate;
		this.innerHTML = newTemplate;

		// If a container is passed, render the component into the container
		if (container) {
			this._mounted = true;
			// Remove all children from the container
			container.innerHTML = "";
			// Append the component to the container -> preserve the component instance (setting innerHTML would create a new instance)
			container.appendChild(this);
		}

		// Automatically apply bindings after rendering
		if (!this._bindings) {
			this._bindings = new KWM_Bindings(this, this);
		}
		this._bindings.bind();

		this.resetFocus(); // (Optional)

		// Lifecycle-Hook function that runs every time the component is rendered
		this.onRender();
	}

	/**
	 * Manually register dependencies to re-render component when dependency (observable) changes
	 * @param observables give me all observables that are used in the template for conditional rendering e.g. ${this.observable.get() ? '...' : '...'} or
	 * list rendering e.g. ${this.observable.get().map(item => '...').join('')} or
	 * in an show-if expression e.g. <div ?show-if="this.observable.value !== 0"></div>
	 */
	registerRenderDependencies(observables = []) {
		observables.forEach((obs) => {
			if (obs instanceof KWM_Observable) {
				obs.subscribe(() => this.render());
			} else {
				console.error(
					`${this.constructor.name} Error: array element is not an observable that can be registered for rendering!`,
					obs,
				);
			}
		});
	}

	/**
	 * Automatically register all observables of Component as Render Dependencies - !! attention may lead to unwanted effects or potential infinite loops
	 **/
	autoRegisterRenderDependencies(objObservables = { ...this, ...this.props }) {
		Object.values(objObservables).forEach((obs) => {
			if (obs instanceof KWM_Observable) {
				obs.subscribe(() => this.render());
			}
		});
	}

	// (Optional) Emit custom events from the component to the outside world (e.g. to the parent component)
	emit(eventName, detail = {}, opts = {}) {
		const customEvent = new CustomEvent(eventName, {
			bubbles: true,
			detail: detail,
			...opts,
		});

		this.dispatchEvent(customEvent);
	}

	// (optional) Catch the current focus
	catchFocus() {
		if (this.contains(document.activeElement)) {
			this._focusedElem = document.activeElement;
		}
	}

	// (optional) Reset focus to the last focused element
	resetFocus() {
		const newFocusedElem = this._focusedElem?.id
			? this.querySelector(`#${this._focusedElem?.id}`)
			: null;
		if (
			newFocusedElem &&
			newFocusedElem !== this._focusedElem &&
			this._focusedElem?.tagName === "INPUT"
		) {
			newFocusedElem?.focus();
		}
	}

	template(templateData) {
		throw new Error(
			"template: override me - return a string of HTML that describes how the component looks like",
		);
	}
}
