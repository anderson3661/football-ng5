import { strictEqual } from "assert";

// Team(s) model
interface TeamModel {
    teamName: string,
    isATopTeam: boolean
}

export interface TeamsModel extends Array<TeamModel> { }


// Fixture(s) model
interface FixturesDateModel {
    date: string;
    numberOfMatches: string;
}

export interface FixturesDatesModel extends Array<FixturesDateModel> { }

interface FixtureModel {
    homeTeam: string,
    awayTeam: string,
    homeTeamsScore?: number,
    awayTeamsScore?: number,
    homeTeamsGoals?: string,
    awayTeamsGoals?: string,
    injuryTime1stHalf?: number,
    injuryTime2ndHalf?: number,
    maxNumberOfMinutes: number
}

interface FixturesModel extends Array<FixtureModel> { }

export interface SetOfFixturesModel {
    dateOfSetOfFixtures: string,
    fixtures: FixturesModel
}

export interface AllFixturesModel extends Array<SetOfFixturesModel> { }


// Table(s) model
export interface TableModel {
    teamName: string,
    played: number,
    won: number,
    drawn: number,
    lost: number,
    goalsFor: number,
    goalsAgainst: number,
    goalDifference: number,
    points: number,
    form: string[],
    homeWon: number,
    homeDrawn: number,
    homeLost: number,
    homeGoalsFor: number,
    homeGoalsAgainst: number,
    awayWon: number,
    awayDrawn: number,
    awayLost: number,
    awayGoalsFor: number,
    awayGoalsAgainst: number
}

export interface TablesModel extends Array<TableModel> { }


// Misc Info model
export interface MiscInfoModel {
    season: string,
    seasonStartDate: string,
    dateOfLastSetOfFixtures: string,
    factorBaseForRandomMultiplier: number,
    factorAwayTeam: number,
    factorIsNotATopTeam: number,
    factorLikelihoodOfAGoalDuringASetPeriod: string,
    factorIsItAGoal: number,
    numberOfFixturesForSeason: number,
    matchUpdateInterval: number,
    numberOfTeams: number
}

// App Data model
export interface AppDataModel {
    miscInfo: MiscInfoModel;
    teamsForSeason: TeamsModel;
    allFixtures: AllFixturesModel;
    latestTable: TablesModel;
}


// Set of Fixtures Controller model
export interface SetOfFixturesControllerModel {
    dateOfThisSetOfFixtures: string,
    factorBaseForRandomMultiplier: number,
    factorLikelihoodOfAGoalDuringASetPeriod: any[],
    factorAwayTeam: number,
    factorIsNotATopTeam: number,
    factorIsItAGoal: number,
    maxNumberOfMinutes: number,
    minutesPlayed: number,
    minutesInfo: string,
    maxInjuryTime1stHalf: number,
    maxInjuryTime2ndHalf: number,
    matchUpdateInterval: number,
    isFirstHalf: boolean,
    statutoryMinutes: number,
    startFixturesButtonText: string,
    startFixturesButtonEnabled: boolean,
    fixturesInPlay: boolean,
    versusBetweenTeams: string,
    teamIn1stPlaceInTable: string,
    teamIn2ndPlaceInTable: string,
    teamIn3rdPlaceInTable: string
}
