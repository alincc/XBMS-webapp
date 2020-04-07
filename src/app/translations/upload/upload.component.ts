import { Component, OnInit, Input } from '@angular/core';
import { WordpressService } from '../../shared/websiteservice';
import { Publications, PublicationsApi, Relations, RelationsApi, Files } from '../../shared/';

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

  constructor(
    public RelationsApi: RelationsApi,
    public WordpressService: WordpressService,
    public PublicationsApi: PublicationsApi
  ) { }

  ngOnInit(): void {
  }

  getTranslationFiles(){
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

  getPosts(){
    this.PublicationsApi.wordpressGetPosts(this.Relations.id, this.Relations.companyId, this.website, this.username, this.password)
    .subscribe(posts => {
      console.log(posts)
      this.wpposts = posts;
    })
  }

  getPages(){
    this.PublicationsApi.wordpressGetPages(this.Relations.id, this.Relations.companyId, this.website, this.username, this.password)
    .subscribe(pages => {
      console.log(pages)
      this.wppages = pages;
    })
  }

  loadTranslations(){
    this.RelationsApi.getFiles(this.Relations.id, { where: { type: 'translations' } })
      .subscribe((files: TranslationFile[]) => {
        console.log(files);
        this.translationFiles = files;
      });
  }

  translate(){

  }

  loadTranslation(url){

  }

}
