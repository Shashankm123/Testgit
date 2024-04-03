import { LightningElement,track,wire } from 'lwc';
import getAccounts from '@salesforce/apex/DataTabelwithMultipleContact.getAccounts';
import recentAccounts from '@salesforce/apex/DataTabelwithMultipleContact.recentAccounts';
import getContacts from '@salesforce/apex/DataTabelwithMultipleContact.getContacts';
import saveContacts from '@salesforce/apex/DataTabelwithMultipleContact.createContacts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import AccountId from '@salesforce/schema/Case.AccountId';
export default class DatatableWithMultipleContactInsertion extends LightningElement {
    @track accountName='';
    @track data=[];
    @track accountList=[];
    @track objectApiName ='Account';
    @track accountId;
    @track isShow=false;
    @track messageResult=false;
    @track isShowResult=true;
    @track showSearchedValues=false;
    @track keyIndex = 1;  
    @track error;
    @track message;
    @track newRowList=[];
    @track contactRecList = [
        {                      
            LastName: '',
            Email: '',
            Phone: '',
            AccountId:''
        }
    ];
    /*@wire(getAccounts,{actName: '$accountName'})
    retrieveAccounts({error,data}) {
        this.messageResult=false;
        if(data){
            //for data handling
            console.log('dataLength:'+data.length);
            console.log('data:'+data.length);
            if(data.length >0 ){
                this.accountList=data;
                console.log('accountList:'+this.accountList);
                this.showSearchedValues=true;
                this.messageResult=false;
            }
            else if(data.length ==0){
                this.accountlist=[];
                this.showSearchedValues=false;
                if(this.accountName != '')
                this.messageResult=true;
            }
        }else if(error){
            //for error handling
            this.accountId='';
            this.accountName='';
            this.accountList=[];
            this.showSearchedValues=false;
            this.messageResult=true;
        }
    }
    handleClick(event){
        console.log('handleClick:');
       // this.isShowResult=true;
        this.showSearchedValues=true;
        this.messageResult=false;
        recentAccounts()
       .then(result=> {
        this.accountList=result;
        console.log('result:'+result);  
       })
    }
    handleBlur(event){
        console.log('handleBlur:');
        this.showSearchedValues=false;
    }
    handleKeyChange(event){
        console.log('handleKeyChange:');
        this.messageResult=false;
        this.accountName=event.target.value;
    }*/
    /*handleParentSelection(event){
        console.log('handleParentSelection:');
        this.showSearchedValues=false;
        //this.isShowResult=false;
        this.messageResult=false;
        //set the parent calendar id
        this.accountId=event.target.dataset.value;
        //set parent calendar label
        this.accountName=event.target.dataset.label;
        console.log('accountId::' +this.accountId);
        //create new custom
        const selectedEvent = new CustomEvent('selected', {detail:this.accountId});
        //Dispatches the event
        this.dispatchEvent(selectedEvent);
        //Get accountId for selected value
        this.cardVisible=true;
        console.log("this.accountId:"+this.accountId);
        //call apex method to get contacts related to selected account
        getContacts({selectedAccountId : this.accountId})
        .then(result=>{
            console.log("result:" +JSON.stringify(result))
            this.data = result;
            this.contactRecList=result;
            this.keyIndex=this.contactRecList.length;
            console.log("this.keyIndex:" +this.keyIndex)
            console.log("contactRecList:" +JSON.stringify(this.contactRecList))
        })
        .catch(error=>{
            window.alert("error:" +error)
        })
    }*/
      //Add Row
    addRow() {
         
        console.log("##this.keyIndex:" +this.keyIndex);
        //contactToadd.index= this.keyIndex;
        //let NewRow={
        this.contactRecList.push({
            LastName: '',
            Email:'',
            Phone:'',
            //AccountId:this.accountId
        });
        this.keyIndex++; 
       /* console.log("##this.contactRecList:" +JSON.stringify(this.contactRecList));
        console.log("##NewRow:"+JSON.stringify(NewRow));
        this.contactRecList=this.contactRecList.concat(NewRow);
        this.newRowList.push(NewRow);
        console.log("##this.newRowList:" +JSON.stringify(this.newRowList));*/
        //console.log("$$contactRecList:"+JSON.stringify(this.contactRecList));
    }
    changeHandler(event){      
       // alert(event.target.id.split('-'));
        console.log('Access key2:'+event.target.accessKey);
        console.log('id:'+event.target.id);
        console.log('value:'+event.target.value);      
        if(event.target.name==='conLastName')
            this.contactRecList[event.target.accessKey].LastName = event.target.value;
        else if(event.target.name==='conEmail'){
            this.contactRecList[event.target.accessKey].Email = event.target.value;
        }
        else if(event.target.name==='conPhone'){
            this.contactRecList[event.target.accessKey].Phone = event.target.value;
        }
    }
    //Save Contacts
     saveMultipleContacts() {
        console.log("**contactlist"+JSON.stringify(this.newRowList));
        //saveContacts({ contactList : JSON.stringify(this.newRowList) })
        saveContacts({ contactList : this.contactRecList })
            .then(result => {
                this.message = result;
                this.error = undefined;                
               /* this.newRowList.forEach(function(item){                  
                    item.LastName='';
                    item.Email='';
                    item.Phone='';
                    //item.AccountId=this.accountId;                  
                });*/
                //this.contactRecList = [];
                if(this.message !== undefined) {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Contacts Created!',
                            variant: 'success',
                        }),
                    );
                    this.contactRecList=[
                        {
                            
                            LastName:'',
                            Phone:'',
                            Email:'',
                        }
                    ];
                }
                console.log(JSON.stringify(result));
                console.log("result", this.message);
            })
            .catch(error => {
                this.message = undefined;
                this.error = error;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating records',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
                console.log("error", JSON.stringify(this.error));
            });
    }
    removeRow(event){      
        console.log('Access key2:'+event.target.accessKey);
        console.log(event.target.id.split('-')[0]);
        if(this.contactRecList.length>1){            
             this.contactRecList.splice(event.target.accessKey,1);
             this.keyIndex-1;
        }
    }  
    get showDeleteIcon(){
        return this.contactRecList.length>1;
    }
    updateSerialNumbers() {
        this.keyIndex = 1;
        this.contactRecList.forEach(contact => {
            contact.keyIndex = this.keyIndex++;
        });
      }
    editRow(event){

       

    }
}