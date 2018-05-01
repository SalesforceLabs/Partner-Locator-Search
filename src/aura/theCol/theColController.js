({
    doInit : function(component, event, helper) {
        //console.log('doInit');
        var theAccount = component.get('v.account');
        var theField = component.get('v.field');
        var theResult = theAccount[theField];

        if(theResult) {
            // if the result is an object/compound field (i.e. BillingAddress) show a '-'
            if(typeof theResult !== "object") {
                component.set('v.result', theResult);
            }
            else {
                component.set('v.result', '-');
                // component.set('v.result', theResult.street);
            }          
        }
        
    }
})