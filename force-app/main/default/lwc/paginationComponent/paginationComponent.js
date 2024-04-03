import { LightningElement, api ,track,wire} from 'lwc';
import getContact from '@salesforce/apex/PaginationRecords.getContact';
import deleteAcc from '@salesforce/apex/PaginationRecords.deleteAcc';
import getUpdatedrecords from '@salesforce/apex/PaginationRecords.getUpdatedrecords';
import updateAcc from '@salesforce/apex/PaginationRecords.updateAcc';
import fetchAccRecord from '@salesforce/apex/PaginationRecords.fetchAccRecord'
import deleteMultipleAccountRecord from '@salesforce/apex/PaginationRecords.deleteMultipleAccountRecord'
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import LightningAlert from "lightning/alert";
import LightningConfirm from 'lightning/confirm';
import { NavigationMixin } from 'lightning/navigation';

const chunk = (arr, size) => {
    const chunkedArray = [];
    for (let i = 0; i < arr.length; i++) {
       const last = chunkedArray[chunkedArray.length - 1];
       if(!last || last.length === size){
          chunkedArray.push([arr[i]]);
       }else{
          last.push(arr[i]);
       }
    };
    return chunkedArray;
};

export default class paginationComponent extends NavigationMixin(LightningElement) 
{
    @api AccountList;
    currentPage="1";
    @api AccountChunks;
    AccountToDisplay;
    totalPages;
    disableNext=false;
    disablePrev=true;
    //pageOptions=[];
    size;
    
    totalRecords;
    pageLimit="10";
    @wire (fetchAccRecord) wireAcc;
    @api selectedAccIdList=[];
    @track errorMsg;
    @track showSearchComponent = false;
    handleNavigation()
    {
        this.showSearchComponent=true;
    }
    columns = [
        { label: ' Name', fieldName: 'Name', type: 'text',editable: true },
        { label: 'Industry', fieldName: 'Industry', type: 'picklist',editable: true },
        { label: 'Type', fieldName: 'Type', type: 'picklist' ,editable: true},
        { label: 'Rating', fieldName: 'Rating', type: 'picklist' ,editable: true},
        {
            type: 'action',
            typeAttributes:  { rowActions: [{ label: 'Edit', name: 'edit' },{ label: 'View', name: 'view' }, {label:'Delete' , name: 'delete'}]}
        },
    ];

    //get options for the limit dropdown
    get pageLimitOptions() {
        var pageLimitList = [
            { label: '10', value: '10' },
            { label: '15', value: '15' },
            { label: '20', value: '20' },
            { label: '50', value: '50' },
            { label: '100', value: '100' },
        ];
        return pageLimitList;
    }

    connectedCallback()
    {
        getContact()
        .then(res=>{
           	this.AccountList=res;
        		this.setPagination(10);
        })
        .catch(err=>{
            console.log(err);
        })
    }

    setPagination(size)
    {
        if(this.AccountList.length > 0)
        {
            this.disableNext=false;
            this.disablePrev=true;
            this.size=size;
            this.currentPage="1";
            this.totalRecords=this.AccountList.length;
            this.AccountChunks=chunk(this.AccountList, this.size);
            this.AccountToDisplay=this.AccountChunks[0];
            this.totalPages=this.AccountChunks.length;
            //var pageOptObj={};
           /* for(var i=1; i<= this.totalPages; i++)
            {
                pageOptObj={};
                pageOptObj.label=i.toString();
                pageOptObj.value=i.toString();
                this.pageOptions.push(pageOptObj);
            }*/
            this.calculatePageText();
        }
    }

    calculatePageText()
    {
        var end=(parseInt(this.currentPage) * this.size) > this.totalRecords ? this.totalRecords : (parseInt(this.currentPage) * this.size);
        this.pageParam=((parseInt(this.currentPage) * this.size) - (this.size-1))+' to '+end;
    }

    handleNext()
    {
        this.currentPage=(parseInt(this.currentPage)+1).toString();

        if(parseInt(this.currentPage) >= this.totalPages)
        {
            this.currentPage=this.totalPages.toString();
            this.disableNext=true;
            this.disablePrev=false;
        }
        else
        {
            this.disableNext=false;
            this.disablePrev=false;
        }

        this.AccountToDisplay=this.AccountChunks[parseInt(this.currentPage)-1];
        this.calculatePageText();
    }

    handlePrev()
    {
        this.currentPage=(parseInt(this.currentPage)-1).toString();

        if(parseInt(this.currentPage) <= "1")
        {
            this.currentPage="1";
            this.disableNext=false;
            this.disablePrev=true;
        }
        else
        {
            this.disableNext=false;
            this.disablePrev=false;
        }

        this.AccountToDisplay=this.AccountChunks[parseInt(this.currentPage)-1];
        this.calculatePageText();
    }

