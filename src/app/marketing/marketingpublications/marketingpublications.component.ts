import { Component, OnInit, Input } from '@angular/core';
import {
  LoopBackConfig,
  PublicationsApi,
  Publications,
  BASE_URL,
  API_VERSION,
  Container,
  ContainerApi,
  Translation,
  TranslationApi,
  Translationjob,
  TranslationjobApi,
  Relations,
  RelationsApi,
  Account,
  AccountApi,
  Company,
  CompanyApi,
  ChannelsApi,
  Files,
  Mailing,
  MailingApi,
  MailinglistApi,
  Mailinglist,
  GoogleanalyticsApi,
  Googleanalytics,
  MarketingplannereventsApi,
  Marketingplannerevents,
  Adwords,
  AdwordsApi,
  timezones,
  CrawlwebApi,
  ArticlereposterApi
} from '../../shared/';
import { DialogsService } from './../../dialogsservice/dialogs.service';
import { WordpressService } from '../../shared/websiteservice';
import { languages } from '../../shared/listsgeneral/languages';
import { countrylist } from '../../shared/listsgeneral/countrylist';
import { HttpClient } from '@angular/common/http';

export class tone { score: number; tone_name: string; }

export class Dynatext {
  abstract: string;
  keywords: string;
  tag: string;
  text: string;
  url: string;
  title: string;
  tone: Array<tone>;
}

export interface Block {
  type: string;
  id: string;
  content: string;
  style: {
    'z-index': number,
    width: string;
    height: string;
    opacity: 1;
    margin: string;
    padding: string;
    'box-shadow': string;
    'background-color': string;
    'border-radius': string;
  };
  edit: boolean;

}

export function createBlock(type, pubLen): {
  type: string;
  id: string;
  style: {
    'z-index': number,
    width: string;
    height: string;
    opacity: 1;
    margin: string;
    padding: string;
    'box-shadow': string;
    'background-color': string;
    'border-radius': string;
  };
  edit: boolean;
} {
  let newid = 'bl' + pubLen;
  let newblock: Block = {
    type: type,
    id: newid,
    content: '',
    style: {
      'z-index': 0,
      width: '100%',
      height: '100%',
      opacity: 1,
      margin: '10px',
      padding: '10px',
      'box-shadow': '',
      'background-color': '',
      'border-radius': ''
    },
    edit: true
  }
 
  return newblock;
}


@Component({
  selector: 'app-marketingpublications',
  templateUrl: './marketingpublications.component.html',
  styleUrls: ['./marketingpublications.component.scss']
})
export class MarketingpublicationsComponent implements OnInit {

  @Input() Account: Account;
  @Input() SelectedRelation: Relations;
  @Input() option: Relations;
  @Input() company: Company;
  //@Input() selectedPublications: Publications;
  public aspectratio;
  public editablevideo: Files;
  public editablevideos: Files[];
  public Publications: Publications[];
  public selectedPublications: Publications;
  public limitresult: 10;
  public numbers = [
    { value: '1', viewValue: '1' },
    { value: '20', viewValue: '20' },
    { value: '30', viewValue: '30' }
  ];
  public listviewxsshow = false;
  public languages = languages;
  public countrylist = countrylist;
  public dynatext: Dynatext[];
  public searchdynatext = false;
  public timeframes = [
    { name: 'None', value: '' },
    { name: '1 day', value: '1d' },
    { name: '2 days', value: '2d' },
    { name: '3 days', value: '3d' },
    { name: '7 days', value: '7d' },
    { name: '1 months', value: '1m' },
    { name: '2 months', value: '2m' },
    { name: '3 months', value: '3m' },
    { name: '1 year', value: '1y' },
    { name: '2 years', value: '2y' },
    { name: '3 years', value: '3y' },
  ];
  public minDate = new Date();
  public maxDate = new Date(2030, 0, 1);

  public website: string;
  public username: string;
  public password: string;
  public template: 'default';
  public changenow = true;

  constructor(
    public http: HttpClient,
    public articlereposterApi: ArticlereposterApi,
    public crawlwebapi: CrawlwebApi,
    public PublicationsApi: PublicationsApi,
    public RelationsApi: RelationsApi,
    public dialogsService: DialogsService,
    public WordpressService: WordpressService,
  ) { }

  ngOnInit() {

  }

  getAnimationFiles(){
    this.RelationsApi.getFiles(this.option.id, { where: { template: { "neq": null }, type: 'video' } })
    .subscribe((files: Files[]) => {
      this.editablevideos = files;
    });
  }
  

  swiperight(e) {
    console.log(e);
    this.listviewxsshow = true;
  }

  swipeleft(e) {
    console.log(e);
    this.listviewxsshow = false;
  }

  // test selection criteria
  getPublicationsList(): void {
    this.RelationsApi.findById(this.option.id, {
      where: {
        date: {
          // gt: Date.now() - this.onemonth,
          limit: 20,
          order: 'date'
        }
      }
    })
      .subscribe((publications: Publications[]) => this.Publications = publications);
  }

