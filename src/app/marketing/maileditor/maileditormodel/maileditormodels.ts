export class Maileditormodels {
}



export class MaileditorSection {
    type: "section"
}

export class MaileditorColumn{
    type: "column";
}

export class MaileditorText {
    type: "text";
    content: string;
}

export class MaileditorImage {
    type: "image";
    url: string;
}

export class MaileditorButton {
    type: "button";
    buttonname: string;
    buttonurl: string;
}