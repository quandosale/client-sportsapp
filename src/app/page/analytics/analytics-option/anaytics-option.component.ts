import { Component, Output, Input, EventEmitter } from '@angular/core'
import { SelectItem } from 'primeng/primeng';
import { SharedService } from '../../../services/index';
@Component({
  selector: 'anaystics-option',
  templateUrl: './anaytics-option.component.html',
  styles: [`
    .select-data-type {
      width: 100%;
      margin-bottom: 100px;
    }
  `],
})
export class AnaysticsOptionComponent {
  selectDataType: SelectItem[];
  @Input() selectedDataType: string;
  constructor(private sharedService: SharedService) {
    this.selectDataType = [];
    this.selectDataType.push({ label: '--', value: 'all' });
    this.selectDataType.push({ label: 'Sternum', value: 'sternum' });
    this.selectDataType.push({ label: 'Chest', value: 'chest' });
    this.selectDataType.push({ label: 'Abdomen', value: 'abdomen' });
    this.selectDataType.push({ label: 'Arm', value: 'arm' });
  }


  @Output() datatypeselected = new EventEmitter<string>();
  selectDataTypeName(datatype: any): void {
    this.selectedDataType = datatype.value;

    // this.sharedService.setDataType("" + datatype.value);

    this.datatypeselected.emit(this.selectedDataType);
  }

}
