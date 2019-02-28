import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, copyArrayItem } from '@angular/cdk/drag-drop';
import {
  Maileditormodels, MaileditorSection, MaileditorColumn,
  MaileditorImage, MaileditorText, MaileditorButton, MaileditorModel
} from './maileditormodel/maileditormodels';


@Component({
  selector: 'app-maileditor',
  templateUrl: './maileditor.component.html',
  styleUrls: ['./maileditor.component.scss']
})
export class MaileditorComponent implements OnInit {

  // public maileditorModel:Maileditormodels;
  // public maileditorSection:MaileditorSection;
  public Section = false;
  public Column = false;
  public Image = false;
  public Text = false;
  public Button = false;
  public ColumnArray = [];
  public 

  constructor(public maileditorModel: MaileditorModel) { }

  ngOnInit() {
  }

  // creat array per 

  toolset = [
    this.maileditorModel.maileditorSection,
    this.maileditorModel.maileditorColumn,
    this.maileditorModel.maileditorImage,
    this.maileditorModel.maileditorText,
    this.maileditorModel.maileditorButton
  ];

  // needs at least item at init
  mailtemplate = [
    this.maileditorModel.maileditorColumn
  ];

  drop(event: CdkDragDrop<string[]>) {
    // console.log(this.maileditorModel.maileditorSection)
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      // if eventcontainer is new column create new eventcontainer 
    } else {
      let columnarray = []
      columnarray.push
      console.log(event.container)
      copyArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);

    }
  }

  /**  Convert to html template
   * @params takes the arrray the template and converts them to mplm
   * @returns confirmation of created template 
  */
  private ConvertToMail(): void {

  }

  // Section
  // Column
  // Image
  // Text
  // Button

  private onSelectTemplatePart(item, i): void {
    this.Section = false;
    this.Column = false;
    this.Image = false;
    this.Text = false;
    this.Button = false;

    switch (item.type) {
      case "Section": {
        this.Section = true;
        break;
      }
      case "Column": {
        this.Column = true;
        break;
      }
      case "Image": {
        this.Image = true;
        break;
      }
      case "Text": {
        this.Text = true;
        break;
      }
      case "Button": {
        this.Button = true;
        break;
      }
      default: {
        //statements; 
        break;
      }
    }
  }

}
