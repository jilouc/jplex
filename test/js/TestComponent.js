jPlex.include('jplex.common.Component');
A = Class.create(Component, {
    _definition: {
        name:'A',
        text: {
            fr: { CLOSE: 'Fermer' },
            en: { CLOSE: 'Close' }
        },
        defaultContainer:'div'
    },
    initialize: function($super, element, config) {
        $super(element, config);
    }
});
new Test.Unit.Runner({
    testID: function() { 
        var a = new A('asd');
        this.assertEqual(a.UID, 'jplex-a-0');
        a = new A('asd');
        this.assertEqual(a.UID, 'jplex-a-1');
    },
    testLocale: function() {
        Locale.lang = 'fr';
        var a = new A('asd');
        this.assertEqual(a.locale('Date', 'MONTHS')[0], 'Janvier');
        this.assertEqual(a.lang('CLOSE'), 'Fermer');
        Locale.lang = 'en';
        this.assertEqual(a.locale('Date', 'MONTHS')[0], 'January');
        this.assertEqual(a.lang('CLOSE'), 'Close');
        a = new A('asd',{lang:'fr'});
        this.assertEqual(a.locale('Date', 'MONTHS')[0], 'Janvier');
        this.assertEqual(a.lang('CLOSE'), 'Fermer');
        
        this.assert(a.lang('Pouet') == undefined);
    },
    testDollarC: function() {
        this.assertNull($C('tester'));
        var a = new A('tester');
        this.assert($C('tester') == a);
        a.unregister();               
        this.assertNull($C('tester'));
    },
    testWrongArgument: function() {                             
        this.assertRaise(null, function() { new A(); });
        // a number as id is not alright... because an object will be created
        this.assertRaise(null, function() { new A(2); });
    },
    testWrongDefinition: function() {
        var B = Class.create(Component, {});
        this.assertRaise(null, function() {new B('t'); });
        B = Class.create(Component, {
           _definition: {}
        });
        this.assertRaise(null, function() {new B('t'); });
        B = Class.create(Component, {
           _definition: {name: 'B'}
        });
        this.assertRaise(null, function() {new B('t'); });
        // This test is a bit tricky, if you give a container that exists, you do not need defaultContainer
        this.assert(new B('results'));
    },
    testIdAssign: function() {
        document.body.appendChild(new Element('div',{id:'testIdAssign'}));
        this.assertNull($('testId'));
        var a = new A('testId');
        var tester = $('testId');
        this.assertNotNull(tester);
        this.assertEqual(tester, a.component);
        a.unregister();
        this.assertNull($('testId'));
        var e = $('testIdAssign');   
        var a = new A('testIdAssign'); 
        this.assertEqual($('testIdAssign'), a.component);  
        a.unregister();   
        this.assertNotNull($('testIdAssign'));
    }
});
