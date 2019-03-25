import { Component, OnInit } from '@angular/core';
export interface Maileditormodels {
  type: string;
}

export interface MaileditorSectionInterface {
  style: {
    'width': string,
    'height': string;
    'background-color': string;
    'margin': string;
    'padding': string;
    'border-style': string;
    'border-width': string;
    'background-image': string;
  }
}

export interface MaileditorColumnInterface {
  style: {
    'width': string,
    'height': string;
    'background-color': string;
    'margin': string;
    'padding': string;
    'border-style': string;
    'border-width': string;
    'background-image': string;
  }
}

// edit out interface name
export interface MaileditorTextInterface {
  type: string;
  content: string;
  typeformat: string;
  style: {
    'color': string;
    'background-color': string;
    'font-family': string;
    'fontsize': string;
    'text-align': string;
  };
}

export interface MaileditorImageInterface {
  type: string;
  url: string;
  style: {
    'color': string;
    'background-color': string;
    'width': string;
    'height': string;
  };
}

export interface MaileditorButtonInterface {
  type: string;
  buttonurl: string;
}

@Component({
  selector: 'app-maileditor-component',
  template: ``
})



export class MaileditorText implements MaileditorTextInterface {
  type: 'Text';
  content:  string;
  typeformat: string;
  style: {
    'color': string,
    'background-color': string,
    'font-family': string,
    'fontsize': string,
    'text-align': string
  }
  constructor(data?: MaileditorTextInterface) {
    Object.assign(this, data);
  } 

  public static factory(data: MaileditorTextInterface): MaileditorText {
    return new MaileditorText(data);
  }

}

export class MaileditorImage implements MaileditorImageInterface {
  type: string;
  content: string;
  url: string;
  style: {
    'color': string,
    'background-color': string,
    'width': string,
    'height': string,
  }
  constructor(data?: MaileditorImageInterface) {
    Object.assign(this, data);
  }

  public static factory(data: MaileditorImageInterface): MaileditorImage {
    return new MaileditorImage(data);
  }

}

export class MaileditorColumn implements MaileditorColumnInterface {
  style: {
    'color': string;
    'background-color': string;
    'width': string;
    'height': string;
    'margin': string;
    'padding': string;
    'border-style': string;
    'border-width': string;
    'background-image': string;
  }

  constructor(data?: MaileditorColumnInterface) {
    Object.assign(this, data);
  }

  public static factory(data: MaileditorColumnInterface): MaileditorColumn {
    return new MaileditorColumn(data);
  }

}


export class MaileditorSection implements MaileditorSectionInterface {
  style: {
    'color': string;
    'background-color': string;
    'width': string;
    'height': string;
    'margin': string;
    'padding': string;
    'border-style': string;
    'border-width': string;
    'background-image': string;
  }

  constructor(data?: MaileditorColumnInterface) {
    Object.assign(this, data);
  }

  public static factory(data: MaileditorSectionInterface): MaileditorSection {
    return new MaileditorSection(data);
  }

}

export class MaileditorButton implements MaileditorButtonInterface {
  type: string;
  buttonurl: string;
  style: {
    'color': string;
    'background-color': string;
    'width': string;
    'height': string;
  }

  constructor(data?: MaileditorButtonInterface) {
    Object.assign(this, data);
  }

  public static factory(data: MaileditorButtonInterface): MaileditorButton {
    return new MaileditorButton(data);
  }

}