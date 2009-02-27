jPlex.include('jplex.xprototype.*');
new Test.Unit.Runner({
    testAppendChilds: function() {
        var e = new Element('div');
        e.appendChildren();
        this.assertEqual(e.childNodes.length, 0);
        e.appendChildren(new Element('span'));
        this.assertEqual(e.childNodes.length, 1);
        e.appendChildren(new Element('span')).appendChildren(new Element('span'));
        this.assertEqual(e.childNodes.length, 3);
        e.appendChildren(new Element('span'), new Element('span'), new Element('span'), new Element('span'), new Element('div'));
        this.assertEqual(e.childNodes.length, 8);
        this.assertEqual(e.childNodes[e.childNodes.length - 1].nodeName.toLowerCase(), 'div');

        e = new Element('div');
        e.appendChildren(new Element('span'), [new Element('div'), new Element('span')]);
        this.assertEqual(e.firstChild.nextSibling.nodeName.toLowerCase(), 'div');
        this.assertEqual(e.childNodes.length, 3);
    },
    testRemoveChilds: function() {
        var e = new Element('div');
        e.removeChildren();
        this.assertEqual(e.childNodes.length, 0);
        e.removeChildren(new Element('span'), new Element('span'), new Element('span'), new Element('span'), new Element('div'));
        e.removeChildren().appendChild(new Element('span'));
        this.assertEqual(e.childNodes.length, 1);
        e.removeChildren();
        this.assertEqual(e.childNodes.length, 0);

    },
    testDate: function() {
        var date = new Date(Date.UTC(2008, 9, 3));
        this.assertEqual(date.firstDayOfMonth().format("d-m-Y"), "01-10-2008");
        this.assertEqual(date.lastDayOfMonth().format("d-m-Y"), "31-10-2008");
        this.assertEqual(date.setNextDay().format("d-m-Y"), "04-10-2008");
        this.assertEqual(date.setPreviousDay().format("d-m-Y"), "03-10-2008");
        this.assertEqual(date.setPreviousDay().setPreviousDay().setPreviousDay().format("d-m-Y"),
                "30-09-2008");
        this.assertEqual(date.compareTo(new Date(Date.UTC(2008, 8, 30))), 0);
        this.assertNotEqual(date.compareTo(new Date(Date.UTC(2001, 8, 30))), 0);
    },
    testKeyMap:function() {
        var testKey = Event.Key.A;
        this.tester = 0;
        var h1 = function() {
            this.tester++;
        }.bind(this);
        document.bindKey(testKey, h1);
        Event.simulateKey(document, 'keydown', {keyCode: testKey + 1});
        this.assertEqual(this.tester, 0);
        Event.simulateKey(document, 'keydown', {keyCode: testKey});
        this.assertEqual(this.tester, 1);
        document.unbindKey(testKey);
        Event.simulateKey(document, 'keydown', {keyCode: testKey});
        this.assertEqual(this.tester, 1);
        document.bindKey(testKey, h1);
        Event.simulateKey(document, 'keydown', {keyCode: testKey});
        this.assertEqual(this.tester, 2);
        delete this.tester;
    }
});