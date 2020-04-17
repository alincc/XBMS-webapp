import { Component, OnInit, Input } from '@angular/core';
import { WordpressService } from '../../shared/websiteservice';
import { Publications, PublicationsApi, Relations, RelationsApi, Files } from '../../shared/';
import { XlsxFileUploadComponent } from '../../marketing/xlsx-file-upload/xlsx-file-upload.component';
import { Observable, BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface TranslationFile {
  Position: number;
  Text: string;
  Translations: string;
  Tag: string;
  URL: string;
  Language: string;
}

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})

export class UploadComponent implements OnInit {

  @Input() Relations: Relations;

  public uploaderContent: BehaviorSubject<string> = new BehaviorSubject('Drop Excel File Here, must included "Text and Translation header"');
  public hasBaseDropZoneOver = false;
  website: string;
  username: string;
  password: string;
  hide: true;
  translationFiles: TranslationFile[];
  wpposts = [];
  wppages = [];
  wppagesTranslated = [];
  wppostsTranslated = [];
  setTrans: Files;
  translations: Files[];
  translationSource = [];

  constructor(
    public snackBar: MatSnackBar,
    public RelationsApi: RelationsApi,
    public WordpressService: WordpressService,
    public PublicationsApi: PublicationsApi
  ) { }

  ngOnInit(): void {
  }
  

  getTranslationFiles() {
    this.RelationsApi.getFiles(this.Relations.id, { where: { type: 'translation' } })
      .subscribe((files: Files[]) => {
        console.log(files);
        this.translations = files;
      });
  }

  public postToWordPress(): void {
    //this.WordpressService.publishWP(this.selectedPublications.title, this.selectedPublications.text);
    // this.POSTwordpressApi.create(this.selectedPublications).subscribe(res => {
    //  this.error = res});
  }

  getPosts() {
    this.PublicationsApi.wordpressGetPosts(this.Relations.id, this.Relations.companyId, this.website, this.username, this.password)
      .subscribe(posts => {
        console.log(posts)
        this.wpposts = posts;
      })
  }

  getPages() {
    this.PublicationsApi.wordpressGetPages(this.Relations.id, this.Relations.companyId, this.website, this.username, this.password)
      .subscribe(pages => {
        console.log(pages)
        this.wppages = pages;
      })
  }

  loadTranslations() {
    this.RelationsApi.getFiles(this.Relations.id, { where: { type: 'translations' } })
      .subscribe((files: TranslationFile[]) => {
        console.log(files);
        this.translationFiles = files;
      });
  }

  translate() {
    for (let i = 0; i < this.wppagesTranslated.length; i++) {
      let content = this.wppagesTranslated[i].content;
      for (let y = 0; y < this.translationSource.length; y++) {
        const text = this.translationSource[y].Text;
        const translation = this.translationSource[y].Translation;
        content.replace(text, translation)
      }
      this.wppagesTranslated[i].content = content;
    }

    for (let i = 0; i < this.wppostsTranslated.length; i++) {
      let content = this.wppostsTranslated[i].content;
      for (let y = 0; y < this.translationSource.length; y++) {
        const text = this.translationSource[y].Text;
        const translation = this.translationSource[y].Translation;
        content.replace(text, translation)
      }
      this.wppostsTranslated[i].content = content;
    }
  }

  addTransQueuePost(post, i){
    this.wppostsTranslated.push(post);
    this.wpposts = this.wpposts.splice(i, 1);
  }

  addTransQueuePage(page, i){
    this.wppagesTranslated.push(page);
    this.wppages = this.wpposts.splice(i, 1);
  }


  loadTranslation(url) {

  }

  xlsxUploaded(result) {
    // excel file needs two columns Text and Translation!!
    this.translationSource = result.payload;
    console.log(this.translationSource);
    if (!this.translationSource[0].Text){
      this.openSnackBar('missing Text column');
      this.translationSource.length = 0;
    }
    if (!this.translationSource[0].Translation){
      this.openSnackBar('missing Translation column');
      this.translationSource.length = 0;
    }
    
  }



  public openSnackBar(message: string) {
    this.snackBar.open(message, undefined, {
      duration: 2000,
      panelClass: 'snackbar-class'
    });
  }

}
