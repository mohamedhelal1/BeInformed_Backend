import { Component, OnInit } from '@angular/core';
import{AboutCoronaService} from '../../services/about-corona.service';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
@Component({
  selector: 'app-corona-cases',
  templateUrl: './corona-cases.component.html',
  styleUrls: ['./corona-cases.component.scss']
})
export class CoronaCasesComponent implements OnInit {
  lineChartData: ChartDataSets[] =[];

  lineChartLabels: Label[]=[];

  lineChartOptions = {
    responsive: true,
  };

  lineChartColors: Color[] = [
    {
      backgroundColor: 'rgba(255,0,0,0.7)',
    },
    {
      backgroundColor: 'rgba(92,184,92,0.50)',
    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';
  constructor(private aboutCoronaService : AboutCoronaService) { }

  ngOnInit(): void {
    this.aboutCoronaService.getCoronaCases().subscribe(res =>{
      if(res){
        var deaths = [];
        var confirmed = [];
        for (var index = 1 ; index < res.data.length;index++) {
            deaths[index] = res.data[res.data.length-1-index].deaths;
            confirmed[index] = res.data[res.data.length-1-index].confirmed;
            this.lineChartLabels[index] = res.data[res.data.length-1-index].date;
        }
        this.lineChartData = [
          { data: deaths, label: 'Deaths' },
          { data: confirmed, label: 'Confirmed Cases' },
        ];
      
      }
    },
    (err)=>{
      console.log(err.message);
    }
    );
  }

}
