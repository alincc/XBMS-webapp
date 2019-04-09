/** Todo list:
 * Add support for gif generator: https://www.npmjs.com/package/gifencoder  
 * Add subject name + emoticon support
 * Add text editor CKE5 Editor support
 * Add preview
 * Add body style
 * Add save as template
 * */


import { Component, OnInit, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, copyArrayItem } from '@angular/cdk/drag-drop';
import {
  Maileditormodels, MaileditorSection, MaileditorColumn,
  MaileditorImage, MaileditorText, MaileditorButton, MaileditorDivider
} from './maileditormodel/maileditormodels';
import { FileuploadComponent } from '../../shared/fileupload/fileupload.component';
import { Relations } from '../../shared';
import { Mailing, MailingApi } from '../../shared/sdk'

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
  public Divider = false;

  public maileditorText: MaileditorText = new MaileditorText();
  public maileditorImage: MaileditorImage = new MaileditorImage();
  public maileditorColumn: MaileditorColumn = new MaileditorColumn();
  public maileditorSection: MaileditorSection = new MaileditorSection();
  public maileditorButton: MaileditorButton = new MaileditorButton();
  public maileditorDivider: MaileditorDivider = new MaileditorDivider();
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
  private toolboxdivider = this.createNewItem('Divider');

  toolset = [
    this.toolboximage,
    this.toolboxtext,
    this.toolboxbutton,
    this.toolboxdivider
  ];

  @Input('option') option: Relations;
  @Input('account') account: Account;

  constructor(
    public mailingApi: MailingApi
  ) { }

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
      'height': '300px',
      'margin': '1px',
      'padding': '1px',
      'border-style': 'none',
      'border-width': '1px',
      'background-image': ''
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
      'height': '100%',
      'margin': '1px',
      'padding': '1px',
      'border-style': 'none',
      'border-width': '1px',
      'background-image': ''
    }
       this.columnStyleArray.push([]);
    console.log(i1, this.columnStyleArray)
    this.columnStyleArray[i1].push(columnstyleIns);
  }

  // creat array per
  drop(event: CdkDragDrop<string[]>, i1, i2 ) {
    console.log(i1, i2, event)
if (event.previousContainer === event.container ) {
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
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
}

  private createNewItem(type: string) {
    if (type === 'Text') {
      const newtext: MaileditorText = new MaileditorText();
      newtext.type = 'Text';
      newtext.content = 'Start Writing';
      newtext.typeformat = 'p';
      newtext.style = {
        'color': 'black',
        'background-color': '',
        'font-family': 'Verdana',
        'fontsize': '12pt',
        'text-align': 'center'
      }
      return newtext
    }
    if (type === 'Image') {
      const newImage: MaileditorImage = new MaileditorImage();
      newImage.type = 'Image';
      newImage.url = '';
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
      newButton.buttontext = 'Button Text'
      newButton.buttonurl = 'www.xbms.io';
      newButton.style = {
        'color': 'black',
        'background-color': 'white',
        'width': '200px',
        'height': '40px',
        'align': 'center',
        'border': 'solid',
        'border-bottom': '',
        'border-left': '',
        'border-radius': '10px',
        'border-right': '',
        'border-top': '',
        'font-family': '',
        'font-size': '',
        'font-style': '',
        'font-weight': '',
        'padding': '2px',
        'text-decoration': '',
        'text-transform': '',
        'vertical-align': '',
      }
      return newButton
    }
    if (type === 'Divider') {
      const newDivider: MaileditorDivider = new MaileditorDivider();
      newDivider.type = 'Divider';
      newDivider.style = {
        'border-color': 'black',
        'border-style': 'solid',
        'border-width': '2px',
        'container-background-color': '',
        'padding': '1px',
        'padding-bottom': '',
        'padding-left': '',
        'padding-right': '',
        'padding-top': '',
        'width': '100%'
      }
      return newDivider
    }
  }


  /**  Convert to html template
   * @params takes the arrray the template and converts them to mplm
   * @returns confirmation of created template
  */
  private ConvertToMail(): void {
    // section
    let mjml = ['<mjml>', '<mj-body>'],
    i = 0;
    const body = [];

    const sectionlenght = this.mailtemplateArray.length;
    this.mailtemplateArray.forEach((section, index1) => {
       // create section mjml
      let sectionStyle = this.sectionStyleArray[index1].style;
      sectionStyle = JSON.stringify(sectionStyle);
      if (sectionStyle){sectionStyle = sectionStyle.replace(/:/g, '=')}
      const sectionArray = [];
      let sectionopenstring: string;
      if (sectionStyle) {sectionopenstring = '<mj-section ' + sectionStyle + '>';} else {
        sectionopenstring = '<mj-section>';
      }
      sectionArray.push(sectionopenstring);
      section.forEach((column, index2) => {
        // create column mjml
         let columnstyle = this.columnStyleArray[index2].style;
         columnstyle = JSON.stringify(columnstyle);
         if (columnstyle){columnstyle = columnstyle.replace(/:/g, '=')}
         let columnopenstring: string;
         if (columnstyle) {
          columnopenstring = '<mj-column ' + columnstyle + '>'} else {
            columnopenstring = '<mj-column>'}
         const columnArray = [];
         columnArray.push(columnopenstring);
        column.forEach((item, index3) => {
          let mjmlitem: string;
          if (item.type === 'Text') {
           mjmlitem =  this.createText(item)}
          if (item.type === 'Image') {
            mjmlitem = this.createImage(item)}
          if (item.type === 'Divider') {
            mjmlitem =  this.createDivider(item)}
          if (item.type === 'Button') {
            mjmlitem = this.createButton(item)}
          if (mjmlitem) {
            columnArray.push(mjmlitem);
          }
        });
        columnArray.push('</mj-column>');
        sectionArray.push(columnArray.join(''));
      });
      sectionArray.push('</mj-section>');
      body.push(sectionArray);
      i++
    })
    if (i === sectionlenght) {
      const bodystring = body.join('');
      mjml.push(bodystring);
      mjml.push( '</mj-body>', '</mjml>');
      let mjmlfinal = mjml.join('');
      mjmlfinal = mjmlfinal.replace(/[\}\{]+/g, '');
      mjmlfinal = mjmlfinal.replace(/[\,]+/g, ' ');
      console.log(mjmlfinal);
    this.mailingApi.mjml(mjmlfinal).subscribe((data) =>
    console.log(data.html)) }
  }

  private createText(item){
    const textarray = [];
    let textstring: string;
    let itemstyle = JSON.stringify(item.style);
    if(itemstyle){itemstyle = itemstyle.replace(/:/g, '=')}
    textarray.push('<mj-text>')
    if (itemstyle) {
    textarray.push('<' + item.typeformat + ' style= ' + itemstyle + '>')} else {
      textarray.push('<' + item.typeformat + '>')}
    textarray.push(item.content)
    textarray.push('</' + item.typeformat + '>')
    textarray.push('</mj-text>');
    textstring = textarray.join('')
    return(textstring);
  }

  private createImage(item){
    const imagearray = [];
    let imagestring: string;
    let itemstyle = JSON.stringify(item.style);
    if (itemstyle) {itemstyle = itemstyle.replace(/:/g,"=")}
    if (itemstyle) {
      imagearray.push('<mj-image src= ' + item.url + ' style= ' +  itemstyle + '>')} else {
        imagearray.push('<mj-image src= ' + item.url + '>')}
    imagearray.push('</mj-image>')
    imagestring = imagearray.join('')
    return(imagestring)
  }

  private createButton(item){
    const buttonarray = [];
    let buttonstring: string;
    let itemstyle = JSON.stringify(item.style);
    if (itemstyle) {itemstyle = itemstyle.replace(/:/g,"=")}
    if (itemstyle) {
      buttonarray.push('<mj-button ' + itemstyle + ' href= ' + item.url + '>')} else {
        buttonarray.push('<mj-button href= ' + item.url + '>')}
    buttonarray.push(item.buttontext);
    buttonarray.push('</mj-button>');
    buttonstring = buttonarray.join('');
    return(buttonstring)
  }

  private createDivider(item) {
    const dividerarray = [];
    let dividerstring: string;
    let itemstyle = JSON.stringify(item.style);
    if (itemstyle) {itemstyle = itemstyle.replace(/:/g,"=")}
    if (itemstyle) {
      dividerarray.push('<mj-divider ' + itemstyle + '>')} else {
        dividerarray.push('<mj-divider>')}
    dividerarray.push('<mj-divider ' + itemstyle + '>');
    dividerarray.push('</mj-divider>')
    dividerstring = dividerarray.join('')
    return(dividerstring)
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
    // console.log(this.maileditorColumn);
  }

  private resetEdit(): void {
    this.Section = false;
    this.Column = false;
    this.Image = false;
    this.Text = false;
    this.Button = false;
    this.Divider = false;
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
        this.maileditorButton = item;
        break;
      }
      case 'Divider': {
        console.log(item);
        this.Divider = true;
        this.maileditorDivider = item;
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
    this.sectionStyleArray.splice(i1, 1);
  }

  private onDeleteColumnPart(i1, i2): void {
    this.mailtemplateArray[i1].splice(i2, 1);
    this.columnStyleArray[i1].splice(i2, 1);
  }

  private setimgurl(url: string, i1, i2, i3) {
    // url direct
    this.mailtemplateArray[i1][i2][i3].url = url;
  }

  setbackgroundImageColumn(url: string){
    this.maileditorColumn.style['background-image'] = 'url(' + url + ')';
    console.log(this.maileditorColumn);
  }

  setbackgroundImageSection(url: string){
    this.maileditorSection.style['background-image'] = 'url(' + url + ')';
    console.log(this.maileditorSection);
  }

  setbackgroundImageDivider(url: string){
    this.maileditorDivider.style['background-image'] = 'url(' + url + ')';
    console.log(this.maileditorDivider);
  }


}
