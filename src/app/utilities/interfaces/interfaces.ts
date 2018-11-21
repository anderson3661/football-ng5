import { Fixture } from '../classes/fixture';


// Team(s) model
interface TeamModel {
    teamName: string,
    isATopTeam: boolean
}

export interface TeamsModel extends Array<TeamModel> { }


// Fixture(s) model
interface FixturesDateModel {
    date: string;
    numberOfFixtures: string;
}

export interface FixturesDatesModel extends Array<FixturesDateModel> { }

export interface FixtureModel {
    homeTeam: string,
    awayTeam: string,
    dateOfFixture?: string,
    timeOfFixture?: string,
    homeTeamsScore?: number,
    awayTeamsScore?: number,
    homeTeamsGoals?: string,
    awayTeamsGoals?: string,
    isFirstHalf?: boolean,
    injuryTimeFirstHalf?: number,
    injuryTimeSecondHalf?: number,
    statutoryMinutes?: number
    maxNumberOfMinutes?: number,
    minutesPlayed?: number,
    minutesInfo?: string,
    hasFixtureFinished?: boolean
}

export interface FixturesModel extends Array<FixtureModel> { }

export interface SetOfFixturesModel {
    dateOfSetOfFixtures: string,
    fixtures: FixturesModel
}

export interface AllFixturesModel extends Array<SetOfFixturesModel> { }

export interface LatestFixturesModel extends Array<Fixture> { }

export interface SetOfLatestFixturesModel {
    dateOfSetOfFixtures: string,
    fixtures: LatestFixturesModel
}

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
    numberOfFixturesForSeason: number,    
    numberOfTeams: number,
    haveSeasonsFixturesBeenCreated: boolean,
    hasSeasonStarted: boolean,
    hasSeasonFinished: boolean,
    goalFactors: GoalFactorsModel,
    dataStorage: string
}

export interface GoalFactorsModel {
    isAwayTeam: number,
    isNotATopTeam: number,
    baseForRandomMultiplier: number,
    likelihoodOfAGoalDuringASetPeriod: string,
    isItAGoal: number,
    fixtureUpdateInterval: number
}

// App Data model
export interface AppDataModel {
    miscInfo: MiscInfoModel;
    teamsForSeason: TeamsModel;
    setsOfFixtures: AllFixturesModel;
    latestTable: TablesModel;
}

// Team Stats Controller model
export interface TeamStatModel {
    dateOfFixture: string,    
    homeTeam: string,
    awayTeam: string,
    homeTeamsScore: number,
    awayTeamsScore: number,
    homeTeamsGoals: string,
    awayTeamsGoals: string,
    winDrawLoss: string;
    positionInTable: number,
    hasFixtureFinished: boolean    
}

export interface TeamStatsModel extends Array<TeamStatModel> { }

