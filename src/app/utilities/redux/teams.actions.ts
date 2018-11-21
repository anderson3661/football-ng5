import { Action } from '@ngrx/store';

export const UPDATE_TEAMS = "[Team] Update";

export class UpdateTeams implements Action {
    readonly type = UPDATE_TEAMS;

    constructor(public payload: string) { }
}

export type All
    = UpdateTeams    
    ;

// export const TOGGLE_TODO = "[Todo] Toggle";
// export const DELETE_TODO = "[Todo] Delete";
// export const DELETE_ALL_TODOS = "[Todos] Delete All";

// export class CreateTodo implements Action {
//     readonly type = CREATE_TODO;

//     constructor(public payload: string) {}
// }

// export class ToggleTodo implements Action {
//     readonly type = TOGGLE_TODO;
// }

// export class DeleteTodo implements Action {
//     readonly type = DELETE_TODO;
// }

// export class DeleteAllTodos implements Action {
//     readonly type = DELETE_ALL_TODOS;
// }

// export type All
//     = CreateTodo
//     | ToggleTodo
//     | DeleteTodo
//     | DeleteAllTodos    
//     ;

