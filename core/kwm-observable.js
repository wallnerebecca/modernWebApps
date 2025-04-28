/**
 * KWM Observable
 *
 * A object that can be observed for changes. When the value changes, all subscribers are notified.
 *
 * @example
 * const name = obs("Jeremy");
 * name.subscribe((newVal) => console.log(`Name is: ${newVal}`));
 * name.set("Doreen");
 * name.update(value => value + ' Likeness');
 * name.value = 'Back to Jeremy';
 * // logs "Name is: Doreen" to the console
 * // logs "Name is: Doreen Likeness" to the console
 * // logs "Name is: Back to Jeremy" to the console
 * @template T - The type of the value stored in the Observable
 * @author Jakob Osterberger - 2023
 * @reference inspired by https://blog.jeremylikness.com/blog/client-side-javascript-databinding-without-a-framework/
 */
export default class KWM_Observable extends Set {
	/**
	 * @param {T} initialValue - Give me the initial value for your Observable
	 */
	constructor(initialValue) {
		super();
		this._value = initialValue;
	}

	notify() {
		this.forEach((listenerFn) => listenerFn(this._value));
	}

	subscribe(listenerFn = (_value) => {}) {
		this.add(listenerFn);
		return () => this.delete(listenerFn);
	}

	set(newValue, notifyListeners = true) {
		if (newValue !== this._value) {
			this._value = newValue;
			notifyListeners && this.notify();
		}
	}

	get() {
		return this._value;
	}

	get value() {
		return this._value;
	}

	set value(newValue) {
		this.set(newValue);
	}

	toJSON() {
		return this.value;
	}
	valueOf() {
		return this.value;
	}
	toString() {
		return String(this.value);
	}

	peek() {
		return this._value;
	}
}

// Convenience shorthand method
export const obs = (value) => new KWM_Observable(value);
