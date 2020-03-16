import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @Input() tabledata;
  @Input() tablelabels;
  columnsToDisplay = ['label', 'data'];

  constructor() { }

  ngOnInit(): void {
    console.log(this.tabledata, this.tablelabels);
    this.columnsToDisplay = Object.keys(this.tabledata[0]);
  }

}
