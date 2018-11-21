import { DataService } from '../services/data.service';
import { MiscInfoModel, TeamsModel, FixtureModel } from '../interfaces/interfaces';
import * as helpers from '../helper-functions/helpers';

const EXTRA_MINUTES_FIRST_HALF = 5;
const EXTRA_MINUTES_SECOND_HALF = 9;

const HALF_TIME = "Half-Time";
const FULL_TIME = "Full-Time";


export class Fixture {

    public dateOfFixture: string;
    public timeOfFixture: string;
    public homeTeam: string;
    public awayTeam: string;
    public homeTeamsScore: number;
    public awayTeamsScore: number;
    public homeTeamsGoals: string;
    public awayTeamsGoals: string;
    public isFirstHalf: boolean;
    public injuryTimeFirstHalf: number;
    public injuryTimeSecondHalf: number;
    public statutoryMinutes: number;
    public maxNumberOfMinutes: number;
    public minutesPlayed: number;
    public minutesInfo: string;
    public hasFixtureFinished: boolean;

    private goalFactors: any[];


    constructor(private fixture: FixtureModel,
        private miscInfo: MiscInfoModel,
        private teams: TeamsModel) {

        this.timeOfFixture = this.fixture.timeOfFixture;
        this.homeTeam = this.fixture.homeTeam;
        this.awayTeam = this.fixture.awayTeam;
    }


    public setUpFixture(): void {
        let goalFactorsSource: string;

        this.isFirstHalf = true;
        this.hasFixtureFinished = false;
        this.minutesPlayed = 0;
        this.minutesInfo = '';

        this.injuryTimeFirstHalf = Math.floor(Math.random() * EXTRA_MINUTES_FIRST_HALF + 1);
        this.injuryTimeSecondHalf = Math.floor(Math.random() * EXTRA_MINUTES_SECOND_HALF + 1);

        // Goal Factors on admin needs to be a string, and then it is transposed here into an array
        goalFactorsSource = this.miscInfo.goalFactors.likelihoodOfAGoalDuringASetPeriod;
        goalFactorsSource = goalFactorsSource.replace(/'/g, '"');         //Need to do this otherwise reading the value from local storage causes an error
        this.goalFactors = JSON.parse("[" + goalFactorsSource + "]");

    }

    public startFixture(): void {

        //Set the scores to zero for the start of the fixture
        if (this.isFirstHalf) {
            this.homeTeamsScore = 0;
            this.awayTeamsScore = 0;
            this.homeTeamsGoals = "";
            this.awayTeamsGoals = "";
        }

        this.statutoryMinutes = (this.isFirstHalf) ? 45 : 90;
        this.minutesPlayed = (this.isFirstHalf) ? 0 : 45;
        this.maxNumberOfMinutes = this.statutoryMinutes + ((this.isFirstHalf) ? this.injuryTimeFirstHalf : this.injuryTimeSecondHalf);
    }

    public updateFixture(): boolean {
        let i: number;
        let updateTable: boolean;
        let minutesinMatchFactor: number;

        updateTable = false;

        if (this.minutesPlayed < this.maxNumberOfMinutes) {

            minutesinMatchFactor = 0;

            for (i = 0; i < this.goalFactors[0].length; i++) {
                if (this.minutesPlayed <= this.goalFactors[0][i].minutes) {
                    minutesinMatchFactor = this.goalFactors[0][i].factor;
                    break;
                }
            }

            this.minutesPlayed++;

            if (this.minutesPlayed <= this.maxNumberOfMinutes) {
                if (this.hasTeamScored("home", minutesinMatchFactor) && !updateTable) updateTable = true;
                if (this.hasTeamScored("away", minutesinMatchFactor) && !updateTable) updateTable = true;
            }

            //Check for half time or end of fixtures
            if (this.minutesPlayed === this.maxNumberOfMinutes) {
                if (this.isFirstHalf) {
                    this.minutesInfo = HALF_TIME;
                    this.isFirstHalf = false;
                } else {
                    this.minutesInfo = FULL_TIME;
                    this.hasFixtureFinished = true;
                }
            } else {
                this.minutesInfo = this.minutesPlayed + ((this.minutesPlayed === 1) ? " min" : " mins");
            }

        }


        return updateTable;
    }

    private hasTeamScored(whichTeam: string, minutesinMatchFactor: number): boolean {
        let thisTeam: string;
        let awayTeamFactor: number;
        let isNotATopTeamFactor: number;
        let isItAGoalFactor: number;

        awayTeamFactor = (whichTeam === "home") ? 1 : this.miscInfo.goalFactors.isAwayTeam;

        thisTeam = this[whichTeam + "Team"];
        
        isNotATopTeamFactor = (this.teams[helpers.getPositionInArrayOfObjects(this.teams, "teamName", thisTeam)].isATopTeam) ? 1 : this.miscInfo.goalFactors.isNotATopTeam;

        isItAGoalFactor = this.miscInfo.goalFactors.isItAGoal;

        // Has a goal been scored
        if (Math.floor(Math.random() * this.miscInfo.goalFactors.baseForRandomMultiplier * minutesinMatchFactor * awayTeamFactor * isNotATopTeamFactor) < isItAGoalFactor) {

            this[whichTeam + "TeamsScore"] += 1;

            if (this.minutesPlayed > this.statutoryMinutes) {
                this[whichTeam + "TeamsGoals"] += this.statutoryMinutes.toString() + "(+" + (this.minutesPlayed - this.statutoryMinutes).toString() + ")  ";
            } else {
                this[whichTeam + "TeamsGoals"] += this.minutesPlayed + "  ";
            }
            return true;        // Return true to update table and re-display
        }
        return false;
    }

}
