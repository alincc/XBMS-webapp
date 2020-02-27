import { Component, Inject } from '@angular/core';
import { Randomizer } from './randomize';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { timezones } from '../shared/';
import { timeconv } from '../shared/timeconv';

export interface Day {
    value: string;
    viewValue: string;
}

export interface FollowupDay {
    value: string;
}

export interface Hour {
    value: string;
    viewValue: string;
}


@Component({
    templateUrl: './random-dialog.component.html',
    styleUrls: ['./random-dialog.component.scss'],
    selector: 'app-random-dialog'
})


export class RandomDialog {
    public checkboxlistmail = [];
    public checkboxlistcamp = [];
    public randomize = false;
    public daysform = new FormControl();
    public openclickedorall: string;
    public nrofdays: number;
    public selectedfollowupmail;

    public days: Day[] = [
        { value: '1', viewValue: 'Monday' },
        { value: '2', viewValue: 'Tuesday' },
        { value: '3', viewValue: 'Wednesday' },
        { value: '4', viewValue: 'Thursday' },
        { value: '5', viewValue: 'Friday' },
        { value: '6', viewValue: 'Saturday' },
        { value: '7', viewValue: 'Sunday' }
    ];

    public followupdays: FollowupDay[] = [
        { value: '1'},
        { value: '2'},
        { value: '3'},
        { value: '4'},
        { value: '5'},
        { value: '6'},
        { value: '7'}
    ];

    public hours: Hour[] = [
        { value: '1', viewValue: '1AM' },
        { value: '2', viewValue: '2AM' },
        { value: '3', viewValue: '3AM' },
        { value: '4', viewValue: '4AM' },
        { value: '5', viewValue: '5AM' },
        { value: '6', viewValue: '6AM' },
        { value: '7', viewValue: '7AM' },
        { value: '8', viewValue: '8AM' },
        { value: '9', viewValue: '9AM' },
        { value: '10', viewValue: '10AM' },
        { value: '11', viewValue: '11AM' },
        { value: '12', viewValue: '12AM' },
        { value: '13', viewValue: '1PM' },
        { value: '14', viewValue: '2PM' },
        { value: '15', viewValue: '3PM' },
        { value: '16', viewValue: '4PM' },
        { value: '17', viewValue: '5PM' },
        { value: '18', viewValue: '6PM' },
        { value: '19', viewValue: '7PM' },
        { value: '20', viewValue: '8PM' },
        { value: '21', viewValue: '9PM' },
        { value: '22', viewValue: '10PM' },
        { value: '23', viewValue: '11PM' },
        { value: '24', viewValue: '12PM' }
    ];

    public Category = []
    public timezones = timezones;
    public mailinglistselection;
    public campaignlistselection;

    constructor(
        public timeconv: timeconv,
        public dialogRef: MatDialogRef<Randomizer>,
        @Inject(MAT_DIALOG_DATA) public data: Randomizer) {
        this.mailinglistselection = this.data.mailingLists;
        this.campaignlistselection = this.data.campaignLists;
        this.data.Selmailinglists = [];
        this.data.Selcampaignlists = [];
        this.createCheckboxMail(false); // create checkbox for every value
        this.createCheckboxCamp(false); // create checkbox for every value
        this.addAllCat();
        // this.data.dayoftheweek = [1, 2, 3, 4, 5, 6, 7];
    }

    addAllCat(): void {
        let catlisttemp = [];
        this.mailinglistselection.forEach(element => {
            if (element.categorie !== undefined) {
                catlisttemp.push(element.categorie);
            }
        });
        catlisttemp = catlisttemp.filter((x, i, a) => a.indexOf(x) == i);
        this.Category = catlisttemp;
        // console.log(this.Category);
    }

    changeDate() {
        this.data.date = this.timeconv.convertTime( this.data.date,  this.data.time, this.data.timezone);
    }

    setCatFilter(value) {
        this.resetfilter();
        this.mailinglistselection =   this.mailinglistselection.filter(function(element) {
            return element.categorie == value;
        });
        this.createCheckboxMail(false); // create checkbox for every value
        this.createCheckboxCamp(false); // create checkbox for every value
    }

    resetfilter() {
        this.mailinglistselection = this.data.mailingLists;
        this.createCheckboxMail(false); // create checkbox for every value
        this.createCheckboxCamp(false); // create checkbox for every value
        this.deselectAllMail();
        this.deselectAllCamp();
    }

    toggleaddtomailing(booleanval): void {
        this.data.addtomailing = booleanval
    }

    createCheckboxMail(valueboolean): void {
        this.checkboxlistmail = [];
        this.mailinglistselection.forEach(element => {
            this.checkboxlistmail.push(valueboolean);
        });
    }

    createCheckboxCamp(valueboolean): void {
        this.checkboxlistcamp = [];
        this.mailinglistselection.forEach(element => {
            this.checkboxlistcamp.push(valueboolean);
        });
    }

    onAddCampaignlist(i): void {
        // add on index number of selection
        const campaign2a = this.campaignlistselection[i]
        const listtochk1 = this.data.Selcampaignlists;
        const alreadySelected2 = listtochk1.indexOf(campaign2a.id);
        console.log(i, alreadySelected2)
        if (alreadySelected2 > -1) {
            this.data.Selcampaignlists.splice(alreadySelected2, 1);
        } else {
            this.data.Selcampaignlists.push(campaign2a.id)
         }
         console.log (this.data.Selcampaignlists);
    }

    onAddMailinglist(i): void {
        // add on index number of selection
        const list2a =  this.mailinglistselection[i];
        const listtochk2 =  this.data.Selmailinglists;
        const alreadySelected2 = listtochk2.indexOf(list2a.id);
        console.log(list2a, alreadySelected2)
        if (alreadySelected2 > -1) {
            this.data.Selmailinglists.splice(alreadySelected2, 1);
        } else {
            this.data.Selmailinglists.push(list2a.id); 
        }
        console.log( this.data.Selmailinglists);
    }


    selectAllMail(): void {
        // iterate for
        this.data.Selmailinglists = [];
        let i2 = 0;
        this.mailinglistselection.forEach(element => {
            this.data.Selmailinglists.push(element.id); ++i2;
        });
        console.log(this.data.mailingLists);
        this.createCheckboxMail(true);
    }

    deselectAllMail(): void {
        this.data.Selmailinglists = [];
        this.createCheckboxMail(false);
    }

    selectAllCamp(): void {
        // iterate for
        let i2 = 0;
        this.campaignlistselection.forEach(element => {
            this.data.Selcampaignlists.push(element.id); ++i2;
        });
        console.log(this.data.Selcampaignlists);
        this.createCheckboxCamp(true);
    }

    deselectAllCamp(): void {
        this.data.Selcampaignlists = [];
        this.createCheckboxCamp(false);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
