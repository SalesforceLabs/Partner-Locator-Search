({
	doInit : function(component, event, helper) {
        var spinner = component.find('spinner');
        $A.util.removeClass(spinner, "slds-hide");    
        helper.setSectionBody(component, event, helper);
	},
    
    hideSpinner : function (component, event, helper) {
        var spinner = component.find('spinner');
        $A.util.addClass(spinner, "slds-hide");    
    }
})