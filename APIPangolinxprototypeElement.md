# Class **jplex.xprototype.Element** #

## Description ##
jPlex's XPrototype extended DOM Element




## Properties ##
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Name</b> </td><td> <b>Type</b> </td><td> <b>Description</b> </td></tr>
<tr><td> <i>getOffsetParent</i> </td><td> <code>object</code> </td><td> <code> </code>  Bug-fixed getOffsetParent (see Prototype <a href='https://code.google.com/p/jplex/issues/detail?id=#365'>Issue #365</a>)</td></tr>

</table>



## Methods ##
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Signature</b> </td><td> <b>Return Type</b> </td><td> <b>Description</b> </td></tr>
<tr><td> <code>appendChildren(Elements)</code> </td><td> <code>Element</code> </td><td> Appends all elements listed as arguments to the DOM element<br />  - <code>Elements &lt;List&lt;Element&gt;&gt;</code> to add<br /></td></tr>
<tr><td> <code>bindKey(key, handler, config)</code> </td><td> <code>Element</code> </td><td> Bind a key event on an element<br />  - <code>key &lt;int&gt;</code> Key-Code (see Event)<br /> - <code>handler &lt;Function&gt;</code><br /> - <code>config &lt;Object&gt;</code> This object is a boolean property hash object containing: <code>ctrl</code>, <code>shift</code>, <code>alt</code> and <code>preventDefault</code> (enough explicit)<br /></td></tr>
<tr><td> <code>IEFixCombobox()</code> </td><td> <code>void</code> </td><td> Inserts a hidden iframe behind the element to correct the Combobox bug (an absolute <code>div</code> goes under a comboxbox)<br>
that happens only in Internet Explorer 6. The Calendar component exploits this function to fix the bug for instance.<br /> </td></tr>
<tr><td> <code>isWithin(x, y)</code> </td><td> <code>Boolean</code> </td><td> Determines wheter the point of coordinates (x,y) on the page is within the element or not<br />  - <code>x &lt;Integer&gt;</code> Horizontal coordinate<br /> - <code>y &lt;Integer&gt;</code> Vertical coordinate<br /></td></tr>
<tr><td> <code>removeChildren()</code> </td><td> <code>Element</code> </td><td> Removes all children of the element<br /> </td></tr>
<tr><td> <code>unbindKey(key, modifiers)</code> </td><td> <code>Element</code> </td><td> Unbind a key on the element<br />  - <code>key &lt;int&gt;</code> Key-Code (see Event)<br /> - <code>modifiers &lt;Object&gt;</code> Same form as <code>config</code> in <code>bindKey</code><br /></td></tr>

</table>