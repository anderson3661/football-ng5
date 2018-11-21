export interface Roles {
    default?: boolean,
    subscriber?: boolean,
    admin? : boolean
}

export interface User {
    uid: string,
    email: string,
    roles: Roles
}
