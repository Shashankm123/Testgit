import { LightningElement ,api} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import Account_Field from '@salesforce/schema/Account';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import REVENUE_FIELD from '@salesforce/schema/Account.AnnualRevenue';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';
import Phone_Field from '@salesforce/schema/Account.Phone';
import Type_Field from '@salesforce/schema/Account.Type';
import Address_Filed from '@salesforce/schema/Account.BillingAddress';


export default class createAccountRecord extends NavigationMixin(LightningElement)  {
    //objectApiName is "Order" when this component is called
    @api objectApiName=Account_Field;
    @api recordId;
    //Expose field to make it available in the template
    fields = [NAME_FIELD, REVENUE_FIELD, INDUSTRY_FIELD, Type_Field,Phone_Field,Address_Filed];
    
    closeModal() {
        // Navigation to Order record
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'Pagination',
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
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'Pagination',
            },
        });
    }
    handleCancel()
    {
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'Pagination',
            },
        });
    }
}