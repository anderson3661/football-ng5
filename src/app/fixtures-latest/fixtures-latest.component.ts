import { AuthService } from './../utilities/services/auth.service';
import { Fixture } from './../utilities/classes/fixture';
import { DataService } from './../utilities/services/data.service';
import { TeamsModel, AllFixturesModel, SetOfFixturesModel, SetOfLatestFixturesModel, FixtureModel, TableModel, TablesModel, AppDataModel } from './../utilities/interfaces/interfaces';
// import { SetOfFixtures } from './../zzz-other/classes/set-of-fixtures';
import * as helpers from '../utilities/helper-functions/helpers';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import "rxjs/add/observable/interval";
import "rxjs/add/operator/take";

const SHOW_FORM_MATCHES = 10;
const HOME_TEAM = 0;
const EXTRA_MINUTES_FIRST_HALF = 5;
const EXTRA_MINUTES_SECOND_HALF = 9;

const START_FIXTURES = "Start Fixtures";
const RESTART_FIXTURES = "Restart Fixtures";
const FIXTURES_FINISHED = "Fixtures Finished";


@Component({
    selector: 'app-fixtures-latest',
    templateUrl: './fixtures-latest.component.html',
    styleUrls: [
        './../utilities/css/fixtures.scss',
        './../utilities/css/tables.scss',
        './fixtures-latest.component.scss',
    ]
})
export class FixturesLatestComponent implements OnInit {

    private teams: TeamsModel;
    public allSeasonsFixtures: AllFixturesModel;
    public nextSetOfFixtures: SetOfFixturesModel;
    public latestFixtures: SetOfLatestFixturesModel;
    public tableBeforeFixtures: TablesModel;
    public tableInPlay: TablesModel;

    public fixturesInPlay: boolean;
    public areFixturesInPlayForRouter: boolean;
    public startFixturesButtonEnabled: boolean;
    public startFixturesButtonText: string;
    private dateOfLastSetOfFixtures: string;
    private dateOfThisSetOfFixtures: string;
    public formattedDateOfFixtures: string;
    public haveAllFixturesInThisSetFinished: boolean;
    public displayHeader: string;
    public top3TeamsBeforeFixtures?: string[];
    public maxMinutesForPeriod: number;
    private tableTypeInPlay: boolean;                         // Required by the HTML - also used by fixtures-latest.component (i.e. in the html call)
    public hasSeasonFinished: boolean;

    private updateIntervalObservable: Subscription;

    constructor(private dataService: DataService,
                private auth: AuthService) { }

    ngOnInit() {
        let i: number;

        debugger;

        if (this.dataService.appData.miscInfo.haveSeasonsFixturesBeenCreated) {

            this.teams = this.dataService.appData.teamsForSeason;
            this.allSeasonsFixtures = this.dataService.appData.setsOfFixtures;
            this.hasSeasonFinished = this.dataService.appData.miscInfo.hasSeasonFinished;
            this.dateOfLastSetOfFixtures = this.dataService.appData.miscInfo.dateOfLastSetOfFixtures;
            this.maxMinutesForPeriod = 0;
            this.fixturesInPlay = false;
            this.areFixturesInPlayForRouter = false;
            this.startFixturesButtonText = START_FIXTURES;
            this.startFixturesButtonEnabled = true;           //Enable the Start Fixtures button

            this.nextSetOfFixtures = this.getNextSetOfFixtures();

            if (this.nextSetOfFixtures != undefined) {
                this.dateOfThisSetOfFixtures = this.nextSetOfFixtures.dateOfSetOfFixtures;
            }

            this.latestFixtures = this.getEmptySetOfFixtures();

            for (i = 0; i < this.nextSetOfFixtures.fixtures.length; i++) {
                this.latestFixtures.fixtures.push(new Fixture(this.nextSetOfFixtures.fixtures[i], this.dataService.appData.miscInfo, this.dataService.appData.teamsForSeason));
                this.latestFixtures.dateOfSetOfFixtures = this.nextSetOfFixtures.dateOfSetOfFixtures;
                this.latestFixtures.fixtures[i].setUpFixture();
            }

            if (this.allSeasonsFixtures.length === undefined) {
                this.displayHeader = "New game ... please create fixtures for the season via Administration";
            } else if (this.dataService.appData.miscInfo.hasSeasonFinished) {
                this.displayHeader = "Season finished";
            } else {
                this.displayHeader = "Latest Fixtures";
            }

            if (this.dataService.appData.latestTable[0].played > 0) {
                this.top3TeamsBeforeFixtures = [ this.dataService.appData.latestTable[0].teamName, this.dataService.appData.latestTable[1].teamName, this.dataService.appData.latestTable[2].teamName ];
            } else {
                this.top3TeamsBeforeFixtures = ["", "", ""];
            }

            this.formattedDateOfFixtures = helpers.formatDate(this.latestFixtures.dateOfSetOfFixtures);

            this.tableBeforeFixtures = this.dataService.appData.latestTable;
            this.setupInPlayTable();
        }
    }

