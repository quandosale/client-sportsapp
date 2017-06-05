import { Component, Output, EventEmitter } from '@angular/core';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'select-trend-type',
  templateUrl: './trend-type.component.html',
  styles: [`
    .select-data-type {
      width: 100%;
      margin-bottom: 100px;
    }
  `]

})
export class SelectTrendTypeComponent {
  selectDataType: SelectItem[];
  selectedTrendType: string;
  @Output() trendTypesSelected = new EventEmitter<string>();
  constructor() {
    this.selectDataType = [];
    this.selectDataType.push({ label: 'Blood Pressure', value: 'BP' });
    this.selectDataType.push({ label: 'Weight', value: 'Weight' });
    this.selectDataType.push({ label: 'Activity', value: 'Activity' });
    this.selectDataType.push({ label: 'Events', value: 'Events' });
  }

  selectTrendTypeName(datatype: any): void {
    this.selectedTrendType = datatype.value;
    this.trendTypesSelected.emit(this.selectedTrendType);
  }
}
