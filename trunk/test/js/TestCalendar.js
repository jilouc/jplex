jPlex.include('jplex.components.Calendar');
function createTestCalendarField(opts) {
    var e = new Element('input', {type:'text'});
    document.body.appendChild(e);
    return new Calendar('test', Object.extend(opts, {src:e, date: new Date(2004, 2, 10)}));
}
var cal = createTestCalendarField({fade:0});
new Test.Unit.Runner({
    testOpenCalendar: function() {
        if(Prototype.Browser.IE6) {
            this.info('Warning: Unable to test in IE6 - Impossible to throw simulated mouse');
            return;
        }
        var src = cal.eSrc;      
        cal.hide();
        var offsets = src.cumulativeOffset();
                                               
        // Focus
        Event.simulateMouse(src, 'click', {
            pointerX: offsets.left + 5,
            pointerY: offsets.top + 5
        });
        this.assertVisible(cal.component);

        // Click on the input
        Event.simulateMouse(src, 'click', {
            pointerX: offsets.left + 5,
            pointerY: offsets.top + 5
        });
        this.assertVisible(cal.component);

        var offsetCal = cal.component.cumulativeOffset();
        // Click on the input
        Event.simulateMouse(cal.component, 'click', {
            pointerX: offsetCal.left + 5,
            pointerY: offsetCal.top + 5
        });
        this.assertVisible(cal.component);
                                           
        // Click outside
        Event.simulateMouse(document, 'click', {
            pointerX: offsets.left - 5,
            pointerY: offsets.top + 5
        });
        this.assertNotVisible(cal.component);
    },
    testShowHide: function() {
        this.assertNotVisible(cal.component);
        cal.show();   
        this.assertVisible(cal.component); 
        cal.hide();   
        this.assertNotVisible(cal.component);
        cal.show();
    },
    testSelectDate: function() {
        var s = cal.oCurrent;
        var d = s.getDate();
        this.assertEqual(cal.oCurrent, cal.oFocus);
        this.assertEqual(d.format("d-m-Y"), cal.eSrc.value);
        cal.next();
        //Do not modify
        this.assertEqual(d.format("d-m-Y"), cal.oCurrent.getDate().format("d-m-Y"));
        this.assertEqual(d.format("d-m-Y"), cal.eSrc.value);
        this.assertNotEqual(cal.oCurrent, cal.oFocus);             
        cal.previous();
        //Do not modify
        this.assertEqual(d.format("d-m-Y"), cal.oCurrent.getDate().format("d-m-Y"));
        this.assertEqual(d.format("d-m-Y"), cal.eSrc.value);
        this.assertEqual(cal.oCurrent.getDate(), cal.oFocus.getDate());
        cal.oCurrent.select(); // in case of bugs
        var d = cal.oFocus.getDate();
        var date = new Date(d.getTime());
        cal.up();
        cal.oFocus.select();
        date.setDate(date.getDate()-7);
        this.assertEqual(date.format("d-m-Y"), cal.oFocus.getDate().format("d-m-Y"));
        this.assertEqual(date.format("d-m-Y"), cal.eSrc.value);
                                
        
    }
}, {onFinish: function() { cal.eSrc.remove(); cal.unregister(); }});                                             