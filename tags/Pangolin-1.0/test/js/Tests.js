var testId = 0;
function generateTests(title, argv) {
    var args = $A(argv);
    var table = new Element('table').addClassName('tester');
    var tbody = new Element('tbody');
    var tr;
    args.each(function(a,i) {
        if (i % 2 == 0) {
            tr = new Element('tr'); 
            tbody.appendChild(tr);
        }
        var td = new Element('td').setStyle({width: '50%', verticalAlign:'top'});
        var h3 = new Element('h3').update(a);
        var img = new Element('img', {src: '../styles/plus.gif', alt:'deploy'}).
                setStyle({marginRight: '10px'});        
        td.observe('click', function(id) {
            $('testlog' + id).toggle();
            if (this.src.indexOf('minus') >= 0)
                this.src = '../styles/plus.gif';
            else
                this.src = '../styles/minus.gif';
        }.curry(testId).bind(img));                 
        td.appendChild(new Element('div').update('&nbsp;').addClassName('loading').setStyle({marginTop:'1em'}));
        td.appendChild(h3);   
        h3.insert({top: img});
        td.appendChild(new Element('div', {id:'testlog' + testId}).hide());
        testId++;
        tr.appendChild(td);
    });    
    var h2 = new Element('h2').update(title);
    document.body.appendChild(h2);    
    table.appendChild(tbody);
    document.body.appendChild(table);

    args.each(function(a) {
        document.write("<script src=\"js/Test" + a + ".js\" type=\"text/javascript\" charset=\"utf-8\"><" + "/script>");
    });
}
                    
var period = 0.1;
var s = 0;                          
    var globE = 0, globF = 0, globP = 0;    
    var ok = [];
new PeriodicalExecuter(function(pe) {
    var i = 0;
    var stillRunning = 0;
    for (i = 0; i < testId; i++) {
        if(ok[i]) continue;
        if(!Test.Unit.FinishedJobs[i]) {
            stillRunning++;
            continue;
        }
        var div = $('testlog' + i);
        var e = $$("td #testlog" + i + " table tr.error").length;
        var f = $$("td #testlog" + i + " table tr.failed").length;
        var p = $$("td #testlog" + i + " table tr.passed").length;

        globE += e;
        globF += f;
        globP += p;
        
        if (f + e > 0) {
            div.parentNode.className = 'error';
            div.show();
        }
        else if (p > 0) div.parentNode.className = 'passed';
            $(div.parentNode.firstChild).hide();
        ok[i] = true;
    }
    var results = $('results');
    if (stillRunning == 0) { 
        pe.stop();
        results.update(globP + " passed, " + globF + " failure(s), " + globE + " error(s)");
    } else {
        var loader = "<span class=\"loading\" style=\"float:left;margin-right:1em;\">&nbsp;</span> ";
        results.update(loader+stillRunning+" batch(es) still running");
    }
    if (globF + globE > 0)
        results.className = 'error';

    else if (globP > 0) results.className = 'passed';
}, period);
