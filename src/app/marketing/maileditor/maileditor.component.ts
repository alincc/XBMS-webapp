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

  public maileditorText: MaileditorText = new MaileditorText();

  // template --> Section --> Column
  // section can contain only column
  // template can contain only sections

  public columnArray = [];
  public sectionArray = []; // this.ColumnArray
   public mailtemplateArray = [[[]]]; 
  

  //create version 0n drop event
  // needs at least one item at init

  // Connect Toolsect to SectionArray
  toolset = [
    this.maileditorModel.maileditorImage,
    this.maileditorModel.maileditorText,
    this.maileditorModel.maileditorButton
  ];

  constructor(public maileditorModel: MaileditorModel) { }

  ngOnInit() {
    //init first component
    this.mailtemplateArray[0][0].push(this.maileditorModel.maileditorText);
  }

  addToMailTemplateArray(): void {
    const section = [[]];
    this.mailtemplateArray.push(section);
  }r

  addToSectionArray(i1): void {
    const column = [];
    this.mailtemplateArray[i1].push(column);
  }


  // creat array per
  drop(event: CdkDragDrop<string[]>, i1, i2 ) {
    console.log(i1, i2, event)
    if (event.previousContainer === event.container ) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      // if eventcontainer is new column create new eventcontainer
    } else if (event.previousContainer.id === "cdk-drop-list-0") {
      let arrayItem = [];
      event.previousContainer.data.forEach((element) =>
      {arrayItem.push(element)})
      let type = arrayItem[event.previousIndex].type;
      console.log(type, arrayItem)
  
      let newdata = this.createNewItem(type);


  
      
      this.mailtemplateArray[i1][i2].push(newdata);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      }

    }

  private createNewItem(type: string){
    if (type === "Text"){
      let newdata: MaileditorText = new MaileditorText();
      newdata.type = "Text";
      newdata.content= "Text";
      newdata.style = {
        "color": "black",
        "background-color": "white",
        "font-family": "Verdana",
        "fontsize": "12pt",
      }
      return newdata
    }
  }


  /**  Convert to html template
   * @params takes the arrray the template and converts them to mplm
   * @returns confirmation of created template
  */
  private ConvertToMail(): void {

  }

  private onSelectTemplatePart(item, i3): void {
    //let item = this.mailtemplateArray[i1][i2][i3]
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
        //let itemtext: MaileditorText;
        this.Text = true;
        this.maileditorText = item;
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
