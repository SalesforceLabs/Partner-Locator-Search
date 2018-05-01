({
	// Your renderer method overrides go here
	afterRender: function (component, helper) {
        this.superAfterRender();
        // interact with the DOM here
        //console.log('*** ResultList afterRender ***');
        var resultList = component.find('resultListPlaceholder');
        //console.log('resultList', resultList);
        $A.util.addClass(resultList, 'slds-hide');
    },
})