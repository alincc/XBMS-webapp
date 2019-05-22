/** Todo list:
 * Add support for gif generator: https://www.npmjs.com/package/gifencoder  
 * Add subject name + emoticon support
 * Add image resize support
 * */
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, copyArrayItem } from '@angular/cdk/drag-drop';
import {
  Maileditormodels, MaileditorSection, MaileditorColumn,
  MaileditorImage, MaileditorText, MaileditorButton, MaileditorDivider, MaileditorCarousel, MaileditorCarouselImage, MaileditorAccordion,
  MaileditorAccordionElement, MaileditorAccordionText, MaileditorAccordionTitle, MaileditorSocial, MaileditorSocialElement
} from './maileditormodel/maileditormodels';
import { FileuploadComponent } from '../../shared/fileupload/fileupload.component';
import { Relations, RelationsApi, BASE_URL, CompanyApi, Company } from '../../shared';
import { Mailing, MailingApi } from '../../shared/sdk';
import { TextEditorDialog } from './texteditordialog.component';
import { DomSanitizer } from '@angular/platform-browser';
import { DialogsService } from './../../dialogsservice/dialogs.service';
import { MatSnackBar, MatSnackBarConfig, MatInput, MatAutocompleteSelectedEvent } from '@angular/material';
import { map, startWith } from "rxjs/operators";
import { Observable, BehaviorSubject } from 'rxjs';
import { fontoptions } from '../../settings/google-fonts-list';

import { FormControl, FormGroupDirective, NgForm, Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-maileditor',
  templateUrl: './maileditor.component.html',
  styleUrls: ['./maileditor.component.scss']
})
export class MaileditorComponent implements OnInit {


  @Input('option') option: Relations;
  @Input('account') account: Account;
  @Input('updateMailingObj') updateMailingObj: Mailing;
  @Input('company') company: Company; 

  public slideIndex = 1;
  public showprogressbar = false;

  public Section = false;
  public Column = false;
  public Image = false;
  public Text = false;
  public Button = false;
  public Divider = false;
  public Carousel = false;
  public Accordion = false;
  public Social = false;
  public showemoji = false;
  public showemojibutton = false;
  public Footer = false;

  public selectedborder = {
    width: '0px',
    style: 'solid',
    color: 'black',
  }

  public maileditorText: MaileditorText = new MaileditorText();
  public maileditorFooter: MaileditorText = new MaileditorText();
  public maileditorImage: MaileditorImage = new MaileditorImage();
  public maileditorColumn: MaileditorColumn = new MaileditorColumn();
  public maileditorSection: MaileditorSection = new MaileditorSection();
  public maileditorButton: MaileditorButton = new MaileditorButton();
  public maileditorDivider: MaileditorDivider = new MaileditorDivider();
  public maileditorCarousel: MaileditorCarousel = new MaileditorCarousel();
  public maileditorCarouselImage: MaileditorCarouselImage = new MaileditorCarouselImage();
  public maileditorAccordion: MaileditorAccordion = new MaileditorAccordion();
  public maileditorSocial: MaileditorSocial = new MaileditorSocial();
  public maileditorSocialElement: MaileditorSocialElement = new MaileditorSocialElement();

  // Delete seperate accordion parts?
  public maileditorAccordionElement: MaileditorAccordionElement = new MaileditorAccordionElement();
  public maileditorAccordionText: MaileditorAccordionText = new MaileditorAccordionText();
  public maileditorAcoordionTitle: MaileditorAccordionTitle = new MaileditorAccordionTitle();
  // template --> Section --> Column
  // section can contain only column
  // template can contain only sections
  public textfont: string;
  public columnArray = [];
  public sectionArray = []; // this.ColumnArray
  public mailtemplateArray = [];
  public sectionStyleArray = [];
  public columnStyleArray = [];
  public subject: string;
  public preview: string;
  public font: string;
  public updatemail = false;
  public previewOrSubject: string;
  // public company: Company; 

