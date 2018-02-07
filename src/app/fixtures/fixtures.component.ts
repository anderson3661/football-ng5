import { AllFixturesModel } from './../zzz-other/interfaces/interfaces';
import { DataService } from './../zzz-other/services/data.service';
import * as helpers from '../zzz-other/helper-functions/helpers';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

// declare var formatDate: any;

@Component({
    selector: 'app-fixtures',
    templateUrl: './fixtures.component.html',
    styleUrls: [
        '../zzz-other/css/fixtures.scss',
        './fixtures.component.scss'
    ],
    encapsulation: ViewEncapsulation.None
})
export class FixturesComponent implements OnInit {

    public fixturesForSeason: AllFixturesModel;
    public fixturesToOutput: AllFixturesModel;
    private dateOfLastSetOfFixtures: string;
    private urlParam: string;
    public displayResults: boolean;
    public displayHeader: string;
    public hasSeasonStarted: boolean;
    public hasSeasonFinished: boolean;
    public formattedDateOfFixtures: string;

    constructor(private dataService: DataService,
        private route: ActivatedRoute) { }

    ngOnInit() {
        let i: number;

        debugger;

        this.fixturesForSeason = this.dataService.appData.allFixtures;
        this.dateOfLastSetOfFixtures = this.dataService.appData.miscInfo.dateOfLastSetOfFixtures;

        this.urlParam = this.route.snapshot.paramMap.get('displayResults');
        this.displayResults = !(this.urlParam === null || this.urlParam === undefined);         // If the url returns just fixtures then set to false; if it returns fixtures + any value (e.g. fixtures/results) then set to true

        this.hasSeasonStarted = this.dataService.appData.miscInfo.hasSeasonStarted;
        this.hasSeasonFinished = this.dataService.appData.miscInfo.hasSeasonFinished;

        if (this.fixturesForSeason.length === undefined) {
            this.displayHeader = "New game ... please create fixtures for the season via Administration";
        } else if (this.hasSeasonFinished) {
            this.displayHeader = (this.displayResults) ? "Results for season - Final" : "Season finished";
        } else if (this.hasSeasonStarted) {
            this.displayHeader = (this.displayResults) ? "Results for season" : "Remaining fixtures for season";
        } else {
            this.displayHeader = (this.displayResults) ? "Results for season - no fixtures played yet" : "Fixtures for season";
        }

        if (this.dateOfLastSetOfFixtures === "") {
            this.fixturesToOutput = (this.displayResults) ? helpers.getEmptyAllFixtures() : this.fixturesForSeason.slice(0);
        } else {
            if (this.hasSeasonFinished && !this.displayResults) {
                this.fixturesToOutput = [{dateOfSetOfFixtures: '', fixtures: []}];
            } else {
                for (i = 0; i < this.fixturesForSeason.length; i++) {
                    if (this.fixturesForSeason[i].dateOfSetOfFixtures === this.dateOfLastSetOfFixtures) {
                        this.fixturesToOutput = (this.displayResults) ? this.fixturesForSeason.slice(0, i + 1) : this.fixturesForSeason.slice(i + 1);
                        break;
                    }
                }
            }
        }

        this.formattedDateOfFixtures = helpers.formatDate(this.fixturesToOutput[0].dateOfSetOfFixtures);                    //DOESN'T WORK
    }
}
