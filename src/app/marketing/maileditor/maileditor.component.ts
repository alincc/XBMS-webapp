import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, copyArrayItem } from '@angular/cdk/drag-drop';
import {
  Maileditormodels, MaileditorSection, MaileditorColumn,
  MaileditorImage, MaileditorText, MaileditorButton
} from './maileditormodel/maileditormodels';
import { FileuploadComponent } from '../../shared/fileupload/fileupload.component'


@Component({
  selector: 'app-maileditor',
  templateUrl: './maileditor.component.html',
  styleUrls: ['./maileditor.component.scss']
})
export class MaileditorComponent implements OnInit {

  public Section = false;
  public Column = false;
  public Image = false;
  public Text = false;
  public Button = false;

  public maileditorText: MaileditorText = new MaileditorText();
  public maileditorImage: MaileditorImage = new MaileditorImage();
  public maileditorColumn: MaileditorColumn = new MaileditorColumn();
  public maileditorSection: MaileditorSection = new MaileditorSection();
  public maileditorButton: MaileditorButton = new MaileditorButton();
  // template --> Section --> Column
  // section can contain only column
  // template can contain only sections

  public columnArray = [];
  public sectionArray = []; // this.ColumnArray
  public mailtemplateArray = [];
  public sectionStyleArray = [];
  public columnStyleArray = [];

  // create version 0n drop event
  // needs at least one item at init
  // Connect Toolsect to SectionArray

  private toolboximage = this.createNewItem('Image');
  private toolboxtext = this.createNewItem('Text');
  private toolboxbutton = this.createNewItem('Button');

  toolset = [
    this.toolboximage,
    this.toolboxtext,
    this.toolboxbutton
  ];

  constructor() { }

  ngOnInit() {
    // init first component
    this.addToMailTemplateArray()
    const texttool = this.createNewItem('Text')
    this.mailtemplateArray[0][0].push(texttool);
  }

  addToMailTemplateArray(): void {
    // add section to mailtemplate and to style array
    const section = [];
    this.mailtemplateArray.push(section);

    const sectionstyleIns: MaileditorSection = new MaileditorSection();
    sectionstyleIns.style = {
      'color': 'black',
      'background-color': 'white',
      'width': '100%',
      'height': '100%'
    }
    this.sectionStyleArray.push(sectionstyleIns);

    let index = this.mailtemplateArray.length
    index = index - 1; // array count
    this.addToSectionArray(index);
  }

  addToSectionArray(i1): void {
    // add column to section array and to style array
    const column = [];
    this.mailtemplateArray[i1].push([]);
    const columnstyleIns: MaileditorColumn = new MaileditorColumn();
    columnstyleIns.style = {
      'color': 'black',
      'background-color': 'white',
      'width': '100%',
      'height': '100%'
    }
    // if (this.columnStyleArray[i1] === undefined){
       this.columnStyleArray.push([]);
    // }
    console.log(i1, this.columnStyleArray)
    this.columnStyleArray[i1].push(columnstyleIns);
  }

  // creat array per
  drop(event: CdkDragDrop<string[]>, i1, i2 ) {
    console.log(i1, i2, event)
    if (event.container.id === 'listSection' && i1 === undefined) {
      moveItemInArray(this.mailtemplateArray, event.previousIndex, event.currentIndex);
      console.log(this.mailtemplateArray, event)
    } else if (event.previousContainer === event.container ) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      // if eventcontainer is new column create new eventcontainer
    } else if (event.previousContainer.id === 'cdk-drop-list-0') {
      const arrayItem = [];
      event.previousContainer.data.forEach((element) => {
        arrayItem.push(element)})
      const type = arrayItem[event.previousIndex].type;
      console.log(type, arrayItem)
      const newdata = this.createNewItem(type);
      this.mailtemplateArray[i1][i2].push(newdata);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      }

    }

  private createNewItem(type: string) {
    if (type === 'Text') {
      const newtext: MaileditorText = new MaileditorText();
      newtext.type = 'Text';
      newtext.content = 'Text';
      newtext.style = {
        'color': 'black',
        'background-color': 'white',
        'font-family': 'Verdana',
        'fontsize': '12pt'
      }
      return newtext
    }
    if (type === 'Image') {
      const newImage: MaileditorImage = new MaileditorImage();
      newImage.type = 'Image';
      newImage.url = 'www.xbms.io';
      newImage.style = {
        'color': 'black',
        'background-color': 'white',
        'width': '100%',
        'height': '100%'
      }
      return newImage
    }
    if (type === 'Button') {
      const newButton: MaileditorButton = new MaileditorButton();
      newButton.type = 'Button';
      newButton.buttonurl = 'www.xbms.io';
      return newButton
    }
  }


  /**  Convert to html template
   * @params takes the arrray the template and converts them to mplm
   * @returns confirmation of created template
  */
  private ConvertToMail(): void {
    // section
    this.mailtemplateArray.forEach((section, index1) => {
       // create section mjml
      const sectionStyle = this.sectionStyleArray[index1];

      section.forEach((column, index2) => {
        // create column mjml
        const columnsection = this.columnStyleArray[index2];
        column.array.forEach((item, index3) => {
          if (item.type === 'Text') {console.log('text', item)}
          if (item.type === 'Image') {console.log('Image', item)}
          if (item.type === 'Linebreak') {console.log('Linebreak', item)}
          if (item.type === '') {console.log('text', item)}
        });
      });
    })
  }

  private onSelectSectionPart(i1): void {
    this.resetEdit()
    this.Section = true;
    this.maileditorSection = this.sectionStyleArray[i1]
  }

  private onSelectColumnPart(i1, i2): void {
    this.resetEdit()
    this.Column = true;
    this.maileditorColumn = this.columnStyleArray[i1][i2]
    console.log(this.maileditorColumn);
  }

  private resetEdit(): void {
    this.Section = false;
    this.Column = false;
    this.Image = false;
    this.Text = false;
    this.Button = false;
  }

  private onSelectTemplatePart(item, i3): void {
    // const item = this.mailtemplateArray[i1][i2][i3]
    this.resetEdit()

    switch (item.type) {
      case 'Image': {
        this.Image = true;
        this.maileditorImage = item;
        break;
      }
      case 'Text': {
        // const itemtext: MaileditorText;
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

  private onDeleteSectionPart(i1): void {
    this.mailtemplateArray.splice(i1, 1);
  }

  private onDeleteColumnPart(i1, i2): void {
    this.mailtemplateArray[i1].splice(i2, 1);
  }


}
