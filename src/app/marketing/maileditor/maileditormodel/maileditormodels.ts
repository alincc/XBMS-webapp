import { Component, OnInit } from '@angular/core';
export interface Maileditormodels {
  type: string;
}

export interface MaileditorSection {
  type: string;
}

export interface MaileditorColumn {
  type: string;
}

//edit out interface name
export interface MaileditorTextInterface {
  type: string;
  content: string;
  style: {
    "color": string;
    "background-color": string;
    "font-family": string;
    "fontsize": string;
  };
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

  public maileditorSection: MaileditorSection =
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


  public maileditorText: MaileditorTextInterface =
    {
      type: "Text",
      content: "Text",
      style: {
        "color": "black",
        "background-color": "white",
        "font-family": "Verdana",
        "fontsize": "12pt",
      }
    }


  public maileditorButton: MaileditorButton =
    {
      type: "Button",
      buttonurl: "www.xbms.io"
    }

}


export class MaileditorText implements MaileditorTextInterface {
  type: "Text";
  content: "Text";
  style: {
    "color": "black",
    "background-color": "white",
    "font-family": "Verdana",
    "fontsize": "12pt",
  }
  constructor(data?: MaileditorTextInterface) {
    Object.assign(this, data);
  }

  public static factory(data: MaileditorTextInterface): MaileditorText {
    return new MaileditorText(data);
  }

}