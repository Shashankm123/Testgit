import { LightningElement,api,wire } from 'lwc';
import queryAccountsByRevenue from '@salesforce/apex/AccountListControllerLwc.queryAccountsByRevenue';
export default class AccountFinder extends LightningElement {
    @api annualRevenue;
    mainDataLoaded = false;
    secondaryDataLoaded = false;
    @wire(queryAccountsByRevenue, { annualRevenue: '$annualRevenue' })
    accounts;
    handleChange(event)
    {
        this.annualRevenue=event.detail.value;
    }
    reset()
    {
        this.annualRevenue=null;
    }
    

    loadMainData() {
        if (!this.mainDataLoaded) {
            // Fetch and load the main data here
            this.mainDataLoaded = true;
        }
    }

    loadSecondaryData() {
        if (!this.secondaryDataLoaded) {
            // Fetch and load the secondary data here
            this.secondaryDataLoaded = true;
        }
    }

}