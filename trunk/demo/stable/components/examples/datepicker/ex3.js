var customSelect = function(o) {
    $('ex3-day').value = o.date.format('d');
    $('ex3-month').value = o.date.format('m');
    $('ex3-year').value = o.date.format('Y');
};

new Calendar('example-3', {
    source:'example-3-bt',
    events:{
        onSelectEvent:customSelect
    }
});