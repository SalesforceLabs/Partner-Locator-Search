({	
    sanitizeUrl : function (component, event, helper) {
        console.log('sanitizeUrl');
        var el = document.createElement('a');
        var theAccount = component.get('v.theAccount');
        console.log('theAccount: ', theAccount.Website);
        el.href = theAccount.Website;
        if (el.protocol !== 'https:') { 
            theAccount.Website = '';
            component.set('v.theAccount', theAccount);
        }
    },
    goToAccount : function (component, event, helper) {
        console.log(component.get("v.theAccount.Id"));
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
          "recordId": component.get("v.theAccount.Id"),
          "slideDevName": "detail"
        });
        navEvt.fire();
        
    }
    
})