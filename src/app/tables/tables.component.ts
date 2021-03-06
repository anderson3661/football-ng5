import { DataService } from './../utilities/services/data.service';
import { TablesModel } from './../utilities/interfaces/interfaces';
import * as helpers from '../utilities/helper-functions/helpers';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
    selector: 'app-tables',
    templateUrl: './tables.component.html',
    styleUrls: [
        './../utilities/css/fixtures.scss',
        './../utilities/css/tables.scss',
        './tables.component.scss'
    ]
})
export class TablesComponent implements OnInit {

    // The following @Input(s) are required by the HTML - imported from fixtures-latest.component (i.e. in the html call)
    @Input() tableTypeInPlay: boolean;
    @Input() tableInPlay: TablesModel;
    @Input() tableBeforeFixtures: TablesModel;

    public table: TablesModel;
    public tableTypeFull: boolean;
    public hasSeasonStarted: boolean;    
    public hasSeasonFinished: boolean;

    constructor(private dataService: DataService,
        private route: ActivatedRoute) { }

    ngOnInit() {
        let urlParam: string;

        debugger;
        this.table = (this.tableInPlay === null || this.tableInPlay === undefined) ? this.dataService.appData.latestTable : this.tableInPlay;
        this.tableBeforeFixtures = (this.tableBeforeFixtures === null || this.tableBeforeFixtures === undefined) ? [] : this.tableBeforeFixtures;

        urlParam = this.route.snapshot.paramMap.get('displayFullTable');
        this.tableTypeFull = !(urlParam === null || urlParam === undefined);     // If the url returns just tables then set to false; if it returns tables + any value (e.g. tables/full) then set to true
        this.tableTypeInPlay = (this.tableTypeInPlay === null || this.tableTypeInPlay === undefined) ? false : this.tableTypeInPlay;

        this.hasSeasonStarted = this.dataService.appData.miscInfo.hasSeasonStarted;        
        this.hasSeasonFinished = this.dataService.appData.miscInfo.hasSeasonFinished;

        // <app-tables [tableTypeFull]=true></app-tables>  was in tables-full.component before
        // this.viewContext = {tableType: this.tableTypeFull};

    }

    // This is required by the html file as it is called then.
    private getPositionInArrayOfObjectsThis(array, objectProperty, objectValue): number {

        //Call the function in the helpers file.  Needs to be done like this so that the function can be referenced in the html file with ngClass
        return helpers.getPositionInArrayOfObjects(array, objectProperty, objectValue);
    }

}