    handlePageChange(event)
    {
        this.currentPage=event.target.value;
        this.AccountToDisplay=this.AccountChunks[parseInt(this.currentPage)-1];
        if(parseInt(this.currentPage) <= "1")
        {
            this.disableNext=false;
            this.disablePrev=true;
        }
        else if(parseInt(this.currentPage) >= this.totalPages)
        {
            this.disableNext=true;
            this.disablePrev=false;
        }
        else
        {
            this.disableNext=false;
            this.disablePrev=false;
        }
        //this.calculatePageText();
    }

    handleFirst()
    {
        this.currentPage="1";
        this.disableNext=false;
        this.disablePrev=true;
        this.AccountToDisplay=this.AccountChunks[parseInt(this.currentPage)-1];
        //this.calculatePageText();
    }

    handleLast()
    {
        this.currentPage=this.totalPages.toString();
        this.disableNext=true;
        this.disablePrev=false;
        this.AccountToDisplay=this.AccountChunks[parseInt(this.currentPage)-1];
       // this.calculatePageText();
    }

    handleLimitChange(event) {
        this.pageLimit = event.detail.value;
        this.selectedPage='1';
        this.size = parseInt(this.pageLimit)
        this.setPagination(this.size); //invoking the pagination logic
        //this.calculatePageText();
    }
    getSelectedIdAction(event){
        const selectedAccRows = event.detail.selectedRows;
        window.console.log('selectedAccRows# ' + JSON.stringify(selectedAccRows));
        this.selectedAccRows=[];
        
        for (let i = 0; i<selectedAccRows.length; i++){
            this.selectedAccIdList.push(selectedAccRows[i].Id);
        }

       // window.console.log('selectedContactRows1 ' + this.selectedContactRows + selectedContactRows.length );
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'edit':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes:{
                        recordId: row.Id,
                        actionName: 'edit',
                        objectApiName:'Account'
                    }
                });
                break;
            case 'view':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes:{
                        recordId: row.Id,
                        actionName: 'view',
                        objectApiName:'Account'
                    }
                });
                break;
            case 'delete':
                this.deleteAcc(row);
                break;
            default:
        }
    }
    async deleteAcc(currentRow) {
        deleteAcc({objAcc: currentRow})
        const result = await LightningConfirm.open({
            message: "Are you sure you want to delete this record?",
            variant: "default", // headerless
            label: "Delete a record"

        });
     //Confirm has been closed
        //result is true if OK was clicked
        if (result) {
         this.handleSuccessAlertClick();
        } else {
            //and false if cancel was clicked
            this.handleErrorAlertClick();
        }
    }
    async handleSuccessAlertClick() {
        await LightningAlert.open({
            message: 'You clicked "Ok"',
            theme: "success",
            label: "Success!"
        });
    }
    async handleErrorAlertClick() {
            await LightningAlert.open({
                message: 'You clicked "Cancel"',
                theme: "error",
                label: "Error!"
            });

   

        }
        handleSave(event){
            const updatedfield= event.detail.draftValues;
            console.log("updated field:"+JSON.stringify(updatedfield))
            updateAcc({accData: updatedfield})
            .then(response=>{
                console.log("ApexResponse:"+JSON.stringify(response))
                //To show Successfull notification
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: response,
                        message: response,
                        variant:'Success'
                    })
                );
                return refreshApex(this.updatedfield);
            })
            .catch(error=>{
                console.error("MyError:"+JSON.stringify(error))
            })
        }
        handleCancel(event){
            getUpdatedrecords()
            .then(result=> {
           console.log("Edited result:" +JSON.stringify(result))
          this.recordsToDisplay= result;
            console.log("Edited this.recordsToDisplay:" +JSON.stringify(this.recordsToDisplay))
             })
             }
     deleteAccRowAction(){
        deleteMultipleAccountRecord({accObj:this.selectedAccIdList})
        .then(()=>{
            this.template.querySelector('lightning-datatable').selectedAccRows=[];
 
            const toastEvent = new ShowToastEvent({
                title:'Success!',
                message:'Record deleted successfully',
                variant:'success'
              });
              this.dispatchEvent(toastEvent);
 
            return refreshApex(this.wireAcc);
        })
        .catch(error =>{
            this.errorMsg =error;
            window.console.log('unable to delete the record due to ' + JSON.stringify(this.errorMsg));
        });
    }
}