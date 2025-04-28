import KWM_Observable from "./kwm-observable.js";

/**
 * KWM Computed
 *
 *
 * @template T - The type of the value stored in the Observable
 * @example const first = obs("Jeremy");
 * const last = obs("Likness");
 * const full = compute(() => `${first.value} ${last.value}`.trim(), [first, last]);
 * first.value = "Doreen";
 * console.log(full.value);
 * // logs "Doreen Likness" to the console
 *
 * @author Jakob Osterberger - 2023
 * @reference inspired by https://blog.jeremylikness.com/blog/client-side-javascript-databinding-without-a-framework/
 */
export default class KWM_Computed extends KWM_Observable {
	/**
	 * @param {function} valueFn - Give me a function returning a value
	 * @param {KWM_Observable[]} depObserverArr - Give me an Array of Observers that the valueFn depends on
	 */
	constructor(valueFn, dependantObserversArr = []) {
		super(valueFn());

		const listenerFn = () => {
			this._value = valueFn();
			this.notify();
		};

		dependantObserversArr.forEach((dep) => {
			if (!("subscribe" in dep)) {
				console.error(
					dep,
					" dependency is not a valid observable - dependency needs a subscribe method",
				);
				return;
			}
			dep.subscribe(listenerFn);
		});
	}

	get value() {
		return this._value;
	}

	set value(_) {
		throw "🚨 Cannot set computed property";
	}

	update(_) {
		throw "🚨 Cannot set computed property";
	}

	set(_) {
		throw "🚨 Cannot set computed property";
	}
}

/**
 * Convenience shorthand method
 * @template T
 * @type {<T>(valueFn: (v?: T) => T, depObserverArr?: KWM_Observable[]) => KWM_Computed<T>}
 */
export const compute = (valueFn, depObserverArr = []) =>
	new KWM_Computed(valueFn, depObserverArr);
