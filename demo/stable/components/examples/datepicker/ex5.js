var multiSelect = function(o) {
    $('example-5-values').update(
            '<li>' + o.selected.invoke('format', 'Y/m/d').join('</li><li>') + '</li>'
    );
};

new Calendar('example-5', {
    source: 'example-5-bt',
    dateFormat: 'Y/m/d',
    multiselect: true,
    events: {
        onSelectEvent: multiSelect
    }
});