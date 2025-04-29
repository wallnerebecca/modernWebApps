import KWM_Observable from "./kwm-observable.js";
import KWM_Computed from "./kwm-computed.js";
import KWM_Component from "./kwm-component.js";

/**
 * KWM Bindings
 *
 * enables declarative uni- and bidirectional data-binding of attributes of HtmlElements to Observables
 *
 * @example new KWM_Bindings({lastName: new KWM_Observable('Osterberger')}, inputElement)
 * // in template <input :value="lastName" /> binds the HtmlElement Attribute 'value' to the observable
 *
 * @author Jakob Osterberger - 2025
 * @reference inspired by https://blog.jeremylikness.com/blog/client-side-javascript-databinding-without-a-framework/,
 * https://dev.to/proticm/vanilla-js-data-binding-with-classes-from-scratch-48b1 and
 * https://stackoverflow.com/questions/16483560/how-to-implement-dom-data-binding-in-javascript
 */
export default class KWM_Bindings {
	/**
	 *
	 * @param {KWM_Component|object} data - Give me an object containing Observables with their keys corresponding to your data-bind properties (e.g. KWM_Component)
	 * @param {KWM_Component|HTMLElement} uiElement - Give me the uiElement element where to apply the bindings (e.g. KWM_Component)
	 */
	constructor(data, uiElement = null) {
		this.component = data; // The State / Data / Object containing Observables ~ a KWM_Component
		this.uiElement = uiElement ?? this.component; // The UI / View / HTMLElement ~ a KWM_Component
		this.subscriptions = new Set(); // Set of all subscriptions

		// Pattern: :attributeName="variableName" / bind-attributeName="this.variableName"
		this.valueBindRegex = /\s((:|bind-|kwm-bind-)(\w+))="([^"]+)"/g;
		// Pattern: @listenerType="listenerFunctionName" / on-listenerType="this.listenerFunctionName(event)"
		this.listenerBindRegex = /\s((@|on-|kwm-listen-)(\w+))="([^"]+)"/g;
		// Pattern: $attributeName="variableName" / model-attributeName="this.variableName"
		this.modelBindRegex = /\s((\$|model-|kwm-model-)(\w+))="([^"]+)"/g;
		// Pattern: #ref="variableName" / ref="this.variableName"
		this.refBindRegex = /\s(#?ref|kwm-ref)="([^"]+)"/g;
		// Pattern ?if="variableName.value" / if="this.variableName.value" / show-if="this.variableName.value"
		this.showIfBindRegex = /\s(\??if|kwm-if|show-if)="([^"]+)"/g;
	}

	/**
	 * Applies bindings of it's KWM_Component
	 */
	bind() {
		// Unsubscribe and clear all old subscriptions -> not do cause memory leaks
		this.subscriptions.forEach((unsubscribe) =>
			unsubscribe ? unsubscribe() : null,
		);
		this.subscriptions.clear();

		// Apply bindings
		this.applyBindings(this.uiElement);
	}

	/**
	 * Evaluates and applies bindings of a uiElement.
	 * ⚠️ Needs to run AFTER the template / component was rendered, because it looks for the component in the DOM!
	 * @param {HTMLElement|KWM_Component} uiElement
	 */
	applyBindings(uiElement) {
		const uiElementHtmlString =
			"_templateCache" in uiElement
				? uiElement._templateCache
				: uiElement.innerHTML;

		// Bind HTML element attributes & component properties (1-way-data-binding)
		for (const [x, selector, _y, attributeName, jsCodeExpr] of uiElementHtmlString.matchAll(this.valueBindRegex)) {
			uiElement
				.querySelectorAll(
					`[${selector.includes(":") ? "\\" : ""}${selector}="${jsCodeExpr}"]`,
				)
				.forEach((elem) => {
					const valueFn = () =>
						new Function(`return ${jsCodeExpr}`).apply(this.component);
					const variableName = jsCodeExpr.trim().replace("this.", "");
					const matchedObservable = this.component[variableName];
					const dependencies =
						KWM_Bindings.getDependentObservablesFromJsExpression(
							jsCodeExpr,
							this.component,
						);
					const data =
						matchedObservable ??
						(dependencies?.length > 0
							? new KWM_Computed(valueFn, dependencies)
							: valueFn());

					if (
						elem instanceof KWM_Component &&
						elem.props &&
						attributeName in elem.props
					) {
						this.subscriptions.add(
							KWM_Bindings.bindProperty(elem, data, attributeName),
						);
					} else {
						this.subscriptions.add(
							KWM_Bindings.bindAttribute(elem, data, attributeName),
						);
					}

					if (data === undefined) {
						console.warn(
							`Bindings Warning: ${x} - Expression "${jsCodeExpr}" resolved to undefined in "${this.component.constructor.name}"`,
							this.component,
						);
					}
				});
		}

		// Bind Listeners
		for (const [x, selector, _y, listenerType, jsCodeExpr] of uiElementHtmlString.matchAll(this.listenerBindRegex)) {
			uiElement
				.querySelectorAll(
					`[${selector.includes("@") ? "\\" : ""}${selector}="${jsCodeExpr}"]`,
				)
				.forEach((elem) => {
					const listenerFunctionName = jsCodeExpr.trim().replace("this.", "");
					const listenerFunction =
						listenerFunctionName in this.component
							? this.component[listenerFunctionName].bind(this.component)
							: (event) =>
									new Function(jsCodeExpr).apply(this.component, [event]);

					if (listenerFunction !== undefined) {
						KWM_Bindings.bindSingleEventListener(
							elem,
							listenerType,
							listenerFunction,
						);
					} else
						console.error(
							`Bindings Error: ${x} - Listener Function "${jsCodeExpr}" does not exist in "${this.component.constructor.name}" or expression is invalid`,
							this.component,
						);
				});
		}

		// 2-way Data binding
		for (const [x, selector, _y, attrName, observableName] of uiElementHtmlString.matchAll(this.modelBindRegex)) {
			uiElement
				.querySelectorAll(
					`[${selector.includes("$") ? "\\" : ""}${selector}="${observableName}"]`,
				)
				.forEach((elem) => {
					const observable =
						this.component[observableName.trim().replace("this.", "")];
					if (observable !== undefined) {
						this.subscriptions.add(
							KWM_Bindings.modelAttribute(elem, observable, attrName),
						);
					} else
						console.error(
							`Bindings Error: ${x} - Observable "${observableName}" does not exist in "${this.component.constructor.name}"`,
							this.component,
						);
				});
		}

		// Element Reference binding
		for (const [x, selector, variableName] of uiElementHtmlString.matchAll(this.refBindRegex)) {
			uiElement
				.querySelectorAll(
					`[${selector.includes("#") ? "\\" : ""}${selector}="${variableName}"]`,
				)
				.forEach((elem) => {
					if (variableName.trim().replace("this.", "") in this.component) {
						KWM_Bindings.bindElementReference(
							elem,
							variableName.trim().replace("this.", ""),
							this.component,
						);
					} else
						console.error(
							`Bindings Error: ${x} - Property variable "${variableName}" does not exist ${this.component.constructor.name}`,
							this.component,
						);
				});
		}

		// Show If Binding
		for (const [x, selector, jsCodeExpr] of uiElementHtmlString.matchAll(this.showIfBindRegex)) {
			uiElement
				.querySelectorAll(
					`[${selector.includes("?") ? "\\" : ""}${selector}="${jsCodeExpr}"]`,
				)
				.forEach((elem) => {
					const valueFn = () =>
						new Function(`return ${jsCodeExpr}`).apply(this.component);
					const variableName = jsCodeExpr.trim().replace("this.", "");
					const matchedObservable = this.component[variableName];
					const dependencies =
						KWM_Bindings.getDependentObservablesFromJsExpression(
							jsCodeExpr,
							this.component,
						);
					const data =
						matchedObservable ??
						(dependencies?.length > 0
							? new KWM_Computed(valueFn, dependencies)
							: valueFn());

					if (data === undefined) {
						console.warn(
							`Bindings Warning: ${x} - Expression "${jsCodeExpr}" resolved to undefined in "${this.component.constructor.name}"`,
							this.component,
						);
					}

					this.subscriptions.add(KWM_Bindings.bindShowIf(elem, data));
				});
		}
	}

	/**
	 * Get tokens from a js expression e.g. "this.observable.value = 'test'" -> ["this", "observable", "value", "test"]
	 * @param {string} jsExpression
	 */
	static getJsExpressionTokens(jsExpression) {
		return jsExpression
			.replaceAll(
				/\s|"|'|`|\+|-|\*|\?|:|=|\(|\)|<|>|\|&|%|!|\{|\}|\[|\]/gm,
				".",
			)
			.split(".");
	}

	/**
	 * Extract dependent observables from a js expression
	 * @param {string} jsExpression
	 * @param {KWM_Component|object} objObservables
	 */
	static getDependentObservablesFromJsExpression(jsExpression, objObservables) {
		if (!jsExpression) {
			return;
		}
		const jsExprTokens = KWM_Bindings.getJsExpressionTokens(jsExpression);
		const previousToken = (index) => jsExprTokens[index - 1];
		const observableNames =
			jsExprTokens.filter((token, i) => {
				return (
					token &&
					previousToken(i) &&
					previousToken(i) === "this" &&
					objObservables[token] &&
					objObservables[token] instanceof KWM_Observable
				);
			}) ?? [];
		if (!observableNames || observableNames.length === 0) {
			return;
		}
		return observableNames.map((name) => objObservables[name]);
	}

	/**
	 * (optional) 2-way-data-binding (Data -> UI & UI -> Data).
	 * Binds the data of an observable to an input value. If the input value changes the observable is updated with the new value.
	 * @param {HTMLElement} elem
	 * @param {KWM_Observable} observable
	 * @param {string} attribute
	 * @returns {function|void} unsubscribe
	 */
	static modelAttribute(elem, observable, attribute = "value") {
		if (!(observable instanceof KWM_Observable)) {
			console.error(
				`Bindings Error: 2-way-databinding / modeling attribute "${attribute}" at ${elem.constructor.name} not possible since binding data is not an instance of an Observable`,
				elem,
				observable,
			);
			return;
		}

		// If applicable register input listeners to element
		if (
			(elem.tagName === "SELECT" || elem.tagName === "INPUT" || elem.tagName === "TEXTAREA") &&
			(attribute === "value" || attribute === "checked")
		) {
			KWM_Bindings.setSingleInputListener(elem, observable, attribute);
		}

		return KWM_Bindings.bindAttribute(elem, observable, attribute);
	}

	/**
	 * 1-way-data-binding (Data -> UI).
	 * Binds an attribute of an Element to a (observable) value.
	 * @param {HTMLElement} elem
	 * @param {KWM_Observable|any} data
	 * @param {string} attribute
	 * @returns {function|void} unsubscribe
	 */
	static bindAttribute(elem, data, attribute) {
		if (data instanceof KWM_Observable) {
			KWM_Bindings.setAttribute(elem, data.value, attribute);
			return data.subscribe(() =>
				KWM_Bindings.setAttribute(elem, data.value, attribute),
			);
		}

		KWM_Bindings.setAttribute(elem, data, attribute);
	}

	/**
	 * Set a attribute of an HTML element
	 * @param {HTMLElement} elem
	 * @param {string} value
	 * @param {string} attribute
	 */
	static setAttribute(elem, value, attribute) {
		let attributeName = KWM_Bindings.mapping[attribute] ?? attribute;

		if (attributeName === 'value' && (elem.type === 'checkbox' || elem.type === 'radio')) {
            attributeName = 'checked';
        } else if (attributeName in KWM_Bindings.attributesToRemoveOnFalsy && !value) {
            elem.removeAttribute(attributeName);
            return;
        }

		elem[attributeName] = value;
	}

	static mapping = {
		text: "innerText",
		innertext: "innerText",
		"inner-text": "innerText",
		html: "innerHTML",
		innerhtml: "innerHTML",
		"inner-html": "innerHTML",
	};

	static attributesToRemoveOnFalsy = ['disabled', 'hidden', 'readonly', 'required', 'checked'];

	/**
	 * 1-way-data-binding (UI -> Data).
	 * Binds the changes of a input element to an observable.
	 * @param {HTMLElement} inputElem
	 * @param {KWM_Observable} observable
	 * @param {string} attribute
	 */
	static setSingleInputListener(inputElem, observable) {
		if (inputElem.tagName === "SELECT") {
			inputElem.onchange = () =>
				(observable.value = inputElem.options[inputElem.selectedIndex].value);
		} else if (inputElem.type === "checkbox" || inputElem.type === "radio") {
			inputElem.onchange = () => (observable.value = inputElem.checked);
		} else {
			inputElem.onkeyup = () => (observable.value = inputElem.value);
			inputElem.onchange = () => (observable.value = inputElem.value);
		}
	}

	/**
	 * 1-way-data-binding (UI -> Data).
	 * Registers new event listener, skip if there already is the listener registered.
	 * Prevents infinit loops and multiple listeners due to (re)rendering.
	 * @param {HTMLElement} elem
	 * @param {string} type
	 * @param {function} callback
	 */
	static bindSingleEventListener(elem, type, callback) {
		if (!elem) {
			throw new Error(`🚨 Element is ${elem}`);
		}
		if (!Object.prototype.hasOwnProperty.call(elem, `on${type}`)) {
			elem[`on${type}`] = callback;
		}
	}

	/**
	 * Bind Component Property
	 * @param {KWM_Component} childComponent
	 * @param {KWM_Observable|any} data
	 * @param {string} propName
	 * @returns {function|void} unsubscribe
	 */
	static bindProperty(childComponent, data, propName) {
		if (data instanceof KWM_Observable) {
			childComponent.props[propName].value = data.value; // Set initial value inside child component
			return data.subscribe((value) => {
				childComponent.props[propName].value = value;
			});
		}

		childComponent.props[propName] = data;
	}

	/**
	 * Bind Element Reference
	 * @param {HTMLElement} elem
	 * @param {string} variableName
	 * @param {KWM_Component} componentData
	 */
	static bindElementReference(elem, variableName, componentData) {
		componentData[variableName] = elem;
	}

	/**
	 * Bind Show If
	 * @param {HTMLElement} elem
	 * @param {KWM_Observable|any} data
	 * @returns {function|void} unsubscribe
	 */
	static bindShowIf(elem, data) {
		if (data instanceof KWM_Observable) {
			KWM_Bindings.setDisplay(elem, data.value);
			return data.subscribe((value) => KWM_Bindings.setDisplay(elem, value));
		}

		KWM_Bindings.setDisplay(elem, data);
	}

	/**
	 * Set Display
	 * @param {HTMLElement} elem
	 * @param {boolean} shouldDisplay
	 */
	static setDisplay(elem, shouldDisplay) {
		if (!shouldDisplay) {
			elem.style.display = "none";
			return;
		}
		elem.style.display = "";
	}
}