  // search
  searchGo(name: string): void {
    name = name.charAt(0).toUpperCase() + name.slice(1);
    name = name.trim();
    this.PublicationsApi.find({ where: { or: [{ newstitle: name }, { newstext: name }] } })
      .subscribe((publications: Publications[]) => this.Publications = publications);
  }



  // select and set parameters Publications
  onSelect(publications: Publications): void {
    if (publications.template === undefined){
      publications.template = [];
    }
    this.selectedPublications = publications;
  }

  // dialog delete on yes activates deletePublications
  public openDialogDelete() {
    this.dialogsService
      .confirm('Delete Relation', 'Are you sure you want to do this?')
      .subscribe(res => {
        this.deletePublications(res);
      });
  }

  // save entry
  savePublication(): void {
    this.RelationsApi.updateByIdPublications(this.option.id, this.selectedPublications.id, this.selectedPublications)
      .subscribe();
  }

  // publish to apps part
  public newpublication(i): void {
    // const publication = this.Translationjob[i];
    const publicationdata: Publications = new Publications();
    // publicationdata.text = publication.translation
    this.RelationsApi.createPublications(this.option, publicationdata)
      .subscribe(res => {
        console.log(res),
          this.selectedPublications = res
      });
    // this.selectedIndex = 0;
  }

  newItem(): void {
    this.RelationsApi.createPublications(this.option.id, { 'companyId': this.Account.companyId, 'title': 'New Item' })
      .subscribe(result => {
        this.selectedPublications = result
      });
  }

  // delete Publications -> check container?
  deletePublications(selectedOption): void {
    if (selectedOption === true) {
      this.PublicationsApi.deleteById(this.selectedPublications.id)
        .subscribe(res => {
          this.getPublications();
        })
    }
  }

  getPublications(): void {
    this.RelationsApi.getPublications(this.option.id, {
      order: 'title DESC'
    }).subscribe((publications: Publications[]) => this.Publications = publications);
  }



  createDynaContent(): void {
    this.searchdynatext = true;
    //let language = this.selectedPublications.language;
    const language = this.languages.find(language => language.name === this.selectedPublications.language);
    const timeframe = this.timeframes.find(timeframe => timeframe.name === this.selectedPublications.timeframe);
    this.articlereposterApi.repost(
      this.option.id,
      this.option.website,
      this.selectedPublications.keywords,
      this.selectedPublications.country,
      'lang_' + language.code,
      this.selectedPublications.location,
      timeframe.value,
      this.selectedPublications.negativekeywords
    )
      .subscribe((res: Dynatext[]) => {
        this.searchdynatext = false;
        this.dynatext = res;
        console.log(this.dynatext)
      });
  }


  setTextPublication(dynatext: Dynatext): void {
    console.log(dynatext);
    this.selectedPublications.text =
      '<h1>' + dynatext.title + '</h1><br>' +
      dynatext.text + '<br> &nbsp;' +
      'Orginal sources: ' + dynatext.url;
  }

  createChannel(): void {

  }



  postToWordPress(date?) {
    console.log(this.option.id, this.option.companyId, this.selectedPublications.website, this.selectedPublications.username,
      this.password, this.selectedPublications.title, this.selectedPublications.text,
      date, this.template)
    if (!date) { date = null } // wp no date wil publish direct
    this.PublicationsApi.wordpressCreatePost(
      this.option.id, this.option.companyId, this.selectedPublications.website, this.selectedPublications.username,
      this.password, this.selectedPublications.title, this.selectedPublications.text,
      date, this.template)
      .subscribe(res => {
        this.selectedPublications.cmsid = res;
        this.savePublication();
      })
  }


  public speedDialFabButtons = [
    {
      icon: 'subject',
      tooltip: 'Add new Text Block'
    },
    {
      icon: 'movie',
      tooltip: 'Add new Video Block'
    },
    {
      icon: 'emoji_nature',
      tooltip: 'Add new Animation Block'
    },
    {
      icon: 'image',
      tooltip: 'Add new Image Block'
    },
    {
      icon: 'check_box_outline_blank',
      tooltip: 'Add Empty Space'
    }
    // {
    //   icon: 'form',
    //   tooltip: 'Add contact form'
    // }
    // {
    //   icon: 'form',
    //   tooltip: 'Add newsletter form'
    // }
  ];

  onSpeedDialFabClicked(btn) {
    // console.log(btn.tooltip);
    let pubLen = this.selectedPublications.template.length;
    if (btn.tooltip === 'Add new Text Block') { this.selectedPublications.template.push(createBlock('text', pubLen)) }
    if (btn.tooltip === 'Add new Video Block') { this.selectedPublications.template.push(createBlock('video', pubLen)) }
    if (btn.tooltip === 'Add new Animation Block') { this.selectedPublications.template.push(createBlock('animation', pubLen)) }
    if (btn.tooltip === 'Add new Image Block') { this.selectedPublications.template.push(createBlock('image', pubLen)) }
    if (btn.tooltip === 'Add Empty Space') { this.selectedPublications.template.push(createBlock('emptyspace', pubLen)) }
    this.detectChange();
  }

