/** Todo list:
 * Add support for gif generator: https://www.npmjs.com/package/gifencoder  
 * Add subject name + emoticon support
 * Add text editor CKE5 Editor support
 * Add preview
 * Add body style
 * Add save as template
 * */
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, copyArrayItem } from '@angular/cdk/drag-drop';
import {
  Maileditormodels, MaileditorSection, MaileditorColumn,
  MaileditorImage, MaileditorText, MaileditorButton, MaileditorDivider
} from './maileditormodel/maileditormodels';
import { FileuploadComponent } from '../../shared/fileupload/fileupload.component';
import { Relations, BASE_URL } from '../../shared';
import { Mailing, MailingApi } from '../../shared/sdk';
import { TextEditorDialog } from './texteditordialog.component';
import { DomSanitizer } from '@angular/platform-browser';

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
  public subject: string;
  public preview: string;
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
    public mailingApi: MailingApi,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer
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
      'background-color': 'white',
      'background-repeat': 'no-repeat',
      'background-size': '',
      'background-url': '',
      'border': '0px',
      'border-bottom': '0px',
      'border-left': '0px',
      'border-radius': '0px',
      'border-right': '0px',
      'border-top': '0px',
      'direction': 'ltr',
      'full-width': 'full-width',
      'padding': '0px',
      'padding-bottom': '0px',
      'padding-left': '0px',
      'padding-right': '0px',
      'padding-top': '0px',
      'text-align': 'left',
      'vertical-align': 'top'
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
    'background-color': 'white',
    'border': '',
    'border-bottom': '',
    'border-left': '',
    'border-right': '',
    'border-top': '',
    'border-radius': '',
    'width': '100%',
    'vertical-align': '',
    'padding': '',
    'padding-top': '',
    'padding-bottom': '',
    'padding-left': '',
    'padding-right': '',
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
      newtext.content = this.sanitizer.bypassSecurityTrustHtml('start writing') ;
      newtext.typeformat = 'p';
      newtext.style = {
        'color': 'black',
        'font-family': 'Verdana',
        'font-size': '12pt',
        'font-style': 'normal',
        'font-weight': '',
        'line-height': '',
        'letter-spacing': '2px',
        'height': '100%',
        'text-decoration': '',
        'text-transform': '',
        'align': 'center',
        'container-background-color': '',
        'padding': '',
        'padding-top': '',
        'padding-bottom': '',
        'padding-left': '',
        'padding-right': ''
      }
      return newtext
    }
    if (type === 'Image') {
      const newImage: MaileditorImage = new MaileditorImage();
      newImage.type = 'Image';
      newImage.url = '';
      newImage.style = {
        'align': "center",
        'alt': '',
        'border': "none",
        'border-radius': '',
        'container-background-color': '',
        'fluid-on-mobile': '',
        'height': "auto",
        'href': '',
        'padding': "10px",
        'padding-bottom': '',
        'padding-left': '',
        'padding-right': '',
        'padding-top': '',
        'rel': '',
        'src': '',
        'srcset': '',
        'target': "_blank",
        'title': '',
        'width': "100%"
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
        'border-bottom': '0px',
        'border-left': '0px',
        'border-radius': '10px',
        'border-right': '0px',
        'border-top': '0px',
        'font-family': '',
        'font-size': '12pt',
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
        'padding-bottom': '0px',
        'padding-left': '0px',
        'padding-right': '0px',
        'padding-top': '0px',
        'width': '100%'
      }
      return newDivider
    }
  }


  /**  Convert to html template
   * @params takes the arrray the template/style and converts them to mjml
   * @returns confirmation of created template
  */
  private ConvertToMail(): void {
    let templarray = this.mailtemplateArray;
    let sectionstyle = this.sectionStyleArray;
    let columnstyle = this.columnStyleArray;
    let sendobject= {templarray, sectionstyle, columnstyle};
    this.mailingApi.mjml(sendobject).subscribe((data) =>
    console.log(data.html));
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
  
  openDialog(): void {
    console.log(this.maileditorText.content)
    const dialogRef = this.dialog.open(TextEditorDialog, {
      width: '800px',
      data: this.maileditorText.content.changingThisBreaksApplicationSecurity,
      id: this.option.id
    });

    dialogRef.afterClosed().subscribe(result => {
      this.maileditorText.content = this.sanitizer.bypassSecurityTrustHtml(result) ;
    });
  }


}


