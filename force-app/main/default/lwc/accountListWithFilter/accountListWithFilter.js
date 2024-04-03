import { LightningElement, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import RATING_FIELD from '@salesforce/schema/Account.Rating';

const COLUMNS = [
    { label: 'Name', fieldName: 'Name', type: 'text' },
    { label: 'Rating', fieldName: 'Rating', type: 'text' },
];
export default class AccountListWithFilter extends LightningElement {
    @wire(getRecord, { recordId: 'AccountId', fields: [NAME_FIELD, RATING_FIELD] })
    account;

    get data() {
        return [{
            Id: 'AccountId',
            Name: getFieldValue(this.account.data, NAME_FIELD),
            Rating: getFieldValue(this.account.data, RATING_FIELD),
        }];
    }

    get columns() {
        return COLUMNS;
    }
}