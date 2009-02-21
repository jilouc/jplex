new Test.Unit.Runner({
    testProvide: function() {
        jPlex.provide('jplex.A.B', {
            test:1
        });
        this.assertNotNull(jplex);        
        this.assert(new jplex.A.B().test > 0);
        jPlex.provide('A.B', {
            test:1
        });
        
        this.assertNotNull(A);
        this.assert(new A.B().test > 0); 
        jPlex.provide('A.F', 'A.B', {
            testOther:2
        });                    
        this.assertNotNull(A.F);  
        this.assert(new A.F() instanceof A.B);          
        this.assert(new A.F().testOther > 0);         
        this.assert(new A.F().test > 0); 
             
        window.A = {};
        window.jplex.A = undefined;         
    },
    testGet: function() {
        jPlex.provide('A.B.C', {
            test:1
        });           
        this.assertEqual(A.B.C, jPlex.get('A.B.C'));
        window.A = undefined;
    },
    testInclude: function() {
        jPlex.provide('A.B.C', {
            test:1
        });      
        var B = jPlex.include('A.B.C', true);
        // usually raise ReferenceError but IE throws TypeError 
        this.assertRaise(null, function() {new C();});
        this.assertEqual(B, A.B.C);
                                                       
        jPlex.include('A.B.C');
        this.assert(new C());
        window.A = undefined;                 
    },
    testExtend: function() {
        jPlex.provide('A.B.C', {
            test:1
        });      
        jPlex.extend('A.B.C', {
            coin:1
        });    
        this.assertEqual(A.B.C.coin, 1);
        
    }
});