    ngOnDestroy() {
        if (this.dataService.appData.miscInfo.haveSeasonsFixturesBeenCreated) {
            if (this.dataService.appData.setsOfFixtures[0].fixtures[0].hasFixtureFinished) this.dataService.appData.miscInfo.hasSeasonStarted = true;
            if (this.getNextSetOfFixtures().fixtures.length === 0) this.dataService.appData.miscInfo.hasSeasonFinished = true;
            this.dataService.saveAppData();

            if (this.updateIntervalObservable) this.updateIntervalObservable.unsubscribe;      //Unsubscribe from the observable to stop memory leaks
        }
    }

    authenticated() {
        return this.auth.authenticated;
    }

    startSetOfFixtures(): void {
        let speedOfUpdates: number;

        this.fixturesInPlay = true;
        this.areFixturesInPlayForRouter = true;
        this.startFixturesButtonEnabled = false;            //Disable the Start Fixtures button

        this.maxMinutesForPeriod = 0;                       // Set to zero as will be calculated for each fixture below

        this.latestFixtures.fixtures.forEach(fixture => {
            if (!fixture.hasFixtureFinished) {
                fixture.startFixture();
                this.updateInPlayTable(fixture);      // Set up in play table before fixtures start (so all teams in the current fixture are drawing)

                this.getMaximumMinutes(fixture);      // Get the maximum number of minutes for this period of all fixtures in play
            }
        });

        speedOfUpdates = this.dataService.appData.miscInfo.goalFactors.fixtureUpdateInterval * 1000;
        this.updateIntervalObservable = Observable.interval(speedOfUpdates).take(this.maxMinutesForPeriod).subscribe((counter: number) => this.checkFixturesProgress(counter + 1));

    }

    private checkFixturesProgress(counter: number) {

        this.latestFixtures.fixtures.forEach(fixture => {
            if (fixture.updateFixture()) {
                debugger;
                this.updateInPlayTable(fixture);
            }
        });

        if (this.maxMinutesForPeriod === counter) {

            this.haveAllFixturesInThisSetFinished = (this.latestFixtures.fixtures.filter(fixture => fixture.hasFixtureFinished).length === this.latestFixtures.fixtures.length);

            if (this.haveAllFixturesInThisSetFinished) {

                this.startFixturesButtonText = FIXTURES_FINISHED;
                this.startFixturesButtonEnabled = false;       //Enable/Disable the Start Fixtures button

                this.dataService.appData.miscInfo.dateOfLastSetOfFixtures = this.dateOfThisSetOfFixtures;

                debugger;
                this.areFixturesInPlayForRouter = false;
                this.updateFixturesDataSourceWithResults();
                this.updateTablesDataSourceWithResults();
                this.dataService.saveAppData();
            } else {
                this.startFixturesButtonText = RESTART_FIXTURES;
                this.startFixturesButtonEnabled = true;       //Enable/Disable the Start Fixtures button
            }
        }

    }

    private updateFixturesDataSourceWithResults() {
        //The latest fixtures are in their own array so now need to update the dataService fixture arrays.
        this.updateDataFixtures("");
    }

