import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import * as Chart from 'chart.js'

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ChartComponent implements AfterViewInit {

    canvas: any;
    ctx: any;
  
    ngAfterViewInit() {
      this.canvas = document.getElementById('myChart');
      this.ctx = this.canvas.getContext('2d');
      let myChart = new Chart(this.ctx, {
        type: 'line',
        data: {
            labels: ["New", "In Progress", "On Hold"],
            datasets: [{
                label: '# of Votes',
                data: [1,2,3],
                backgroundColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
          responsive: false,
          display:true
        }
      });
    }

}
