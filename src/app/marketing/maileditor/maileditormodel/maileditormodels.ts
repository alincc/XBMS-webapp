import { Component, OnInit } from '@angular/core';
export interface Maileditormodels {
    type: string;
}

export interface MaileditorSection {
    type: string;
}

export interface MaileditorColumn{
    type: string;
}

export interface MaileditorText {
    type: string;
    content: string;
}

export interface MaileditorImage {
    type: string;
    url: string;
}

export interface MaileditorButton {
    type: string;
    buttonurl: string;
}

@Component({
    selector: 'app-maileditor-component',
    template: ``
  })

export class MaileditorModel {

    public maileditorSection:  MaileditorSection =  
        {
          type: "Section"
        }
      
    
      public maileditorColumn: MaileditorColumn =  
        {
          type: "Column"
        }
    
      public maileditorImage: MaileditorImage =  
        {
          type: "Image",
          url: ""
        }
      
    
      public maileditorText: MaileditorText =  
        {
          type: "Text",
          content: "Write your Content here"
          
        }
      
    
      public maileditorButton: MaileditorButton =  
        {
          type: "Button",
          buttonurl: "www.xbms.io"
        }



}