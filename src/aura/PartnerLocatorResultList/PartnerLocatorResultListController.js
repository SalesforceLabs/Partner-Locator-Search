({
    doInit : function(component, event, helper){
        var searchFields = component.get("v.searchFields");
        //Remove whitespace from string
        if(searchFields) {
            //console.log('searchFields: ', searchFields);
            searchFields = searchFields.replace(/\s+/g, '');
            //console.log('searchFields: ', searchFields);
            component.set('v.formattedSearchFields', searchFields);
            var splitFields = searchFields.split(',');
            //console.log('splitFields: ', splitFields);
            var newArray = new Array();
            for (var i = 0; i < splitFields.length; i++) {
                if (splitFields[i]) {
                    newArray.push(splitFields[i]);
                }
            }
            //console.log('newArray: ', newArray);
            helper.getFieldLabels(component, newArray);
            //console.log('after for');
        }
    },
	handleNewAccounts : function(component, event, helper) {
		//console.log('handleNewAccounts');
        //console.log('event: ', event);
        
        var accounts = event.getParam("accounts");
        component.set('v.totalResultsAccount', accounts);
        //console.log('accounts: ', accounts);
        component.set('v.totalResults', accounts.length);
        
        var fieldMap = event.getParam("fieldMap")[0];
        //console.log('fieldMap: ', fieldMap);
        
        var output = [], item;
        for (var api in fieldMap) {
            item = {};
            item.apiName = api;
            item.label = fieldMap[api];
            output.push(item);
        }
        //console.log('output: ', output);
        output.sort(function(a, b){
            //console.log('a: '+a.label.toLowerCase()+' b: '+b.label.toLowerCase());
            if(a.label.toLowerCase() < b.label.toLowerCase()) return -1;
            if(a.label.toLowerCase() > b.label.toLowerCase()) return 1;
            else return 0;
        });
        component.set('v.sortList', output);
        component.set('v.selectedSort', null);
        // set the handler attributes based on event data
       	helper.renderAccounts(component,event,accounts);
	},
    sortChange : function(component, event, helper){
        //console.log('sortChange');
        var theSelectedSort = component.get('v.selectedSort');
        console.log('theSelectedSort: ', theSelectedSort);
        if(theSelectedSort != 'null'){
            var theAccounts = component.get('v.totalResultsAccount');
            
            theAccounts.sort(function(a, b) {
                if(a.hasOwnProperty(theSelectedSort) && b.hasOwnProperty(theSelectedSort)){
                    
                    if(a[theSelectedSort] === '' && b[theSelectedSort] === ''){
                        //console.log('both blank yo');
                    }
                    
                    if(a[theSelectedSort] === '' || b[theSelectedSort] === ''){
                        //console.log('one blank yo');
                    }
                    
                    //console.log('Both Present');
                    //console.log('a[theSelectedSort]: ', typeof a[theSelectedSort]);
                    //console.log('b[theSelectedSort]: ', typeof b[theSelectedSort]);
                    
                    if (typeof a[theSelectedSort] === 'string' && typeof b[theSelectedSort] === 'string') {
                        //String type
                        //console.log('String type');
                        //console.log('Object.isString(a[theSelectedSort]) ' + Object.isString(a[theSelectedSort]) +' Object.isString(b[theSelectedSort]) '+ Object.isString(b[theSelectedSort]));
                        //console.log('a: '+a[theSelectedSort].toLowerCase()+' < '+b[theSelectedSort].toLowerCase()+' :b');
                        //console.log('RESULT = '+(a[theSelectedSort].toLowerCase() < b[theSelectedSort].toLowerCase()));
                        if(a[theSelectedSort].toLowerCase() < b[theSelectedSort].toLowerCase()){
                            return -1;
                        }
                        else if(a[theSelectedSort].toLowerCase() > b[theSelectedSort].toLowerCase()){
                            return 1;
                        }
                            else{
                                return 0;
                            }
                        
                    }
                    else if(typeof a[theSelectedSort] === 'number' && typeof b[theSelectedSort] === 'number'){
                        //Integer type
                        //console.log('Integer type');
                        //console.log('Number.isInteger(a[theSelectedSort]): '+Number.isInteger(a[theSelectedSort])+' Number.isInteger(b[theSelectedSort]): '+ Number.isInteger(b[theSelectedSort]));
                        return a[theSelectedSort] - b[theSelectedSort];
                    }
                        else{
                            //console.log('else type');
                            return a[theSelectedSort] - b[theSelectedSort];
                        }
                }
                else if(a.hasOwnProperty(theSelectedSort)){
                    //console.log('a Present');
                    return -1;
                }
                    else if(b.hasOwnProperty(theSelectedSort)){
                        //console.log('b Present');
                        return 1;
                    }
                        else{
                            //console.log('none Present');
                            return 0;
                        }
                
            });
            
            //console.log('theAccounts: ', theAccounts);
            helper.renderAccounts(component,event,theAccounts);
        }
    },
    nextPage : function(component, event, helper) {
        //console.log('nextPage');
        var theTotalList = component.get("v.accountList");
        //console.log('theTotalList: ', theTotalList);
        var currentPage = component.get('v.currentPage');
        //console.log('currentPage: ', currentPage);
        if((currentPage+1) <= theTotalList.length-1){
            component.set('v.shownAccounts', theTotalList[currentPage+1]);
            component.set('v.currentPage', currentPage+1);
        }
        //console.log('shownAccounts: ', theTotalList[currentPage+1]);
    },
    previousPage : function(component, event, helper) {
        //console.log('previousPage');
        var theTotalList = component.get("v.accountList");
        var currentPage = component.get('v.currentPage');
        if((currentPage-1) >= 0){
            component.set('v.shownAccounts', theTotalList[currentPage-1]);
            component.set('v.currentPage', currentPage-1);
        }
        //console.log('shownAccounts: ', theTotalList[currentPage-1]);
    },
    shownAccountsChange : function(component, event, helper){
        //console.log('shownAccountsChange');
        var theAccounts = component.get('v.shownAccounts');
        //console.log('theAccounts: ', theAccounts);
        var myEvent = $A.get("e.c:PartnerListPageEvt");
        myEvent.setParams({ 
            "accounts": theAccounts
        }); 
        myEvent.fire();
    },
    
    setSelectedAccount : function(component, event, helper){
        //console.log('setSelectedAccount');
        var selectedId = event.currentTarget.dataset.theid;
        //console.log('event.currentTarget.dataset.theid ',event.currentTarget.dataset.theid );      
        component.set("v.selectedRecord", selectedId);
        
        var selectedLat = event.currentTarget.dataset.lat;
        var selectedLong = event.currentTarget.dataset.long;
        //console.log('Selected Lat,Long: ',selectedLat+','+selectedLong );
        component.set('v.selectedLat',selectedLat);
        component.set('v.selectedLong',selectedLong);
        
        var myArray = component.get("v.shownAccounts"); 
        function findAccount(selectedAccount) { 
            return selectedAccount.Id === selectedId;
        }
        
        //console.log(myArray.find(findAccount));
        component.set( "v.selectedAccount", myArray.find(findAccount) );  
        
        var theAccount = component.get("v.selectedAccount");
        var uncodedAddr = '';
        if(theAccount.BillingStreet){
            uncodedAddr = uncodedAddr + theAccount.BillingStreet +',';
        }
        if(theAccount.BillingCity){
            uncodedAddr = uncodedAddr + theAccount.BillingCity +',';
        }
        if(theAccount.BillingCountry){
            uncodedAddr = uncodedAddr + theAccount.BillingCountry;
        }
        //console.log('uncodedAddr', uncodedAddr);

        var encodedAddr = uncodedAddr.replace(/ /g, "+");
        //console.log('encodedAddr', encodedAddr);
        component.set( "v.encodedAddress", encodedAddr );
        
        /*
        var toggleSelected = component.find("selected_account");
        $A.util.addClass(toggleSelected, "active");
        */
        helper.openAccountModal(component, event);
    },
    
    setSelectedAccountCard : function(component, event, helper){
        //console.log('setSelectedAccountCard');
        var selectedId = event.getSource().get('v.value');
        //console.log('setSelectedAccountCard selectedId ', selectedId );      
        component.set("v.selectedRecord", selectedId);
        
        var myArray = component.get("v.shownAccounts"); 
        function findAccount(selectedAccount) { 
            return selectedAccount.Id === selectedId;
        }
        
        //console.log(myArray.find(findAccount));
        component.set( "v.selectedAccount", myArray.find(findAccount) );  
        
        var theAccount = component.get("v.selectedAccount");
        
        var selectedLat = theAccount.BillingLatitude;
        var selectedLong = theAccount.BillingLongitude;
        //console.log('Selected Lat,Long: ',selectedLat+','+selectedLong );
        component.set('v.selectedLat',selectedLat);
        component.set('v.selectedLong',selectedLong);
        
        
        var uncodedAddr = '';
        if(theAccount.BillingStreet){
            uncodedAddr = uncodedAddr + theAccount.BillingStreet +',';
        }
        if(theAccount.BillingCity){
            uncodedAddr = uncodedAddr + theAccount.BillingCity +',';
        }
        if(theAccount.BillingCountry){
            uncodedAddr = uncodedAddr + theAccount.BillingCountry;
        }
        //console.log('uncodedAddr', uncodedAddr);

        var encodedAddr = uncodedAddr.replace(/ /g, "+");
        //console.log('encodedAddr', encodedAddr);
        component.set( "v.encodedAddress", encodedAddr );
    
        helper.openAccountModal(component, event);
    },
    
    closeSelected : function(component, event, helper){ 
    	/*
    	 var toggleSelected = component.find("selected_account");
        $A.util.removeClass(toggleSelected, "active");
        */
        
        helper.closeAccountModal(component, event);
    },
    
    goToAccount : function (component, event, helper) {
        // //console.log(component.get("v.selectedAccount.Id"));
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
          "recordId": component.get("v.selectedAccount.Id"),
          "slideDevName": "detail"
        });
        navEvt.fire();
    }
    
    
})