    private updateDataFixtures(stage: string) {
        let indexSetOfFixtures: number;
        let indexHomeTeam: number;
        let dataServiceFixture: FixtureModel;
        let latestFixture: FixtureModel;

        this.latestFixtures.fixtures.forEach(latestFixture => {

            indexSetOfFixtures = helpers.getPositionInArrayOfObjects(this.dataService.appData.setsOfFixtures, "dateOfSetOfFixtures", this.latestFixtures.dateOfSetOfFixtures);
            indexHomeTeam = helpers.getPositionInArrayOfObjects(this.dataService.appData.setsOfFixtures[indexSetOfFixtures].fixtures, "homeTeam", latestFixture.homeTeam);
            dataServiceFixture = this.dataService.appData.setsOfFixtures[indexSetOfFixtures].fixtures[indexHomeTeam];

            dataServiceFixture.homeTeamsScore = latestFixture.homeTeamsScore;
            dataServiceFixture.awayTeamsScore = latestFixture.awayTeamsScore;
            dataServiceFixture.homeTeamsGoals = latestFixture.homeTeamsGoals;
            dataServiceFixture.awayTeamsGoals = latestFixture.awayTeamsGoals;
            dataServiceFixture.injuryTimeFirstHalf = latestFixture.injuryTimeFirstHalf;
            dataServiceFixture.injuryTimeSecondHalf = latestFixture.injuryTimeSecondHalf;
            dataServiceFixture.minutesPlayed = latestFixture.minutesPlayed;
            dataServiceFixture.hasFixtureFinished = latestFixture.hasFixtureFinished;
        });
    }

    private updateTablesDataSourceWithResults() {
        this.dataService.appData.latestTable = this.tableInPlay;
    }

    private getMaximumMinutes(fixture: Fixture): void {
        this.maxMinutesForPeriod = Math.max(this.maxMinutesForPeriod, fixture.maxNumberOfMinutes - fixture.minutesPlayed + 1);    //Add 1 to fixture value
    }

    private getNextSetOfFixtures(): SetOfFixturesModel {
        let i: number;
        let setOfBlankFixtures: SetOfFixturesModel;

        this.dateOfLastSetOfFixtures = this.dataService.appData.miscInfo.dateOfLastSetOfFixtures;
        this.allSeasonsFixtures = this.dataService.appData.setsOfFixtures;

        if (this.dateOfLastSetOfFixtures === "" && !this.dataService.appData.miscInfo.hasSeasonStarted) {
            return this.allSeasonsFixtures[0];
        } else {
            i = 0;
            for (let setOfFixtures of this.allSeasonsFixtures) {
                if (setOfFixtures.dateOfSetOfFixtures === this.dateOfLastSetOfFixtures && i !== this.allSeasonsFixtures.length - 1) {
                    return this.allSeasonsFixtures[i + 1];
                }
                i++;
            };
        }

        return helpers.getEmptySetOfFixtures();
    }

    private getEmptySetOfFixtures(): SetOfLatestFixturesModel {
        return { dateOfSetOfFixtures: "", fixtures: [] };
    }

    private setScoresAndGoals(scoresValue: any): void {

        this.latestFixtures.fixtures.forEach(fixture => {
            fixture.homeTeamsScore = scoresValue;
            fixture.awayTeamsScore = scoresValue;
            fixture.homeTeamsGoals = "";
            fixture.awayTeamsGoals = "";
        });
    }

