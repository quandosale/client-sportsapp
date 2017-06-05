import { Component, OnInit, AfterViewInit } from '@angular/core';


import {  ChartComponent } from 'angular2-highcharts';
import { Observable } from 'rxjs/Rx';

import {  PatientsService, UserService,  DataService } from '../../../../services/index';
declare let $: any;
@Component({
    selector: 'sleep-chart',
    templateUrl: './sleep-chart.component.html',

    styleUrls: [
        './sleep-chart.component.css'
    ],
    providers: [PatientsService, UserService, DataService],
})

export class SleepChartComponent implements OnInit, AfterViewInit {

    options: Object;
    chart: ChartComponent;

    seekbarMin = 0;
    seekbarMax = 1000;
    ngAfterViewInit(): void {
        $(document).ready(function () {
            let width = $('#slider').width();
            $('.remainbar').width(width - 18 + 'px');
            $(document).on('input', '#slider', function () {
                let value = $(this).val();
                let w = $(this).width();

                this.currentTime = value;
                this.seekbarMax = 1000;
                this.seekbarMin = 0;
                w -= 18;
                let length = this.seekbarMax - this.seekbarMin;
                this.remainTime = (length - value) * w / length;
                $(this).next().width(this.remainTime + 'px');
                // $('.remainbar').width(this.remainTime + 'px');
            });
        });
    }


    constructor(private dataService: DataService) {
        this.createChart();
    }// constructor

    ngOnInit() {

    }

    saveInstance(chartInstance: any) {
        this.chart = chartInstance;
        console.log('saveInstal');
        let timer = Observable.timer(2000, 1000);
        timer.subscribe(t => this.updateData());
    }
    updateData(): void {
        this.chart.series[0].data[0].update(Math.random() * 300);
    }
    createChart(): void {
        this.options = {
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Sleep chart',
                enabled: false

            },
            navigator: {
                enabled: false
            },
            scrollbar: {
                enabled: false
            },
            xAxis: {
                categories: ['Deep', 'Right', 'Normal'],
                title: {
                    text: null
                },
                tickInterval: 90
                // enabled: false
            },
            yAxis: {

                min: 0,
                opposite: false,
                title: {
                    text: 'Duration (Minutes)',
                    align: 'high'
                },
                labels: {
                    overflow: 'justify'
                }
            },
            tooltip: {
                valueSuffix: ' minutes',

            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true
                    }
                },
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y:.0f} minutes ( {series.name} )'
                    },
                    grouping: false,
                },
                column: {
                    grouping: false,
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            rangeSelector: {
                inputEnabled: true,
                enabled: false,
                selected: 3
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: 3,
                y: 20,
                floating: true,
                borderWidth: 1,
                // backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                shadow: true
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'Deep',
                data: [50, null, null]
            },
            {
                name: 'Right',
                data: [null, 100, null]
            },
            {
                name: 'Normal',
                data: [null, null, 140]
            }
            ]

        };
    }
}
