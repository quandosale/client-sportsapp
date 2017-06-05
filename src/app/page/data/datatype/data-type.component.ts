import { Component, Output, Input, EventEmitter } from '@angular/core'
import { SelectItem } from 'primeng/primeng';
import { SharedService } from '../../../services/index';
@Component({
  selector: 'select-data-type',
  templateUrl: './data-type.component.html',
  styles: [`
    .select-data-type {
      width: 100%;
      margin-bottom: 100px;
    }
  `],
})
export class SelectDataTypeComponent {
  selectDataType: SelectItem[];
  @Input() selectedDataType: string;
  constructor(private sharedService: SharedService) {
    this.selectDataType = [];
    this.selectDataType.push({ label: 'All', value: 'all' });
    this.selectDataType.push({ label: 'ECG Recording', value: 'ecg' });
    this.selectDataType.push({ label: 'Blood Pressure', value: 'bp' });
    this.selectDataType.push({ label: 'Sleep Record', value: 'sleep' });
    this.selectDataType.push({ label: 'Weight', value: 'weight' });
    this.selectDataType.push({ label: 'Activity', value: 'activity' });
    this.selectDataType.push({ label: 'Events', value: 'events' });
  }


  @Output() datatypeselected = new EventEmitter<string>();
  selectDataTypeName(datatype: any): void {
    this.selectedDataType = datatype.value;

    // this.sharedService.setDataType("" + datatype.value);

    this.datatypeselected.emit(this.selectedDataType);
  }

}
