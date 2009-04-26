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
        <li>
            <a href="?p=datatable">Datatable</a>
            <block name="datatable_menu"></block>
        </li>
        <li>
            <a href="?p=datepicker">DatePicker</a>
            <block name="datepicker_menu"></block>
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

    <block name="overview"></block>

    <h2><a name="changes">Change log</a></h2>

    <!--%Releases%-->

    <h2><a name="usage">Usage</a></h2>

    <block name="usage"></block>

    <h2><a name="examples">Examples</a></h2>


</div>
<div id="footer"></div>
<script type="text/javascript">
    document.observe('dom:loaded', CodeHighlighter.init.bind(CodeHighlighter));

    <block name="js"></block>
</script>

</body>
</html>