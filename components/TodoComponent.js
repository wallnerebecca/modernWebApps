import {Component, html, observable, on} from "../kwm-js";

export class TodoComponent extends Component {
    todos = observable([
        { id: 1, text: "Learn KWM-JS", done: true },
        { id: 2, text: "Build something cool", done: false },
        { id: 3, text: "Ship it", done: false },
    ]);
    input = observable("");

    addTodo() {
        const newTodo = {
            id: Date.now(),
            done: false,
            text: this.input.get(),
        };

        const updatedTodos = [...this.todos.get(), newTodo];
        this.todos.set(updatedTodos);
        this.input.set("");
    }

    removeTodo(index) {
        const updatedTodos = this.todos.get().filter((todo, idx) => idx !== index);
        this.todos.set(updatedTodos);
    }

    toggleTodo(index) {
        const updatedTodos = this.todos.get().map((todo, idx) => {
            if (idx === index) {
                return { ...todo, done: !todo.done };
            }
            return todo;
        });

        this.todos.set(updatedTodos);
    }

    clearDone() {
        const updatedTodos = this.todos.get().filter((todo) => !todo.done);
        this.todos.set(updatedTodos);
    }

    render() {

        const remainingTodos = this.todos.get().filter((todo) => !todo.done).length;

        return html`
            <div class="todo-app">
                <h2 class="todo-app__title">Todo List</h2>
                <div class="todo-input">
                    <input
                        type="text"
                        placeholder="What needs to be done?"
                        value="${this.input.get()}"
                        ${on('input', (e) => this.input.set(e.target.value))}
                    />
                    <button
                        class="todo-add-btn"
                        ${on('click', () => this.addTodo())}
                    >Add</button>
                </div>
                
                <ul class="todo-list">
                    
                    ${this.todos.get().map((todo, idx) => html`
                        <li class="todo-item ${todo.done ? 'done' : ''}">
                            <input
                                class="todo-checkbox"
                                type="checkbox"
                                ${todo.done ? 'checked' : ''}
                                ${on('change', () => this.toggleTodo(idx))}
                            />
                            <span class="todo-text">${todo.text}</span>
                            <button 
                                class="todo-remove-btn" 
                                title="Remove"
                                ${on('click', () => this.removeTodo(idx))}
                            >×</button>
                        </li>
                    `)}
                    
                </ul>
                <div class="todo-footer">
                    <span class="todo-count">${remainingTodos} remaining</span>
                    <button
                        class="todo-clear-btn"
                        ${on('click', () => this.clearDone())}
                    >Clear done
                    </button>
                </div>
            </div>
        `;
    }
}

customElements.define('todo-component', TodoComponent);
