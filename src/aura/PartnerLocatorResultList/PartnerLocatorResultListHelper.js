({
	getFieldLabels : function(component, splitFields) {
        console.log('inside getFieldLabels');
        var action = component.get('c.getFieldLabels');
        action.setParams({ 
            fieldNames : splitFields 
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                console.log("From server additionalFieldsFormattedLabels: " , response.getReturnValue());
                component.set('v.additionalFieldsFormattedLabels', response.getReturnValue());
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: ", errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    },
    
    
    // modal functions
    closeAccountModal:function(component,event){            
        var modal = component.find('selected_account_modal');
        var backdrop = component.find('modal_backdrop');  
        $A.util.removeClass(modal, 'slds-fade-in-open');
        $A.util.removeClass(backdrop, 'slds-backdrop_open'); 
        $A.util.addClass(modal, 'slds-hide');
        
        component.set("v.showModalMap", false);
    },
    openAccountModal: function(component,event) {
        
        component.set("v.showModalMap", true);
        
        var modal = component.find('selected_account_modal');
        var backdrop = component.find('modal_backdrop'); 
        $A.util.removeClass(modal, 'slds-hide');
        $A.util.addClass(modal, 'slds-fade-in-open');
        $A.util.addClass(backdrop, 'slds-backdrop_open'); 
    },
    renderAccounts : function(component, event, accounts){
      	console.log('renderAccounts');
        var arrays = [];
        var size = component.get('v.pageSize');
        console.log('size: ', size);
        
        var i,j,temparray,chunk = 10;
        for (i=0 ,j=accounts.length; i<j; i+=size ) {
            temparray = accounts.slice(i,i+size);
            arrays.push(temparray);
            // do whatever
        }

        console.log('arrays: ', arrays);
        component.set('v.shownAccounts', arrays[0]);
        console.log('shownAccounts: ', arrays[0]);
        component.set('v.currentPage', 0);
        component.set("v.accountList", arrays);
        component.set("v.accountListLength", arrays.length);
    },
    /*
    setSelectedAccountAddress : function(component, event, helper){

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
        console.log('uncodedAddr', uncodedAddr);

        var encodedAddr = uncodedAddr.replace(/ /g, "+");
        console.log('encodedAddr', encodedAddr);
        component.set( "v.encodedAddress", encodedAddr );

    },
    */
})