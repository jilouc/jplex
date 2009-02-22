jPlex.loadJS("syntax-highlighter-1.5.1/js/shCore.js");
jPlex.loadJS("syntax-highlighter-1.5.1/js/shBrushJScript.js");
jPlex.loadJS("syntax-highlighter-1.5.1/js/shBrushCss.js");
jPlex.loadJS("syntax-highlighter-1.5.1/js/shBrushXml.js");

document.observe("dom:loaded", function () {
    dp.SyntaxHighlighter.ClipboardSwf = 'syntax-hightlighter-1.5.1/js/clipboard.swf';
    dp.SyntaxHighlighter.HighlightAll('code');
});