    private updateInPlayTable(fixture: FixtureModel): void {
        let homeOrAwayCounter: number;
        let thisTeam: string;
        let homeTeam: string;
        let awayTeam: string;
        let homeTeamScore: number;
        let awayTeamScore: number;
        let indexBeforeFixture: number;
        let indexInPlay: number;
        let teamBeforeFixture: TableModel;
        let teamInPlay: TableModel;

        // this.latestFixtures.fixtures.forEach(fixture => {

        homeTeam = fixture.homeTeam;
        awayTeam = fixture.awayTeam;
        homeTeamScore = fixture.homeTeamsScore;
        awayTeamScore = fixture.awayTeamsScore;

        for (homeOrAwayCounter = 0; homeOrAwayCounter <= 1; homeOrAwayCounter++) {

            thisTeam = (homeOrAwayCounter === HOME_TEAM) ? homeTeam : awayTeam;

            indexBeforeFixture = helpers.getPositionInArrayOfObjects(this.dataService.appData.latestTable, "teamName", thisTeam);
            teamBeforeFixture = this.dataService.appData.latestTable[indexBeforeFixture];

            indexInPlay = helpers.getPositionInArrayOfObjects(this.tableInPlay, "teamName", thisTeam);
            teamInPlay = this.tableInPlay[indexInPlay];

            teamInPlay.played = teamBeforeFixture.played + 1;

            teamInPlay.won = teamBeforeFixture.won;
            teamInPlay.drawn = teamBeforeFixture.drawn;
            teamInPlay.lost = teamBeforeFixture.lost;

            teamInPlay.points = teamBeforeFixture.points;

            if (homeOrAwayCounter === HOME_TEAM) {

                teamInPlay.homeWon = teamBeforeFixture.homeWon;
                teamInPlay.homeDrawn = teamBeforeFixture.homeDrawn;
                teamInPlay.homeLost = teamBeforeFixture.homeLost;

                if (homeTeamScore > awayTeamScore) {
                    teamInPlay.homeWon++;
                    teamInPlay.won++;
                    teamInPlay.points += 3;
                    teamInPlay.form[teamInPlay.form.length - 1] = "W";
                }

                if (homeTeamScore === awayTeamScore) {
                    teamInPlay.homeDrawn++;
                    teamInPlay.drawn++;
                    teamInPlay.points += 1;
                    teamInPlay.form[teamInPlay.form.length - 1] = "D";
                }

                if (homeTeamScore < awayTeamScore) {
                    teamInPlay.homeLost++;
                    teamInPlay.lost++;
                    teamInPlay.form[teamInPlay.form.length - 1] = "L";
                }

                teamInPlay.goalsFor = teamBeforeFixture.goalsFor + homeTeamScore;
                teamInPlay.goalsAgainst = teamBeforeFixture.goalsAgainst + awayTeamScore;
                teamInPlay.homeGoalsFor = teamBeforeFixture.homeGoalsFor + homeTeamScore;
                teamInPlay.homeGoalsAgainst = teamBeforeFixture.homeGoalsAgainst + awayTeamScore;
                teamInPlay.goalDifference = teamBeforeFixture.goalDifference + homeTeamScore - awayTeamScore;

            } else {

                teamInPlay.awayWon = teamBeforeFixture.awayWon;
                teamInPlay.awayDrawn = teamBeforeFixture.awayDrawn;
                teamInPlay.awayLost = teamBeforeFixture.awayLost;

                if (awayTeamScore > homeTeamScore) {
                    teamInPlay.awayWon++;
                    teamInPlay.won++;
                    teamInPlay.points += 3;
                    teamInPlay.form[teamInPlay.form.length - 1] = "W";
                }

                if (awayTeamScore === homeTeamScore) {
                    teamInPlay.awayDrawn++;
                    teamInPlay.drawn++;
                    teamInPlay.points += 1;
                    teamInPlay.form[teamInPlay.form.length - 1] = "D";
                }

                if (awayTeamScore < homeTeamScore) {
                    teamInPlay.awayLost++;
                    teamInPlay.lost++;
                    teamInPlay.form[teamInPlay.form.length - 1] = "L";
                }

                teamInPlay.goalsFor = teamBeforeFixture.goalsFor + awayTeamScore;
                teamInPlay.goalsAgainst = teamBeforeFixture.goalsAgainst + homeTeamScore;
                teamInPlay.awayGoalsFor = teamBeforeFixture.awayGoalsFor + awayTeamScore;
                teamInPlay.awayGoalsAgainst = teamBeforeFixture.awayGoalsAgainst + homeTeamScore;
                teamInPlay.goalDifference = teamBeforeFixture.goalDifference + awayTeamScore - homeTeamScore;
            }

            // Just take the last (i.e. latest) 10 games for the Form column
            if (teamInPlay.form.length > SHOW_FORM_MATCHES) {
                teamInPlay.form = teamInPlay.form.slice(teamInPlay.form.length - SHOW_FORM_MATCHES);
            }
        }

        this.tableInPlay.sort(helpers.deepSortAlpha(['points', 'goalDifference', 'goalsFor', 'teamName']));

    }

    private setupInPlayTable(): void {

        //Deep clone the array
        this.tableInPlay = JSON.parse(JSON.stringify(this.dataService.appData.latestTable));

        //Add a new array element for Form
        this.tableInPlay.forEach(team => {
            team.form.push("");
        });

    }

    private getPositionInArrayOfObjectsThis(array, objectProperty, obJectValue): number {

        //Call the function in the helpers file.  Needs to be done like this so that the function can be referenced in the html file with ngClass
        return helpers.getPositionInArrayOfObjects(array, objectProperty, obJectValue);
    }

    public canDeactivate() {
        return !this.areFixturesInPlayForRouter;
    }



}
