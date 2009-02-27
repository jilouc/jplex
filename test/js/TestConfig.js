new Test.Unit.Runner({
    testGet: function() {
        var conf = new Config({a: 0, b:10});
        this.assertEqual(conf.get('a'), 0);
        this.assertEqual(conf.get('b'), 10);
        this.assertEqual(conf.get('c'), undefined);
    },
    testSet: function() {
        var conf = new Config({basd: true});
        conf.set('a', 0);
        this.assertEqual(conf.get('a'), 0);
        conf.set('a', 10);
        this.assertEqual(conf.get('a'), 10);
        conf.set('basd', false);
        this.assertEqual(conf.get('basd'), false);
    },
    testEach: function() {
        this.tab = new Array();
        this.tab['a'] = 1;
        this.tab['b'] = 20;
        this.tab['c'] = "blug";
        
        var conf = new Config({a: 1, b: 20, c:"blug"}); 
        conf.each(function(item){
            this.assertEqual(this.tab[item.key], item.value);
        }.bind(this));
    }
});