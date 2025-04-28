"use strict";
import KWM_Component from '../core/kwm-component.js';
import KWM_Computed from '../core/kwm-computed.js';
import KWM_Observable from '../core/kwm-observable.js';
import { todoModelInstance } from '../models/TodoModel.js';

export default class TodoComponent extends KWM_Component {
    constructor() {
        super();

        this.todos = todoModelInstance.todos;
        this.newTodoText = new KWM_Observable('');

        this.openTodos = new KWM_Computed(() => {
            return this.todos.value.filter(todo => !todo.completed);
        }, [this.todos]);

        this.closedTodos = new KWM_Computed(() => {
            return this.todos.value.filter(todo => todo.completed);
        }, [this.todos]);

        this.todos.subscribe(() => this.render());
    }

    addTodo() {
        if (this.newTodoText.value.trim() !== '') {
            todoModelInstance.addTodo(this.newTodoText.value);
        }
        this.newTodoText.value = '';
    }

    removeTodo(todoId) {
        todoModelInstance.removeTodo(todoId);
    }

    toggleTodo(todoId) {
        todoModelInstance.toggleTodo(todoId);
    }

    template() {
        return `
            <div>
                <h2>Todo List</h2>

                <label for="newTodoText">New todo</label>
                <div class="input-group">
                    <input kwm-model-value="this.newTodoText" id="newTodoText" placeholder="New todo text" type="text" />
                    <button kwm-listen-click="this.addTodo()">Add Todo</button>
                </div>
                <h3>Open Todos (${this.openTodos.value?.length})</h3>
                <ul>
                    ${this.openTodos.value.map(todo => `
                        <li>
                            <input id="todo-${todo.id}" kwm-listen-click="this.toggleTodo(${todo.id})" type="checkbox" ${todo.completed ? 'checked' : '' } />
                            <span class="${todo.completed ? 'completed' : ''}">
                                ${todo.text}
                            </span>
                            <button class="bg-red" kwm-listen-click="this.removeTodo(${todo.id})" aria-label="Remove Todo" title="Remove Todo">
                                <img src="delete-icon.svg" width="16" height="16" />
                            </button>
                        </li>
                    `).join('')}

                    </ul>
                ${this.openTodos.value?.length == 0 ? '<div>No open todos</div>': ''}

                <h3>Closed Todos (${this.closedTodos.value?.length})</h3>
                <ul>
                    ${this.closedTodos.value.map(todo => `
                        <li>
                            <input id="todo-${todo.id}" 
                                kwm-listen-click="this.toggleTodo(${todo.id})" 
                                type="checkbox" 
                                ${todo.completed ? 'checked' : '' } />
                            <span class="${todo.completed ? 'completed' : ''}">
                                ${todo.text}
                            </span>
                            <button class="bg-red" kwm-listen-click="this.removeTodo(${todo.id})" aria-label="Remove Todo" title="Remove Todo">
                                <img src="delete-icon.svg" width="16" height="16" />
                            </button>
                        </li>
                    `).join('')}

                    </ul>
                    ${this.closedTodos.value?.length == 0 ? '<div>No closed todos</div>': ''}

            </div>
        `;
    }
}

customElements.define('todo-component', TodoComponent);
