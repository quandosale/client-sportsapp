import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import {
    subDays,
    addDays,
    isSameDay,
    isSameMonth,
    addWeeks,
    subWeeks,
    addMonths,
    subMonths,
} from 'date-fns';
import {
    CalendarEvent,
} from 'angular-calendar';

declare let jQuery: any;
declare let $: any;
@Component({
    // moduleId: module.id,
    selector: 'my-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.css'],
})

export class MyCalendarComponent implements OnInit, AfterViewInit {
    viewDate: Date = new Date();
    year: string;
    month: string;

    MONTH: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    view: string = 'month';
    clickday: Date;
    @Output() dayClickedEvent = new EventEmitter();
    week: boolean = false;

    activeDayIsOpen: boolean = false;
    constructor() { }
    ngOnInit(): void {
        this.year = this.viewDate.getFullYear() + '';
        this.month = this.MONTH[this.viewDate.getMonth()];
    }

    ngAfterViewInit(): void {
        $(document).ready(function () {
            $('.cal-cell-row').click(function () {
                $('.cal-cell-row').removeClass('selected');
                $(this).addClass('selected');
            });
            $('.cal-cell').click(function () {
                $('.cal-cell').removeClass('selectedcell');
                $(this).addClass('selectedcell');
            });
        });
    }

    update(): void {
        this.year = this.viewDate.getFullYear() + '';
        this.month = this.MONTH[this.viewDate.getMonth()];
    }

    increment(): void {
        const addFn: any = {
            day: addDays,
            week: addWeeks,
            month: addMonths
        }[this.view];

        this.viewDate = addFn(this.viewDate, 1);
        this.update();

        this.dayClickedEvent.emit(this.viewDate);
    }

    decrement(): void {

        const subFn: any = {
            day: subDays,
            week: subWeeks,
            month: subMonths
        }[this.view];

        this.viewDate = subFn(this.viewDate, 1);
        this.update();

        this.dayClickedEvent.emit(this.viewDate);
    }

    dayClicked({date, events}: { date: Date, events: CalendarEvent[] }): void {
        this.clickday = date;

        if (isSameMonth(date, this.viewDate)) {
            if (
                (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
                events.length === 0
            ) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
                this.viewDate = date;
            }
        }

        this.dayClickedEvent.emit(this.clickday);

    }
}

