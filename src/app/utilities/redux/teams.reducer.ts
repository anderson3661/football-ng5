// import { Todo } from './todo.model';
// import * as TodoActions from './todo.actions';
import * as Store from './store';
// import { IAppState, INITIAL_STATE } from './store';

// export type Action = TodoActions.All;


// const defaultState: Todo = {
//     id: null,
//     description: '',
//     responsibility: '',
//     priority: 'medium',
//     isCompleted: false
// }

const newState = (state, newData) => {
    return Object.assign({}, state, newData)
}

// export function todoReducer(state: Store.IAppState = Store.INITIAL_STATE, action) {
export function todoReducer(state = Store.INITIAL_STATE, action) {
    console.log(action.type, state);

    // switch (action.type) {
    //     case TodoActions.CREATE_TODO:
    //         action.todo.id = state.todos.length + 1;
    //         return newState(state, { todos: state.todos.concat(Object.assign({}, action.todo)), lastUpdate: new Date() });
    //     case TodoActions.TOGGLE_TODO:
    //         let todo = state.todos.find(t => t.id === action.id);
    //         let index = state.todos.indexOf(todo);
    //         return newState(state, {
    //             todos: [ ...state.todos.slice(0, index),
    //             Object.assign({}, todo, {isCompleted: !todo.isCompleted}),
    //             ...state.todos.slice(index + 1)],
    //             lastUpdated: new Date()
    //             });
    //     case TodoActions.DELETE_TODO:
    //         return newState(state, {
    //             todos: state.todos.filter(t => t.id !== action.id),
    //             lastUpdated: new Date()
    //             });
    //     case TodoActions.DELETE_ALL_TODOS:
    //         return newState(state, { 
    //             todos: [],
    //             lastUpdated: new Date() });
    //     default:
    //         return state;
    // }
}