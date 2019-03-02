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

  // template --> Section --> Column
  // section can contain only column
  // template can contain only sections

  // public columnArray = [];
  // public sectionArray = []; // this.ColumnArray
  public mailtemplateArray = [[[]]]; // needs at least one item at init

  // Connect Toolsect to SectionArray
  toolset = [
    this.maileditorModel.maileditorImage,
    this.maileditorModel.maileditorText,
    this.maileditorModel.maileditorButton
  ];

  constructor(public maileditorModel: MaileditorModel) { }

  ngOnInit() {
    // this.addToMailTemplateArray()
    // this.addToSectionArray(0)
    // console.log(this.mailtemplateArray)
  }

  addToMailTemplateArray(): void {
    const section = [];
    this.mailtemplateArray.push(section);
  }

  addToSectionArray(i): void {
    const column = [];
    this.mailtemplateArray[i].push(column);
  }


  // creat array per
  drop(event: CdkDragDrop<string[]>) {
    // console.log(this.maileditorModel.maileditorSection)
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      // if eventcontainer is new column create new eventcontainer
    } else {
      // let columnarray = []
      // columnarray.push
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
      case 'Section': {
        this.Section = true;
        break;
      }
      case 'Column': {
        this.Column = true;
        break;
      }
      case 'Image': {
        this.Image = true;
        break;
      }
      case 'Text': {
        this.Text = true;
        break;
      }
      case 'Button': {
        this.Button = true;
        break;
      }
      default: {
        // statements;
        break;
      }
    }
  }

}
