# `static` Class **jplex.xprototype.Event** #

## Description ##
jPlex's XPrototype extended Event




## Properties ##
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Name</b> </td><td> <b>Type</b> </td><td> <b>Description</b> </td></tr>
<tr><td> <i>Key</i> </td><td> <code>object</code> </td><td> <code>static  </code>  Map of all key codes, including special characters</td></tr>

</table>



## Methods ##
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Signature</b> </td><td> <b>Return Type</b> </td><td> <b>Description</b> </td></tr>
<tr><td> <code>onElementReady(element, handler)</code> </td><td> <code>void</code> </td><td> Execute the given handler as soon as the element is detected<br>
in the DOM. It uses Prototype's PeriodicalExecuter to check<br>
the presence every Event.<i>ready_POLL_INTERVAL milliseconds.<br>
If not found after Event.</i>ready_POLL_LIMIT tries, we simply<br>
give up.<br>
By default this limit is set to 800 tries, with a 5 ms delay<br>
between them (40s max.)<br>
Note that 'this' refers to the Element (i.e. $(element))<br>
itself in the callback function.<br />  - <code>element &lt;String&gt;</code> ID of the element we are waiting for<br /> - <code>handler &lt;Function&gt;</code> Associated callback.<br /></td></tr>

</table>