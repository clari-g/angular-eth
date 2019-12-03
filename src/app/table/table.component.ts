import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material';
import {MatTableDataSource} from '@angular/material/table';

export interface TableEntry {
  dataFile: string;
  date: string;
  ethHash: string;
  download: string;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  ELEMENT_DATA: TableEntry[] = [
  ];

  displayedColumns: string[] = ['dataFile', 'date', 'ethHash', 'download'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);

  @ViewChild(MatTable, {static: false}) table: MatTable<any>;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor() { }

  ngOnInit() {
    if (localStorage.getItem('dataSource') != null) {
      console.log('Local table data found!');
      this.ELEMENT_DATA = JSON.parse(localStorage.getItem('dataSource'));
      this.loadTable();
    } else {
      console.log('No local table data found');
    }
  }

  loadTable() {
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  }

  // TODO: download files
  addTestItem() {
    this.ELEMENT_DATA.unshift({dataFile: 'aa', date: 'aaaa', ethHash: 'aaaaa', download: 'aa'});
    this.table.renderRows();
    localStorage.setItem('dataSource', JSON.stringify(this.ELEMENT_DATA));
  }

  addNewItem(name: string, time1: string, hash: string, time2: string) {
    this.ELEMENT_DATA.unshift({dataFile: name, date: time1, ethHash: hash, download: time2 + '.txt'});
    this.table.renderRows();
    localStorage.setItem('dataSource', JSON.stringify(this.ELEMENT_DATA));
  }

  downloadFile(a) {
    console.log(a);
  }

  clearLocalStorage() {
    localStorage.removeItem('dataSource');
    console.log('Local table data deleted');
  }
}
