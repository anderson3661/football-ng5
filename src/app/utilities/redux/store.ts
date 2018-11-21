import { TeamsModel } from './teams.model';

export interface Todo {
    id: string,
    description: string,
    responsibility: string,
    priority: string,
    isCompleted: boolean
}

export interface ITeamState {
    todos: Todo[];
    lastUpdated: Date;
}

export const INITIAL_STATE: ITeamState = {
    todos: [{
        id: null,
        description: '',
        responsibility: '',
        priority: 'medium',
        isCompleted: false
    }],
    lastUpdated: null
}

interface TeamModel {
    teamName: string,
    isATopTeam: boolean
}

// const INITIAL_STATE: Todo = {
//     id: null,
//     description: '',
//     responsibility: '',
//     priority: 'medium',
//     isCompleted: false
// }

// export function rootReducer(state, action) {
//     return state;
// }