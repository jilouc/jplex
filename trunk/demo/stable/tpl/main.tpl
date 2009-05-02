<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
        "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <title>
        <block name="title"></block>
    </title>
    <link rel="stylesheet" type="text/css" href="libs/assets/jplex.css"/>
    <!--[if IE 6]><link rel="stylesheet" type="text/css" href="libs/assets/jplex-ie6.css" /><![endif]-->
    <!--[if IE 7]><link rel="stylesheet" type="text/css" href="libs/assets/jplex-ie7.css" /><![endif]-->
    <link rel="stylesheet" type="text/css" href="libs/syntax/syntax.css"/>
    <link rel="stylesheet" type="text/css" href="assets/common.css"/>
    <link rel="stylesheet" type="text/css" href="assets/<block name="css"></block>"/>

    <script type="text/javascript" src="libs/jplex.js"></script>
    <script type="text/javascript" src="libs/syntax/syntax.js"></script>

</head>
<body>
<div id="menu">
    <img src="assets/jplex.png" alt="jPlex"/>
    <ul>
        <li>Common
            <ul style="margin-top:0">
                <li style="background:none; padding-left:0;">
                    <a href="?p=datasource">DataSource</a>
                </li>
            </ul>
        </li>
        <li>
            <a href="?p=datatable">Datatable</a>
            <block name="datatable_menu"></block>
        </li>
        <li>
            <a href="?p=datepicker">DatePicker</a>
            <block name="datepicker_menu"></block>
        </li>
        <li>
            <a href="?p=menubar">MenuBar</a>
            <block name="menubar_menu"></block>
        </li>
        <li>
            <a href="?p=frame">Frame / Dialog</a>
            <block name="frame_menu"></block>
        </li>
        <li>
            <a href="?p=tabs">Tabs</a>
            <block name="tabs_menu"></block>
        </li>
        <li>
            <a href="?p=tooltip">Tooltip</a>
            <block name="tooltip_menu"></block>
        </li>
    </ul>
</div>
<div id="main">
    <h1>
        <block name="title"></block>
    </h1>

    <h2><a name="overview">Overview</a></h2>

    <!--%Overview%-->

    <h2><a name="changes">Change log</a></h2>

    <!--%Releases%-->

    <h2><a name="usage">Usage</a></h2>

    <!--%Usage%-->
    
    <h3>Available configuration parameters:</h3>
    
    <div class="expand-config">Click here to expand configuration properties.</div>
    <div class="compact-config" style="display:none;">Click here to shrink configuration properties.</div>
    <!--%Configs%-->
    <div class="compact-config" style="display:none;">Click here to shrink configuration properties.</div>

    <h3>Available events:</h3>

    <div class="expand-events">Click here to expand events list.</div>
    <div class="compact-events" style="display:none;">Click here to shrink events list.</div>
    <!--%Events%-->
    <div class="compact-events" style="display:none;">Click here to shrink events list.</div>

    <h2><a name="examples">Examples</a></h2>

    <div class="info">Click on the title to run the example</div>
    
    <!--%Examples%-->
    
</div>
<div id="footer"></div>
<script type="text/javascript">
    document.observe('dom:loaded', CodeHighlighter.init.bind(CodeHighlighter));


    Demos = { examples:$A() };
    Demos.toggleConfigs = function() {
        $$('.config tbody, .compact-config, .expand-config').invoke('toggle');
    };
    Demos.toggleEvents = function() {
        $$('.events tbody, .compact-events, .expand-events').invoke('toggle');
    };
    Demos.Example = Class.create({
        initialize: function(runner, source) {
            this.alreadyRun = false;
            var s = source;
            this.run = runner.wrap(function(proceed) {
                $(s+'-close').toggle();
                $(s).toggle();
                if(!this.alreadyRun) {
                    this.alreadyRun = true;
                    return proceed();
                }
            }.bind(this));
        }
    });
    Demos.toggleExample = function(e, i) {
        $('ex'+i+'-close').toggle();
        $('examples').down('div.example', i-1).toggle();
        e.stop();
    };

    jPlex.include('/***JSPath***/');
    var runners = [/***JSRunners***/];
    runners.each(function(s,i) {
        Demos.examples[i] = new Demos.Example(s, 'ex'+(i+1));
    });

    $$('.compact-config, .expand-config').invoke('observe', 'click', Demos.toggleConfigs);
    $$('.compact-events, .expand-events').invoke('observe', 'click', Demos.toggleEvents);
    $('examples').select('li').each(function(s, i) {
        s.insert(' <a id="ex'+(i+1)+'-close" class="close" style="display:none;">(Close)</a>');
        $('ex'+(i+1)+'-close').observe('click', Demos.toggleExample.bindAsEventListener(s,i+1))

        s.observe('click', Demos.examples[i].run);
    });

    $$('div.example').each(function(s) {
        s.toggle();

    });
</script>

</body>
</html>