import { DialogComponent } from './../../dialog/dialog.component';
import { TeamsModel, AllFixturesModel, TablesModel, AppDataModel } from '../interfaces/interfaces';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';


const APP_DATA_LOCAL_STORAGE = "football_AppInfo";

const TEAMS_DEFAULT = [
    { teamName: "Arsenal", isATopTeam: true },
    { teamName: "Bournemouth", isATopTeam: false },
    { teamName: "Brighton", isATopTeam: false },
    { teamName: "Burnley", isATopTeam: false },
    { teamName: "Chelsea", isATopTeam: true },
    { teamName: "Crystal Palace", isATopTeam: false },
    { teamName: "Everton", isATopTeam: false },
    { teamName: "Huddersfield", isATopTeam: false },
    { teamName: "Leicester", isATopTeam: false },
    { teamName: "Liverpool", isATopTeam: true },
    { teamName: "Manchester City", isATopTeam: true },
    { teamName: "Manchester United", isATopTeam: true },
    { teamName: "Newcastle", isATopTeam: false },
    { teamName: "Southampton", isATopTeam: false },
    { teamName: "Stoke", isATopTeam: false },
    { teamName: "Swansea", isATopTeam: false },
    { teamName: "Tottenham", isATopTeam: true },
    { teamName: "Watford", isATopTeam: false },
    { teamName: "West Brom", isATopTeam: false },
    { teamName: "West Ham", isATopTeam: false }
]

const NUMBER_OF_FIXTURES_FOR_SEASON = 10;
const MATCH_UPDATE_INTERVAL = 1000;
const FACTOR_BASE_FOR_RANDOM_MULTIPLIER = 90;
const FACTOR_AWAY_TEAM = 1.1;
const FACTOR_IS_NOT_A_TOP_TEAM = 1.1;
const FACTOR_GOALS_PER_MINUTE = "[{'minutes': 30, 'factor': 1.8}, {'minutes': 80, 'factor': 1.2}, {'minutes': 120, 'factor': 1}]";
const FACTOR_IS_IT_A_GOAL = 2;


@Injectable()
export class DataService {

    public appData: AppDataModel;

    constructor(public dialog: MatDialog) {
        this.appData = <AppDataModel>{};
        debugger;
        this.getAppData();
    }

    public saveAppData(confirmSaveMessage?: boolean): void {
        this.contractSeasonValue();
        localStorage.setItem(APP_DATA_LOCAL_STORAGE, JSON.stringify(this.appData));
        this.expandSeasonValue();
        if (confirmSaveMessage) this.confirmationMessage("Changes saved");
    }

    private getAppData(): void {
        let appDataFromLocalStorage: string = "";

        if (typeof (Storage) !== "undefined") {

            appDataFromLocalStorage = localStorage.getItem(APP_DATA_LOCAL_STORAGE);

            if (appDataFromLocalStorage === null) {

                this.confirmNewGame("Do you want to create a new game ?", APP_DATA_LOCAL_STORAGE + " not found in local storage");

            } else {

                this.appData = JSON.parse(appDataFromLocalStorage);

                if (this.appData.miscInfo.season === null) {
                    this.confirmationMessage("Cannot continue ... 'Season' property is blank in local storage item " + APP_DATA_LOCAL_STORAGE);
                } else {
                    this.expandSeasonValue();
                }
            }

        } else {
            this.confirmationMessage("Sorry ... cannot use this application because your browser doesn't support local storage");
        }

    }

    private setAppData(useDefaults: boolean): void {
        this.appData.teamsForSeason = TEAMS_DEFAULT;
        this.appData.allFixtures = <AllFixturesModel>{};
        this.appData.latestTable = [];

        if (useDefaults) {
            this.appData.miscInfo = {
                season: "1718",
                seasonStartDate: "05 Aug 2017",
                dateOfLastSetOfFixtures: '',
                factorBaseForRandomMultiplier: FACTOR_BASE_FOR_RANDOM_MULTIPLIER,
                factorAwayTeam: FACTOR_AWAY_TEAM,
                factorIsNotATopTeam: FACTOR_IS_NOT_A_TOP_TEAM,
                factorLikelihoodOfAGoalDuringASetPeriod: FACTOR_GOALS_PER_MINUTE,
                factorIsItAGoal: FACTOR_IS_IT_A_GOAL,
                numberOfFixturesForSeason: NUMBER_OF_FIXTURES_FOR_SEASON,
                matchUpdateInterval: MATCH_UPDATE_INTERVAL,
                numberOfTeams: this.appData.teamsForSeason.length,
                hasSeasonStarted: false,
                hasSeasonFinished: false
            };
            this.expandSeasonValue();
        } else {
            this.appData.miscInfo.dateOfLastSetOfFixtures = '';
            this.appData.miscInfo.numberOfTeams = this.appData.teamsForSeason.length;
            this.appData.miscInfo.hasSeasonStarted = false;
            this.appData.miscInfo.hasSeasonFinished = false;
        }

        this.createTable(this.appData.latestTable);
        this.saveAppData();
    }

    private expandSeasonValue(): void {
        let season = this.appData.miscInfo.season;
        this.appData.miscInfo.season = '20' + season.substring(0, 2) + "/" + season.substring(4, 2);    //Change this season format from 1718 to 2017/18        
    }

    private contractSeasonValue(): void {
        let season = this.appData.miscInfo.season;
        if (season !== "") {
            this.appData.miscInfo.season = season.substring(2, 4) + season.substring(5);     //Change from 2017/18 to 1718 format
        }
    }

    public createTable(table): void {
        //Populate the table array with blank values
        let i: number;

        for (i = 0; i < this.appData.miscInfo.numberOfTeams; i++) {
            table.push({
                teamName: this.appData.teamsForSeason[i].teamName,
                played: 0,
                won: 0,
                drawn: 0,
                lost: 0,
                goalsFor: 0,
                goalsAgainst: 0,
                goalDifference: 0,
                points: 0,
                form: [],
                homeWon: 0,
                homeDrawn: 0,
                homeLost: 0,
                homeGoalsFor: 0,
                homeGoalsAgainst: 0,
                awayWon: 0,
                awayDrawn: 0,
                awayLost: 0,
                awayGoalsFor: 0,
                awayGoalsAgainst: 0
            });
        }
    }

    public haveSeasonsFixturesBeenCreated(): boolean {
        // Called from various places to see if the season's fixtures have been created
        return (this.appData.allFixtures.length !== undefined && this.appData.allFixtures.length > 0)
    }

    private confirmNewGame(title: string, info?: string) {
        let dialogRef: MatDialogRef<any>;

        dialogRef = this.dialog.open(DialogComponent, {
            data: {
                title: title,
                info: info
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            debugger;
            if (result) {
                this.setAppData(true);
                window.location.reload();           //Refresh the current window as Angular doesn't
                return true;
            }
            // console.log('Dialog result: ' + result.toString());
        });

        return false;
    }

    public confirmResetSeason(title: string, functionIfYes) {
        let dialogRef: MatDialogRef<any>;

        dialogRef = this.dialog.open(DialogComponent, {
            data: {
                title: title,
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            debugger;
            if (result) {
                functionIfYes();
                return true;
            }
        });

        return false;
    }

    public confirmationMessage(title: string, info?: string) {
        let dialogRef: MatDialogRef<any>;

        dialogRef = this.dialog.open(DialogComponent, {
            data: {
                title: title,
                info: info,
                informationOnly: true
            }
        });
    }


}
