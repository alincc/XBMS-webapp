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
  buttontext: string;
  style: {
    'color': string;
    'background-color': string;
    'width': string;
    'height': string;
    'align': string;
    'border': string;
    'border-bottom': string;
    'border-left': string;
    'border-radius': string;
    'border-right': string;
    'border-top': string;
    'font-family': string;
    'font-size': string;
    'font-style': string;
    'font-weight': string;
    'padding': string;
    'text-decoration': string;
    'text-transform': string;
    'vertical-align': string;
  }
}

export interface MaileditorDividerInterface {
  type: string;
  style: {
    'border-color': string;
    'border-style': string;
    'border-width': string;
    'container-background-color': string;
    'padding': string;
    'padding-bottom': string;
    'padding-left': string;
    'padding-right': string;
    'padding-top': string;
    'width': string;
  }
}


export class MaileditorText implements MaileditorTextInterface {
  type: string;
  content:  string;
  typeformat: string;
  style: {
    'color': string,
    'background-color': string,
    'font-family': string,
    'fontsize': string,
    'text-align': string
  }

  public static factory(data: MaileditorTextInterface): MaileditorText {
    return new MaileditorText(data);
  }

  constructor(data?: MaileditorTextInterface) {
    Object.assign(this, data);
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
  public static factory(data: MaileditorImageInterface): MaileditorImage {
    return new MaileditorImage(data);
  }

  constructor(data?: MaileditorImageInterface) {
    Object.assign(this, data);
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

  public static factory(data: MaileditorColumnInterface): MaileditorColumn {
    return new MaileditorColumn(data);
  }

  constructor(data?: MaileditorColumnInterface) {
    Object.assign(this, data);
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

  public static factory(data: MaileditorSectionInterface): MaileditorSection {
    return new MaileditorSection(data);
  }

  constructor(data?: MaileditorColumnInterface) {
    Object.assign(this, data);
  }

}

export class MaileditorButton implements MaileditorButtonInterface {
  type: string;
  buttonurl: string;
  buttontext: string;
  style: {
    'color': string;
    'background-color': string;
    'width': string;
    'height': string;
    'align': string;
    'border': string;
    'border-bottom': string;
    'border-left': string;
    'border-radius': string;
    'border-right': string;
    'border-top': string;
    'font-family': string;
    'font-size': string;
    'font-style': string;
    'font-weight': string;
    'padding': string;
    'text-decoration': string;
    'text-transform': string;
    'vertical-align': string;
  }

  public static factory(data: MaileditorButtonInterface): MaileditorButton {
    return new MaileditorButton(data);
  }

  constructor(data?: MaileditorButtonInterface) {
    Object.assign(this, data);
  }

}

export class MaileditorDivider implements MaileditorDividerInterface {
  type: string;
  style: {
    'border-color': string;
    'border-style': string;
    'border-width': string;
    'container-background-color': string;
    'padding': string;
    'padding-bottom': string;
    'padding-left': string;
    'padding-right': string;
    'padding-top': string;
    'width': string;
  }

  public static factory(data: MaileditorDividerInterface): MaileditorDivider {
    return new MaileditorDivider(data);
  }

  constructor(data?: MaileditorDividerInterface) {
    Object.assign(this, data);
  }
}
