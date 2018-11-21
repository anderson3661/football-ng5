import { DataService } from './../utilities/services/data.service';
import { AllFixturesModel, SetOfFixturesModel, TeamStatsModel, TablesModel, TableModel } from './../utilities/interfaces/interfaces';
import * as helpers from '../utilities/helper-functions/helpers';
import { Component, OnInit, ViewEncapsulation, Input, AfterViewInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import * as Chart from 'chart.js'

const HOME_TEAM = 0;

@Component({
    selector: 'app-team-stats',
    templateUrl: './team-stats.component.html',
    styleUrls: [
        './../utilities/css/fixtures.scss',
        './team-stats.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TeamStatsComponent implements OnInit, AfterViewInit {

    private fixturesForSeason: AllFixturesModel;
    public fixturesToOutput: TeamStatsModel;
    private table: TablesModel;
    private urlParam: string;
    public teamName: string;
    public showGoals: boolean;

    public chartType;
    public chartOptions;
    public chartData;
    public chartLabels;
    public chartColors;

    canvas: any;
    ctx: any;

    constructor(private dataService: DataService,
        private route: ActivatedRoute) { }

    ngOnInit() {
        let setOfFixturesCounter: number;
        let fixtureCounter: number;
        let dateOfFixture: string;
        let homeTeam: string;
        let awayTeam: string;
        let homeTeamsScore: number;
        let awayTeamsScore: number;
        let homeTeamsGoals: string;
        let awayTeamsGoals: string;
        let winDrawLoss: string;
        let positionInTable: number;
        let hasFixtureFinished: boolean;
        let checkHomeTeamsScore: any;
        let setOfFixtures: SetOfFixturesModel;

        this.urlParam = this.route.snapshot.paramMap.get('teamName');
        this.teamName = this.urlParam;

        this.fixturesForSeason = this.dataService.appData.setsOfFixtures;
        this.fixturesToOutput = [];
        this.table = [];

        this.showGoals = false;

        debugger;

        this.fixturesForSeason.forEach((setOfFixtures, setOfFixturesCounter) => {
            for (let fixture of setOfFixtures.fixtures) {
                dateOfFixture = setOfFixtures.dateOfSetOfFixtures;
                if (fixture.homeTeam === this.teamName || fixture.awayTeam === this.teamName) {
                    homeTeam = fixture.homeTeam;
                    awayTeam = fixture.awayTeam;
                    homeTeamsScore = fixture.homeTeamsScore;
                    awayTeamsScore = fixture.awayTeamsScore;
                    homeTeamsGoals = fixture.homeTeamsGoals;
                    awayTeamsGoals = fixture.awayTeamsGoals;

                    if (fixture.hasFixtureFinished) {
                        winDrawLoss = (fixture.homeTeam === this.teamName && homeTeamsScore > awayTeamsScore) ? "W" : "";
                        winDrawLoss = (fixture.homeTeam === this.teamName && homeTeamsScore === awayTeamsScore) ? "D" : winDrawLoss;
                        winDrawLoss = (fixture.homeTeam === this.teamName && homeTeamsScore < awayTeamsScore) ? "L" : winDrawLoss;
                        winDrawLoss = (fixture.awayTeam === this.teamName && awayTeamsScore > homeTeamsScore) ? "W" : winDrawLoss;
                        winDrawLoss = (fixture.awayTeam === this.teamName && awayTeamsScore === homeTeamsScore) ? "D" : winDrawLoss;
                        winDrawLoss = (fixture.awayTeam === this.teamName && awayTeamsScore < homeTeamsScore) ? "L" : winDrawLoss;
                    } else {
                        winDrawLoss = "";
                    }

                    break;
                };
            };
            //Check if fixture has been played
            checkHomeTeamsScore = this.fixturesForSeason[setOfFixturesCounter].fixtures[0].homeTeamsScore;
            positionInTable = (checkHomeTeamsScore === undefined || checkHomeTeamsScore === "") ? 0 : this.getPositionInTable(setOfFixturesCounter);
            hasFixtureFinished = this.fixturesForSeason[setOfFixturesCounter].fixtures[0].hasFixtureFinished;

            this.fixturesToOutput.push({ dateOfFixture: dateOfFixture, homeTeam: homeTeam, awayTeam: awayTeam, homeTeamsScore: homeTeamsScore, awayTeamsScore: awayTeamsScore, homeTeamsGoals: homeTeamsGoals, awayTeamsGoals: awayTeamsGoals, winDrawLoss: winDrawLoss, positionInTable: positionInTable, hasFixtureFinished: hasFixtureFinished });
        });

        this.displayChart();
    }

    private getPositionInTable(setOfFixturesCounter): number {
        let homeOrAwayCounter: number;
        let homeTeam: string;
        let awayTeam: string;
        let homeTeamsScore: number;
        let awayTeamsScore: number;
        let teamIndex: number;
        let team: TableModel;

        if (setOfFixturesCounter === 0) this.dataService.createTable(this.table);

        this.fixturesForSeason[setOfFixturesCounter].fixtures.forEach(fixture => {
            homeTeam = fixture.homeTeam;
            awayTeam = fixture.awayTeam;
            homeTeamsScore = fixture.homeTeamsScore;
            awayTeamsScore = fixture.awayTeamsScore;

            for (homeOrAwayCounter = 0; homeOrAwayCounter <= 1; homeOrAwayCounter++) {

                teamIndex = helpers.getPositionInArrayOfObjects(this.table, "teamName", (homeOrAwayCounter === HOME_TEAM) ? homeTeam : awayTeam);

                team = this.table[teamIndex];

                team.played = team.played + 1;

                team.won = team.won;
                team.drawn = team.drawn;
                team.lost = team.lost;

                team.points = team.points;

                if (homeOrAwayCounter === HOME_TEAM) {

                    team.homeWon = team.homeWon;
                    team.homeDrawn = team.homeDrawn;
                    team.homeLost = team.homeLost;

                    if (homeTeamsScore > awayTeamsScore) {
                        team.homeWon++;
                        team.won++;
                        team.points += 3;
                    }

                    if (homeTeamsScore === awayTeamsScore) {
                        team.homeDrawn++;
                        team.drawn++;
                        team.points += 1;
                    }

                    if (homeTeamsScore < awayTeamsScore) {
                        team.homeLost++;
                        team.lost++;
                    }

                    team.goalsFor = team.goalsFor + homeTeamsScore;
                    team.goalsAgainst = team.goalsAgainst + awayTeamsScore;
                    team.homeGoalsFor = team.homeGoalsFor + homeTeamsScore;
                    team.homeGoalsAgainst = team.homeGoalsAgainst + awayTeamsScore;
                    team.goalDifference = team.goalDifference + homeTeamsScore - awayTeamsScore;

                } else {

                    team.awayWon = team.awayWon;
                    team.awayDrawn = team.awayDrawn;
                    team.awayLost = team.awayLost;

                    if (awayTeamsScore > homeTeamsScore) {
                        team.awayWon++;
                        team.won++;
                        team.points += 3;
                    }

                    if (awayTeamsScore === homeTeamsScore) {
                        team.awayDrawn++;
                        team.drawn++;
                        team.points += 1;
                    }

                    if (awayTeamsScore < homeTeamsScore) {
                        team.awayLost++;
                        team.lost++;
                    }

                    team.goalsFor = team.goalsFor + awayTeamsScore;
                    team.goalsAgainst = team.goalsAgainst + homeTeamsScore;
                    team.awayGoalsFor = team.awayGoalsFor + awayTeamsScore;
                    team.awayGoalsAgainst = team.awayGoalsAgainst + homeTeamsScore;
                    team.goalDifference = team.goalDifference + awayTeamsScore - homeTeamsScore;
                }

            }
        });

        this.table.sort(helpers.deepSortAlpha(['points', 'goalDifference', 'goalsFor', 'teamName']));

        return helpers.getPositionInArrayOfObjects(this.table, "teamName", this.teamName) + 1;

    }

    private displayChart() {
        // This method uses ng-Chart whicg doesn't seem to be the same as Chart.js and wasn't quite as easy to configure ?
        let i: number;
        let fixtures: string[];
        let data: number[];

        fixtures = [];
        data = [];
        for (let i = 0; i < this.dataService.appData.miscInfo.numberOfFixturesForSeason; i++) {
            fixtures.push('Fixture ' + (i + 1));
            data.push(this.fixturesToOutput[i].positionInTable);
        }

        this.chartType = "line";
        this.chartOptions = {
            responsive: true,
            lineTension: 0,
            fill: false
            // backgroundColor: 'rgba(0,0,0,0.1)'
        };

        this.chartData = [
            {
                data: data,
                label: 'League position by fixture'
            }
            // { data: [45, 67, 800, 500], label: 'League position by fixture', borderWidth: 1, fontColor: 'rgb(255, 99, 132)', backgroundColor: 'rgba(0,0,0,0.1)' }
            // { data: {
            //     labels: 'League position by fixture',
            //     datasets: [{
            //         data: [45, 67, 800, 500],
            //         backgroundColor: 'rgba(0,0,0,0.1)'
            //     }]
            // }
        ];

        // this.chartLabels = ['January', 'February', 'Mars', 'April'];
        this.chartLabels = fixtures;

        this.chartColors = [{ backgroundColor: 'rgb(43, 6, 252)' }];
    }

    // public onChartClick(event) {
    //     console.log(event);
    // }

    ngAfterViewInit() {
        let i: number;
        let fixtures: string[];
        let data: number[];

        fixtures = [];
        data = [];
        for (let i = 0; i < this.dataService.appData.miscInfo.numberOfFixturesForSeason; i++) {
            fixtures.push('Fixture ' + (i + 1));
            data.push(this.fixturesToOutput[i].positionInTable === 0 ? null : this.fixturesToOutput[i].positionInTable);
        }

        this.canvas = document.getElementById('myChart');
        this.ctx = this.canvas.getContext('2d');

        Chart.defaults.global.elements.line.fill = false;

        let myChart = new Chart(this.ctx, {
            type: 'line',
            data: {
                labels: fixtures,
                datasets: [{
                    label: 'League position',
                    data: data,
                    borderColor: "#3e95cd",
                    spanGaps: false,
                    yAxisID: 'y-axis'
                    // borderWidth: 1,
                    // fill: false,        
                    //   backgroundColor: [
                    // 'rgba(43, 6, 252, 1)',
                    //   ],
                }]
            },
            options: {
                responsive: false,
                title: {
                    display: true,
                    text: this.teamName + "'s League Position by fixture",
                    fontSize: 24,
                    fontStyle: 'bold'
                },
                scales: {
                    yAxes: [{
                        id: 'y-axis',
                        type: 'linear',
                        // display: true,
                        // labelString: 'League Position2',
                        ticks: {
                            max: 20,
                            min: 1,
                            stepSize: 1,
                            reverse: true
                        }
                    }]
                }
            }
        });
    }

}