  async convertToHTML() {
    /*
    Convert Template array to string removing all dynamic content and convert to static
    Set container DIV
    Add style 
    include external style and fonts
    */
   let htmltemp = [];
    htmltemp.push(`<style>
    
    </style>`)
    htmltemp.push('<div style="flex-flow: row wrap; box-sizing: border-box; display: flex;">');
    for (let i = 0; i < this.selectedPublications.template.length; i++) {
      let type = this.selectedPublications.template[i].type;
      let json = JSON.stringify(this.selectedPublications.template[i].style);
      let style = json.replace(/['"]+/g, '')
      style = style.replace(/,/g, '; ');
      style = style.replace('}', '');
      style = style.replace('{', '');
      let content = this.selectedPublications.template[i].content;
      switch (type) {
        case 'text':
          let text = '<div style="'+ style +'">' + content + '</div>';
          htmltemp.push(text);
          break;
        case 'image':
          let image = '<div style="'+ style +'">' +
          '<img style="max-width:100%; height:auto;" src="' + content + '">'+
          '</div>';
          htmltemp.push(image);
          break;
        case 'video':
          let video = '<div style="'+ style +'">' +
          '<video style="height: 100%; width: 100%;" preload="auto" controls src="' + content + '"></video>'+
          '</div>';
          htmltemp.push(video);
          break;
        case 'animation':
          let animation = '<div style="'+ style +'">' + content + '</div>'
          htmltemp.push(animation);
          break;
        default:
          break;
      }
    }
    htmltemp.push('<script></script>')
    htmltemp.push('</div>');

    let finalhtml = htmltemp.join('');
    this.selectedPublications.text = finalhtml;
    console.log(finalhtml);
  }

  onSelectImage(SelectedImage): void {
    this.selectedPublications.pictureurl = encodeURI(SelectedImage);
    this.detectChange()
  }

  setVideo(event) {
    this.http.get(event, { responseType: 'blob' }).subscribe(blob => {
      var urlCreator = window.URL;
      this.selectedPublications.videourl = urlCreator.createObjectURL(blob);
      this.detectChange();
    })
    this.detectChange()
  }

  onSelectImageBlock(SelectedImage, i): void {
    this.selectedPublications.template[i].content = encodeURI(SelectedImage);
    this.detectChange()
  }

  setVideoBlock(event, i) {
    this.http.get(event, { responseType: 'blob' }).subscribe(blob => {
      var urlCreator = window.URL;
      this.selectedPublications.template[i].content = urlCreator.createObjectURL(blob);
      this.detectChange();
    })
    //this.selectedPublications.template[i].content = event;
    
  }

  deleteBlockItem(i) {
    //console.log(i)
    this.selectedPublications.template.splice(i, 1);
    this.detectChange()
  }

  async detectChange(){
    this.changenow = false;
    setTimeout(() => { this.changenow = true }, 10);
  }

  moveSectionUp(i1): void {
    if (i1 !== 0) {
      const tmp = this.selectedPublications.template[i1];
      this.selectedPublications.template[i1] = this.selectedPublications.template[i1 - 1];
      this.selectedPublications.template[i1 - 1] = tmp;
    }
  }

  moveSectionDown(i1): void {
    if (i1 !== this.selectedPublications.template.length - 1) {
      const tmp = this.selectedPublications.template[i1];
      this.selectedPublications.template[i1] = this.selectedPublications.template[i1 + 1];
      this.selectedPublications.template[i1 + 1] = tmp;
    }
  }

  toggleBlockEdit(block){
    console.log(block)
    if (block.edit === true){
      block.edit = false
    } else {block.edit = true}
  }

  loadVideo(block: Block){

    let canvas = this.editablevideo.canvas[0];
    let myJSON = JSON.stringify(canvas);
    let canvasjson = encodeURIComponent(myJSON);

    let w = parseInt(canvas.width);
    let h = parseInt(canvas.height);
    console.log(w, h)
    this.aspectratio =  (h / w) * 100;
    let containerstyle =  'overflow:hidden; padding-top:'+this.aspectratio+'%; position: relative;';
    let iframestyle = 'border:0; height:100%; left:0; position:absolute; top:0; width:100%;';
    
    let url = 'https://dlcr.xbms.io?id=' + this.editablevideo.id + '&canvas=' + canvasjson + '&repeat=false&remote=true';
    block.content = '<div style="'+ containerstyle +'">'+
    '<iframe style="'+ iframestyle +'" scrolling="no" frameborder="0" allowfullscreen src="' + url +
     '"></iframe></div>'; 
    //console.log(block.content);
  }
  

}
