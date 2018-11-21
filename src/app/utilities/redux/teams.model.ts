interface TeamModel {
    teamName: string,
    isATopTeam: boolean
}

export interface TeamsModel extends Array<TeamModel> { }