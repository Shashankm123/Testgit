import { LightningElement,api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import Oredr_Object from '@salesforce/schema/Order';
import NAME_FIELD from '@salesforce/schema/Order.Name';
import ACCOUNT_FIELD from '@salesforce/schema/Order.AccountId';
import Contact_Field from '@salesforce/schema/Order.ContractId'
import STARTDATE_FIELD from '@salesforce/schema/Order.EffectiveDate';
import STATUS_FIELD from '@salesforce/schema/Order.Status';
import BILLING_ADDRESS from '@salesforce/schema/Order.BillingAddress';
import TYPE from '@salesforce/schema/Order.Type';
import REDUCTION_ORDER from '@salesforce/schema/Order.IsReductionOrder';

export default class createAcc extends NavigationMixin(LightningElement) {

    // objectApiName is "Order" when this component is called
    @api objectApiName=Oredr_Object;
    @api recordId;
    // Expose field to make it available in the template
    fields=[NAME_FIELD,ACCOUNT_FIELD,Contact_Field,STARTDATE_FIELD,STATUS_FIELD,TYPE,BILLING_ADDRESS];
   /* Name = NAME_FIELD;
    AccountName= ACCOUNT_FIELD;
    StartDate= STARTDATE_FIELD;
    Status=STATUS_FIELD;
    Contact=Contact_Field;
    type=TYPE;
    Address=BILLING_ADDRESS;*/
    closeModal() {
        // Navigation to Order record
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Order',
                actionName: 'list'
            },
        });
    }
  
    handleSuccess(event){
        const toastEvent = new ShowToastEvent({
            title: 'Message',
            message: 'The order '+this.recordId+' has been created successfully.',
            variant: 'success',
        });
        this.dispatchEvent(toastEvent);
        // Navigation to Order record
        let creditnoteId = event.detail.id;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',   
            attributes: {
                recordId: creditnoteId,
                objectApiName: 'Order',
                actionName: 'view'
            }
        });
    }
    handleCancel()
    {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Order',
                actionName: 'list'
            }
        });
    }
}