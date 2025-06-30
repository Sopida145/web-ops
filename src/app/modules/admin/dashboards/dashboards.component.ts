import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexPlotOptions,
  ApexLegend,
  ApexResponsive,
  ApexNonAxisChartSeries,
  ApexLegend as ApexLegendDonut
} from 'ng-apexcharts';
import { PatienceService } from 'app/core/patience/patience.service';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  responsive: ApexResponsive[];
  legend: ApexLegendDonut;
};

export type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  xaxis: ApexXAxis;
  legend: ApexLegend;
  responsive: ApexResponsive[];
};

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterOutlet, NgApexchartsModule],
})
export class DashboardsComponent implements OnInit {
  public chartOptions: Partial<ChartOptions>;
  public barChartOptions: Partial<BarChartOptions>;

  female = 0;
  male = 0;

  constructor(private patienceService: PatienceService) {
    // Donut Chart ตัวอย่าง (ยังไม่เปลี่ยน)
    this.chartOptions = {
      series: [44, 55, 13, 43],
      chart: {
        type: 'donut',
        width: 380
      },
      labels: ['Apple', 'Mango', 'Orange', 'Banana'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ],
      legend: {
        position: 'right'
      }
    };
  }

  ngOnInit(): void {
    this.loadGenderData();
  }

  loadGenderData() {
    this.patienceService.countGender().subscribe(data => {
      this.female = data.female;
      this.male = data.male;

      // ✅ อัปเดตข้อมูล barChartOptions
      this.barChartOptions = {
        series: [
          {
            name: 'จำนวน',
            data: [this.female, this.male]
          }
        ],
        chart: {
          type: 'bar',
          height: 350
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '40%'
          }
        },
        dataLabels: {
          enabled: true
        },
        xaxis: {
          categories: ['หญิง', 'ชาย']
        },
        legend: {
          show: false
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300
              }
            }
          }
        ]
      };
    });
  }
}
