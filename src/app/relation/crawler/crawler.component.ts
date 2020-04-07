import { Component, OnInit, ViewChild, Input } from '@angular/core';
import {
  Crawlwebtocsv,
  CrawlwebtocsvApi,
  RelationsApi,
  Relations,
  Company,
  CompanyApi,
  Account,
  AccountApi,
  Container,
  ContainerApi,
  Files,
  FilesApi,
} from '../../shared/';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import * as XLSX from 'xlsx';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogGetname } from '../../dialogsservice/dialog.getname'

export interface CrawlRes {
  Position: number;
  Text: string;
  Tag: string;
  URL: string;
  Language: string;
}


@Component({
  selector: 'app-crawler',
  templateUrl: './crawler.component.html',
  styleUrls: ['./crawler.component.scss']
})

export class CrawlerComponent implements OnInit {

  displayedColumns: string[] = ['select', 'Position', 'Text', 'Tag', 'URL', 'Language'];
  public selectedCrawler = new Crawlwebtocsv;
  public crawlerrunning = false;
  crawl1FormGroup: FormGroup;
  crawl2FormGroup: FormGroup;
  public editCrawler = false;
  public ELEMENT_DATA: CrawlRes[] = [];
  public crawlresult = false;
  public crawls = [];
  setcrawl: Files;
  waiting = false;

  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  selection = new SelectionModel(true, []);

  numbers = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
  ];


  @Input() selectedRelation: Relations;
  @ViewChild(MatSort, { static: false }) sort: MatSort;


  constructor(
    public dialog: MatDialog,
    public http: HttpClient,
    private _formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public CrawlerApi: CrawlwebtocsvApi,
    public RelationsApi: RelationsApi
  ) { }

  ngOnInit(): void {
    //this.dataSource.sort = this.sort;
    this.crawl1FormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.crawl2FormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  public openSnackBar(message: string) {
    this.snackBar.open(message, undefined, {
      duration: 2000,
      panelClass: "snackbar-class"
    });
  }

  //run crawler once delete?
  crawlUrl(): void {
    this.CrawlerApi.crawlurl(this.selectedRelation.id, this.selectedRelation.website).subscribe(res => res = res);
  }

  scheduleCrawler(): void {
    //update and queue
    this.waiting = true;
    if (this.selectedCrawler.url.indexOf('https://') === -1 && this.selectedCrawler.url.indexOf('http://') === -1) {
      this.selectedCrawler.url = 'https://' + this.selectedCrawler.url;
    }
    this.RelationsApi.crawltocsv(this.selectedRelation.id, this.selectedCrawler.url, false,
      false, false, false, false, this.selectedCrawler.depth, this.selectedRelation.companyId)
      .subscribe(res => {
        this.loadCrawl(res);
        this.waiting = false;
      });
  }

  loadCrawl(url) {
    this.crawlresult = true;
    this.ELEMENT_DATA.length = 0;
    this.http.get(url, { responseType: 'text' }).subscribe(text => {
      //var rows = text.split('\n');
      const rows = this.csv2array(text, ',');
      // start at 1 one as 0 is header
      for (let i = 1; i < rows.length-1; i++) {
        let columns = rows[i];
        columns = columns || [];
        this.ELEMENT_DATA.push({
          Position: i,
          Text: columns[0],
          Tag: columns[1],
          URL: columns[2],
          Language: columns[3]
        });
      }

      // this.dataSource.sortData( this.ELEMENT_DATA, this.sort);
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.sort = this.sort;

      // setTimeout(() => {   
      //   console.log(this.sort)    
      //   this.dataSource.sort = this.sort }, 500);

    });
  }



  downloadAsXLS() {
    const dialogRef = this.dialog.open(DialogGetname, {
      width: '250px',
      data: { name: 'xbms-collection' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let name = result + '.xlsx';
        /* make the worksheet */
        var ws = XLSX.utils.json_to_sheet(this.ELEMENT_DATA);
        /* add to workbook */
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, name);
        /* generate an XLSX file */
        XLSX.writeFile(wb, name);
      }
    });

  }

  deleteSelected() {
    let value = this.selection.selected;
    for (let i = 0; i < value.length; i++) {
      let item = value[i].Text
      let index = this.ELEMENT_DATA.map(function (e) { return e.Text; }).indexOf(item);
      if (index !== -1) this.ELEMENT_DATA.splice(index, 1);
    }
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.dataSource.sort = this.sort;
    this.selection.clear();
    this.dataSource.filter = '';
  }

  downloadAsXLSSelection() {
    let value = this.selection.selected;
    const dialogRef = this.dialog.open(DialogGetname, {
      width: '250px',
      data: { name: 'xbms-collection' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      let name = result + '.xlsx';
      /* make the worksheet */
      var ws = XLSX.utils.json_to_sheet(value);
      /* add to workbook */
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, name);

      /* generate an XLSX file */
      XLSX.writeFile(wb, name);
      }
    });
  }


  editCrawlerToggle(): void {
    this.editCrawler = true
  }

  loadCrawls() {
    this.RelationsApi.getFiles(this.selectedRelation.id, { where: { type: 'crawl' } })
      .subscribe((files: Files[]) => {
        console.log(files);
        this.crawls = files;
      });
  }

  applyFilter(event: Event) {
    this.selection.clear();
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isAllSelectedFilter() {
    const numSelected = this.selection.selected.length;
    const numRows =  this.dataSource.filteredData.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.dataSource.filter) {
      this.isAllSelectedFilter() ?
      this.selection.clear() :
      this.dataSource.filteredData.forEach(row => this.selection.select(row));
    } else {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
    }

  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: CrawlRes): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.Position + 1}`;
  }


  csv2array(strData, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
      (
        // Delimiters.
        "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

        // Quoted fields.
        "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

        // Standard fields.
        "([^\"\\" + strDelimiter + "\\r\\n]*))"
      ),
      "gi"
    );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {

      // Get the delimiter that was found.
      var strMatchedDelimiter = arrMatches[1];

      // Check to see if the given delimiter has a length
      // (is not the start of string) and if it matches
      // field delimiter. If id does not, then we know
      // that this delimiter is a row delimiter.
      if (
        strMatchedDelimiter.length &&
        strMatchedDelimiter !== strDelimiter
      ) {

        // Since we have reached a new row of data,
        // add an empty row to our data array.
        arrData.push([]);

      }

      var strMatchedValue;

      // Now that we have our delimiter out of the way,
      // let's check to see which kind of value we
      // captured (quoted or unquoted).
      if (arrMatches[2]) {

        // We found a quoted value. When we capture
        // this value, unescape any double quotes.
        strMatchedValue = arrMatches[2].replace(
          new RegExp("\"\"", "g"),
          "\""
        );

      } else {

        // We found a non-quoted value.
        strMatchedValue = arrMatches[3];

      }


      // Now that we have our value string, let's add
      // it to the data array.
      arrData[arrData.length - 1].push(strMatchedValue);
    }

    // Return the parsed data.
    return (arrData);
  }

}
