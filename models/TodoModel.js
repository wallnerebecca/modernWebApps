import KWM_Observable from "../core/kwm-observable.js";

class TodoModel {

    constructor() {
        this.todos = new KWM_Observable([]);
    }

    toggleTodo(id){
        this.todos.value = this.todos.value.map(todo => {
            if(todo.id == id){
                todo.completed = !todo.completed;
            }
            return todo;
        });
    }

    addTodo(todoText){
        const todo = {
            id: new Date().getTime(),
            text: todoText,
            completed: false
        }
        this.todos.value = [...this.todos.value, todo];
    }

    removeTodo(id){
        this.todos.value = this.todos.value.filter(todo => todo.id != id);
    }
}

// Singelton Instance of the Model - only one instance of the model is allowed
export const todoModelInstance = new TodoModel();