  // create version 0n drop event
  // needs at least one item at init
  // Connect Toolsect to SectionArray
  private toolboximage = this.createNewItem('Image');
  private toolboxtext = this.createNewItem('Text');
  private toolboxbutton = this.createNewItem('Button');
  private toolboxdivider = this.createNewItem('Divider');
  private toolboxcarousel = this.createNewItem('Carousel');
  private toolboxAccordion = this.createNewItem('Accordion');
  private toolboxSocial = this.createNewItem('Social');
  private toolboxfooter;
  public fontlist: string[] = fontoptions;

  
  toolset = [
    this.toolboximage,
    this.toolboxtext,
    this.toolboxbutton,
    this.toolboxdivider,
    this.toolboxcarousel,
    this.toolboxAccordion,
    this.toolboxSocial,
  ];

  myControlfont: FormControl = new FormControl();
  filteredfonts: Observable<string[]>;


  constructor(
    public snackBar: MatSnackBar,
    public RelationsApi: RelationsApi,
    public CompanyApi: CompanyApi,
    public dialogsService: DialogsService,
    public mailingApi: MailingApi,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.toolboxfooter = this.createNewItem('Footer');
    this.toolset.push(this.toolboxfooter);
    // when openeing existing mail from template overview udpatemailingobj will exist. 
    if (this.updateMailingObj !== undefined) {
      if (Object.keys(this.updateMailingObj).length > 0) {
        this.mailtemplateArray = this.updateMailingObj.templatearray;
        this.sectionStyleArray = this.updateMailingObj.sectionStyle;
        this.columnStyleArray = this.updateMailingObj.columnStyle;
        this.subject = this.updateMailingObj.subject;
        console.log("existing mailing", this.updateMailingObj);
        this.updatemail = true;
      } else {
        this.setupTemplate();
      }
    } else {
      this.setupTemplate();
    }

    // move creation to wait for company info to resolve
    // console.log(this.company);


    this.filteredfonts = this.myControlfont.valueChanges.pipe(
      startWith(''),
      map(value => this._filterfont(value))
    );
  }

  private _filterfont(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.fontlist.filter(font => font.toLowerCase().includes(filterValue));
  }

  setupTemplate(): void {
    this.mailtemplateArray = [];
    this.sectionStyleArray = [];
    this.columnStyleArray = [];
    this.addToMailTemplateArray()
    const texttool = this.createNewItem('Text')
    this.mailtemplateArray[0][0].push(texttool);
    console.log("standard components created");

  }

  addToMailTemplateArray(): void {
    // add section to mailtemplate and to style array
    const section = [];
    this.mailtemplateArray.push(section);

    const sectionstyleIns: MaileditorSection = new MaileditorSection();
    sectionstyleIns.style = {
      'background-color': '',
      'background-repeat': '',
      'background-size': '',
      'background-url': '',
      'border': '',
      'border-bottom': '',
      'border-left': '',
      'border-radius': '',
      'border-right': '',
      'border-top': '',
      'direction': 'ltr',
      'full-width': 'full-width', // full-width
      'padding': '',
      'padding-bottom': '',
      'padding-left': '',
      'padding-right': '',
      'padding-top': '',
      'text-align': 'center',
      'vertical-align': 'top'
    }
    this.sectionStyleArray.push(sectionstyleIns);
    this.columnStyleArray.push([]);
    let index = this.mailtemplateArray.length // add reference column for style 
    index = index - 1; // array count
    this.addToSectionArray(index);
  }

