({
    doInit : function(component, event, helper) {
        console.log('AccountImage doInit');
        var action = component.get("c.getAccLogo");
        action.setParams({ 
            'accountId' : component.get("v.accountId")
        });
		action.setCallback(this, function(response) {
            var state = response.getState();
            console.log('AccountImage state', state);
            if (state === "SUCCESS") {   
                console.log('AccountImage resp', response.getReturnValue());
                component.set("v.attachment", response.getReturnValue() );
            }
            else if (state === "INCOMPLETE") {
                // do something
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        //console.log("Error message: ", errors[0].message);
                    }
                } else {
                    //console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action); 
    },
    
 
})