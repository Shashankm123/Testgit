public with sharing class AccLookup {
    public AccLookup(Decimal COunt) {

    }
    @AuraEnabled
    public static list<RecentlyViewed> recentAccounts(){
        return[SELECT Id, Name, Type, LastViewedDate, Profile.Name FROM RecentlyViewed WHERE Type ='Account' ORDER BY LastViewedDate DESC limit 4];
    }
    @AuraEnabled(cacheable=true)
     public static list<Account> getAccounts(string actName ) {    
         List < Account > accountList = new List < Account > ();
         if(actName != ''){
         string accountName = '%' + actName + '%';
         accountList = [Select Id,Name From Account Where Name Like : accountName ];
             return accountList;
         }
         return accountList;
     }
     @AuraEnabled(cacheable=true)
     public static list<Contact> getContacts(string selectedAccountId){
       list<Contact> contactList= [select LastName,Email,Phone, AccountId from Contact where AccountId=: selectedAccountId];
              if(!contactList.isEmpty()){
                 return contactList;
             } else {
                 return Null;
             }
     }
}