  addToSectionArray(i1): void {
    // add column to section array and to style array
    const column = [[]];
    this.mailtemplateArray[i1].push([]);
    const columnstyleIns: MaileditorColumn = new MaileditorColumn();
    columnstyleIns.setflexalign = 'space-around center';
    columnstyleIns.style = {
      'background-color': 'none',
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
    // console.log(i1, this.columnStyleArray)
    this.columnStyleArray[i1].push(columnstyleIns);
  }

  // creat array per
  drop(event: CdkDragDrop<string[]>, i1, i2) {
    console.log(i1, i2, event)
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      // if eventcontainer is new column create new eventcontainer
    } else if (event.previousContainer.id === 'cdk-drop-list-0') {
      const arrayItem = [];
      event.previousContainer.data.forEach((element) => {
        arrayItem.push(element)
      })
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
      newtext.content = 'start writing'; // this.sanitizer.bypassSecurityTrustHtml('start writing');
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
    if (type === 'Footer') {
      const newfooter: MaileditorText = new MaileditorText();
      newfooter.type = 'Footer';
      const footercontent =  this.company.companyname + ', ' + this.company.address + ', ' +
      this.company.zipcode + ', ' + this.company.country +
      ', feel free to <a href="%unsubscribe_url%">unsubscribe</a> if you do not like to receive our emails';
      newfooter.content = footercontent; // this.sanitizer.bypassSecurityTrustHtml(footercontent);
      newfooter.typeformat = 'p';
      newfooter.style = {
        'color': 'grey',
        'font-family': 'Verdana',
        'font-size': '6pt',
        'font-style': 'normal',
        'font-weight': '',
        'line-height': '',
        'letter-spacing': '1px',
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
      return newfooter
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
        'width': "100px"
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
        'background-color': '',
        'width': '200px',
        'height': '40px',
        'align': 'center',
        'border': 'solid',
        'border-bottom': '0px',
        'border-left': '0px',
        'border-radius': '10px',
        'border-right': '0px',
        'border-top': '0px',
        'font-family': 'Verdana',
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
    if (type === 'Carousel') {
      const newImage = this.NewCarouselImage();
      const newCarousel: MaileditorCarousel = new MaileditorCarousel();
      newCarousel.type = 'Carousel';
      newCarousel.images = [];
      newCarousel.images.push(newImage)
      newCarousel.style = {
        'align': 'center',
        'background-color': '',
        'border-radius': '5px',
        'icon-width': '20px',
        'left-icon': BASE_URL + '/assets/baseline_keyboard_arrow_left_black_18dp.png',
        'right-icon': BASE_URL + '/assets/baseline_keyboard_arrow_right_black_18dp.png',
        'tb-border': '1px',
        'tb-border-radius': '4px',
        'tb-hover-border-color': '',
        'tb-selected-border-color': '',
        'tb-width': '',
        'thumbnails': '',
      }
      return newCarousel
    }
    if (type === 'Accordion') {
      const newAccordion: MaileditorAccordion = new MaileditorAccordion();
      newAccordion.type = 'Accordion';
      const newElement = this.newAccordionElement();
      newAccordion.elements = [];
      newAccordion.elements.push(newElement);
      newAccordion.style = {
        'border': '',
        'container-background-color': '',
        'font-family': 'Verdana',
        'icon-align': '',
        'icon-height': '20px',
        'icon-position': 'right',
        'icon-unwrapped-alt': '-',
        'icon-unwrapped-url': BASE_URL + '/assets/baseline_keyboard_arrow_down_black_18dp.png',
        'icon-width': '20px',
        'icon-wrapped-alt': '+',
        'icon-wrapped-url': BASE_URL + '/assets/baseline_keyboard_arrow_up_black_18dp.png',
        'padding': '2px 2px',
        'padding-bottom': '',
        'paddinng-left': '',
        'padding-right': '',
        'padding-top': ''
      }
      return newAccordion;
    }
    if (type === 'Social') {
      const newSocial: MaileditorSocial = new MaileditorSocial();
      newSocial.type = 'Social';
      const newSocialElement = this.newSocialElement();
      newSocial.elements = [];
      newSocial.elements.push(newSocialElement);
      newSocial.style = {
        'color': '',
        'container-background-color': '',
        'width': '',
        'height': '',
        'align': '',
        'border': '',
        'border-bottom': '',
        'border-left': '',
        'border-radius': '',
        'border-right': '',
        'border-top': '',
        'font-family': '',
        'font-size': '',
        'font-style': '',
        'font-weight': '',
        'padding': '',
        'text-transform': '',
        'vertical-align': '',
        'icon-height': '',
        'icon-size': '',
        'inner-padding': '',
        'line-height': '',
        'mode': '',
        'icon-padding': '',
        'text-padding': '',
        'text-decoration': ''
      }
      return newSocial;
    }

  }


  private NewCarouselImage() {
    const newCarouselImage: MaileditorCarouselImage = new MaileditorCarouselImage();
    newCarouselImage.type = 'Carouselimage';
    newCarouselImage.style = {
      'alt': '',
      'href': '',
      'rel': '',
      'src': '',
      'target': '',
      'thumbnails-src': '',
      'title': ''
    }
    return newCarouselImage
  }

  private newAccordionElement() {
    const newAccordionElement: MaileditorAccordionElement = new MaileditorAccordionElement();
    newAccordionElement.type = 'Accordionelement';
    newAccordionElement.title = this.newAccordionTitle();
    newAccordionElement.text = this.newAccordionText();
    newAccordionElement.style = {
      'background-color': '',
      'font-family': 'Verdana',
      'icon-align': 'middle',
      'icon-height': '20px',
      'icon-position': 'right',
      'icon-unwrapped-alt': '-',
      'icon-unwrapped-url': BASE_URL + '/assets/baseline_keyboard_arrow_down_black_18dp.png',
      'icon-width': '20px',
      'icon-wrapped-alt': '+',
      'icon-wrapped-url': BASE_URL + '/assets/baseline_keyboard_arrow_up_black_18dp.png',
      'padding': '',
      'padding-bottom': '10px',
      'paddinng-left': '10px',
      'padding-right': '10px',
      'padding-top': '10px'
    }
    return newAccordionElement
  }

  private newAccordionTitle() {
    const newAccordionTitle: MaileditorAccordionTitle = new MaileditorAccordionTitle();
    newAccordionTitle.type = 'Accordiontitle';
    newAccordionTitle.content = 'Title';
    newAccordionTitle.style = {
      'color': '',
      'background-color': '',
      'align': '',
      'font-family': 'Verdana',
      'font-size': '',
      'padding': '',
      'padding-bottom': '',
      'padding-left': '',
      'padding-right': '',
      'padding-top': '',
    }
    return newAccordionTitle
  }

  private newAccordionText() {
    const newAccordionText: MaileditorAccordionText = new MaileditorAccordionText();
    newAccordionText.type = 'Accordiontext';
    newAccordionText.content = 'write here';
    newAccordionText.style = {
      'color': '',
      'background-color': '',
      'align': '',
      'font-family': 'Verdana',
      'font-size': '',
      'padding': '',
      'padding-bottom': '5px',
      'padding-left': '5px',
      'padding-right': '5px',
      'padding-top': '5px',
    }
    return newAccordionText;
  }

  private newSocialElement() {
    const newSocialElement: MaileditorSocialElement = new MaileditorSocialElement();
    newSocialElement.type = 'Socialelement';
    newSocialElement.content = 'My Social Link';
    newSocialElement.iconlocation = '';
    newSocialElement.style = {
      'color': '',
      'container-background-color': '',
      'width': '',
      'height': '20px',
      'align': '',
      'border': '',
      'border-bottom': '',
      'border-left': '',
      'border-radius': '',
      'border-right': '',
      'border-top': '',
      'font-family': '',
      'font-size': '',
      'font-style': '',
      'font-weight': '',
      'padding': '',
      'text-transform': '',
      'vertical-align': '',
      'icon-height': '',
      'icon-size': '20px',
      'inner-padding': '',
      'line-height': '',
      'mode': '',
      'icon-padding': '',
      'text-padding': '',
      'text-decoration': '',
      'href': '',
      'name': '',
    }
    return newSocialElement;
  }

  /**  Convert to html template
   * @params takes the arrray the template/style and converts them to mjml
   * @returns confirmation of created template
  */
  private ConvertToMail(): void {
    this.showprogressbar = true;
    let templArray = this.mailtemplateArray;
    let sectionStyle = this.sectionStyleArray;
    let columnStyle = this.columnStyleArray;
    let sendobject = { templArray, sectionStyle, columnStyle };

    this.mailingApi.mjml(this.option.id, sendobject).subscribe((data) => {
      this.showprogressbar = false;
      // console.log(data.html);
      const previewstring = '<div style="width: 600px; height: 500px;>"' + data.html + '</div>';
      const previewhtml = [];
      previewhtml.push(this.sanitizer.bypassSecurityTrustHtml(previewstring));
      this.dialogsService
        .confirm('Preview', 'Add to Templates?', previewhtml[0])
        .subscribe((res) => {
          if (res) {
            if (Object.keys(this.updateMailingObj).length > 0) {
              this.updateMailingObj.subject = this.subject;
              this.updateMailingObj.relationname = this.option.relationname;
              this.updateMailingObj.html = data.html;
              this.updateMailingObj.templatearray = templArray;
              this.updateMailingObj.sectionStyle = sectionStyle;
              this.updateMailingObj.columnStyle = columnStyle;

              this.RelationsApi.updateByIdMailing(this.option.id, this.updateMailingObj.id, this.updateMailingObj)
                .subscribe(res => {
                  this.snackBar.open("Template Updated", undefined, {
                    duration: 2000,
                    panelClass: 'snackbar-class'
                  });
                });
            } else {
              this.RelationsApi.createMailing(this.option.id, {
                subject: this.subject,
                relationname: this.option.relationname,
                html: data.html,
                templatearray: templArray,
                sectionStyle: sectionStyle,
                columnStyle: columnStyle,
                preview: this.preview,
                font: this.font
              })
                .subscribe(res => {
                  this.snackBar.open("Template Created", undefined, {
                    duration: 2000,
                    panelClass: 'snackbar-class',
                  }
                  );
                });
            }

          }
        });
    })
  }

  private onSelectSectionPart(i1): void {
    this.resetEdit()
    this.Section = true;
    this.maileditorSection = new MaileditorSection();
    this.maileditorSection = this.sectionStyleArray[i1];
    this.onSelectBorder(this.maileditorSection);
  }

  private onSelectColumnPart(i1, i2): void {
    this.resetEdit()
    this.Column = true;
    this.maileditorColumn = this.columnStyleArray[i1][i2]
    // console.log(this.maileditorColumn);
    this.onSelectBorder(this.maileditorColumn);
  }

  private onSelectBorder(maileditorPart): void {
    console.log(maileditorPart);
    if (maileditorPart.style.border.length > 0) {
      const borderarray = maileditorPart.style.border.split(' ');
      this.selectedborder.width = borderarray[0];
      this.selectedborder.width = this.selectedborder.width.replace('px', '')
      this.selectedborder.style = borderarray[1];
      this.selectedborder.color = borderarray[2];
    } else {
      this.selectedborder = {
        width: '0',
        style: 'solid',
        color: 'black',
      }
    }
  }

  private onChangeBorder(maileditorPart): void {
    console.log(maileditorPart);
    const borderarray = [];
    borderarray.push(this.selectedborder.width + 'px');
    borderarray.push(this.selectedborder.style);
    const indexChar = this.selectedborder.color.indexOf(';')
    if (indexChar !== -1) { this.selectedborder.color = this.selectedborder.color + ';' }
    borderarray.push(this.selectedborder.color);
    const borderstring = borderarray.join(' ');
    maileditorPart.style.border = borderstring;
    console.log(maileditorPart.style.border)
  }

  private resetEdit(): void {
    this.Section = false;
    this.Column = false;
    this.Image = false;
    this.Text = false;
    this.Button = false;
    this.Divider = false;
    this.Carousel = false;
    this.Accordion = false;
    this.Social = false;
    this.Footer = false;
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
      case 'Carousel': {
        console.log(item);
        this.Carousel = true;
        this.maileditorCarousel = item;
        break;
      }
      case 'Accordion': {
        console.log(item);
        this.Accordion = true;
        this.maileditorAccordion = item;
        break;
      }
      case 'Social': {
        console.log(item);
        this.Social = true;
        this.maileditorSocial = item;
        break;
      }
      case 'Footer': {
        console.log(item);
        this.Footer = true;
        this.maileditorFooter = item;
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

  private onDeleteItemPart(i1, i2, i3): void {
    this.mailtemplateArray[i1][i2].splice(i3, 1);
  }

  private setimgurl(url: string, i1, i2, i3) {
    // url direct
    this.mailtemplateArray[i1][i2][i3].url = url;
  }


  setbackgroundImageSection(url: string) {
    this.maileditorSection.style['background-url'] = url;
    this.maileditorSection.style['background-image'] = 'url(' + url + ')'; //pure for editor purposes
    console.log(this.maileditorSection);
  }

  setbackgroundImageDivider(url: string) {
    this.maileditorDivider.style['background-image'] = 'url(' + url + ')';
    console.log(this.maileditorDivider);
  }

  setCarouselImage(url: string, i) {
    this.maileditorCarousel.images[i].style.src = url;
    console.log(this.maileditorSection);
    if (this.maileditorCarouselImage.style.src) { this.showSlides(this.slideIndex); }
  }

  openDialog(): void {
    console.log(this.maileditorText.content)
    const dialogRef = this.dialog.open(TextEditorDialog, {
      width: '800px',
      data: this.maileditorText.content, //changingThisBreaksApplicationSecurity,
      id: this.option.id
    });

    dialogRef.afterClosed().subscribe(result => {
      this.maileditorText.content = result; //this.sanitizer.bypassSecurityTrustHtml(result);
    });
  }


  addImageToCarouselArray() {
    let newCarouselImage = this.NewCarouselImage();
    this.maileditorCarousel.images.push(newCarouselImage);
    this.slideIndex = 1;
    this.showSlides(this.slideIndex);
  }

  addElementToAccordionArray() {
    let newAccordionElement = this.newAccordionElement();
    this.maileditorAccordion.elements.push(newAccordionElement);
  }

  addElementToSocialArray() {
    let newSocialElement = this.newSocialElement();
    this.maileditorSocial.elements.push(newSocialElement);
  }

  togglebackgroundrepeat() {
    if (this.maileditorSection.style['background-repeat'] === 'repeat') {
      this.maileditorSection.style['background-repeat'] = null;
    }
    if (this.maileditorSection.style['background-repeat'] !== 'repeat') {
      this.maileditorSection.style['background-repeat'] = 'repeat';
    }

  }

  // Next/previous controls
  plusSlides(n) {
    this.showSlides(this.slideIndex += n);
  }

  // Thumbnail image controls
  currentSlide(n) {
    this.showSlides(this.slideIndex = n + 1);
  }

  showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides") as HTMLCollectionOf<HTMLElement>;
    console.log(slides);

    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) { this.slideIndex = 1 }
    if (n < 1) { this.slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace("active", "");
    }
    slides[this.slideIndex - 1].style.display = "block";
    dots[this.slideIndex - 1].className += "active";
  }

  setemoji(event) {
    // console.log(event);
    const bufStr = String.fromCodePoint(parseInt(event.emoji.unified, 16));
    // console.log(bufStr);
    if (this.previewOrSubject === 'subject'){
    if (this.subject === undefined) { this.subject = "" }
    this.subject = this.subject + bufStr; } else {
      if (this.preview === undefined) { this.preview = "" }
      this.preview = this.preview + bufStr; 
    }
    this.onshowemoji();
  }

  onshowemoji(selected?) {
    if (this.showemoji) { this.showemoji = false } else {
      this.showemoji = true;
    }
    if (selected){
    this.previewOrSubject = selected; }
  }

  setemojibutton(event) {
    const bufStr = String.fromCodePoint(parseInt(event.emoji.unified, 16));
    // console.log(bufStr);
    if (this.maileditorButton.buttontext === undefined) { this.maileditorButton.buttontext = "" }
    this.maileditorButton.buttontext = this.maileditorButton.buttontext + bufStr;
    this.onshowemojiButton();
  }

  onshowemojiButton() {
    if (this.showemojibutton) { this.showemojibutton = false } else {
      this.showemojibutton = true;
    }
  }

  CreateNewMail(): void {
    // reset existing and rebuild component
    this.updateMailingObj = undefined;
    this.setupTemplate();
  }

  onChangeSocial(maileditorSocial: MaileditorSocial, i): void {
    
    if (maileditorSocial.elements[i].style.name === 'facebook') {
      maileditorSocial.elements[i].iconlocation = BASE_URL + '/assets/icons/facebook.png'
    }

    if (maileditorSocial.elements[i].style.name === 'xing') {
      maileditorSocial.elements[i].iconlocation = BASE_URL + '/assets/icons/xing.png'
    }

    if (maileditorSocial.elements[i].style.name === 'instagram') {
      maileditorSocial.elements[i].iconlocation = BASE_URL + '/assets/icons/instagram.png'
    }

    if (maileditorSocial.elements[i].style.name === 'tumblr') {
      maileditorSocial.elements[i].iconlocation = BASE_URL + '/assets/icons/tumblr.png'
    }

    if (maileditorSocial.elements[i].style.name === 'linkedin') {
      maileditorSocial.elements[i].iconlocation = BASE_URL + '/assets/icons/linkedin.png'
    }

    if (maileditorSocial.elements[i].style.name === 'twitter') {
      maileditorSocial.elements[i].iconlocation = BASE_URL + '/assets/icons/twitter.png'
    }

    if (maileditorSocial.elements[i].style.name === 'github') {
      maileditorSocial.elements[i].iconlocation = BASE_URL + '/assets/icons/github.png'
    }
    if (maileditorSocial.elements[i].style.name === 'instagram') {
      maileditorSocial.elements[i].iconlocation = BASE_URL + '/assets/icons/instagram.png'
    }
    if (maileditorSocial.elements[i].style.name === 'web') {
      maileditorSocial.elements[i].iconlocation = BASE_URL + '/assets/icons/colour-cirle-set/web/cloud.png'
    }
    if (maileditorSocial.elements[i].style.name === 'snapchat') {
      maileditorSocial.elements[i].iconlocation = BASE_URL + '/assets/icons/snapchat.png'
    }
    if (maileditorSocial.elements[i].style.name === 'youtube') {
      maileditorSocial.elements[i].iconlocation = BASE_URL + '/assets/icons/youtube.png'
    }
    if (maileditorSocial.elements[i].style.name === 'vimeo') {
      maileditorSocial.elements[i].iconlocation = BASE_URL + '/assets/icons/vimeo.png'
    }
    console.log(maileditorSocial);
  }

  copyMessage(val: string) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  changeverticalalign() {
    // flex-start  flex-end space-around center
    if (this.maileditorColumn.style['vertical-align'] === 'top') { this.maileditorColumn.setflexalign = 'start' }
    if (this.maileditorColumn.style['vertical-align'] === 'middle') { this.maileditorColumn.setflexalign = 'space-around center' }
    if (this.maileditorColumn.style['vertical-align'] === 'bottom') { this.maileditorColumn.setflexalign = 'end' }
    console.log(this.maileditorColumn);
  }
}


