import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem, copyArrayItem} from '@angular/cdk/drag-drop';
import { Maileditormodels, MaileditorImage } from './maileditormodel/maileditormodels';

@Component({
  selector: 'app-maileditor',
  templateUrl: './maileditor.component.html',
  styleUrls: ['./maileditor.component.scss']
})
export class MaileditorComponent implements OnInit {

  public maileditorModel : Maileditormodels;
  public maileditorImage: MaileditorImage;

  constructor() { }

  ngOnInit() {
  }

  // creat array per 

  toolset = [
    this.maileditorImage,
    'section',
    'column',
    'text',
    'image',
    'button'
  ];

  // needs at least item at init
  mailtemplate = [
    'column'
  ];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
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

}
