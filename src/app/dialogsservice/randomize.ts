
export interface Randomizer {
    startdate: Date;
    enddate: Date;
    dayoftheweek: string;
    starthour: string;
    endhour: string;
    campaignLists;
    mailingLists;
    templatemailing;
    Selcampaignlists;
    Seltemplatemailing;
    Selmailinglists;
    addtomailing: false;
    timezone: string;
    followupMailing: string;
    followupdays: number;
} 
