# Class **jplex.components.frame.Dialog**  _extends [jplex.components.Frame](APIPangolincomponentsFrame.md)_ #

## Description ##
A preconfigured dialog box frame class<p>
It automatically adds two buttons to the footer of the frame: typically OK and Cancel.<br>
You can add extra buttons if you want or remove the default ones, customize labels,...<br>
All configuration paraameters from jplex.components.Frame are inherited. The following ones<br>
are overridden to configure the Dialog frame:<br>
<ul>
<li><code>header: true</code></li>
<li><code>center: true</code></li>
<li><code>draggable: true</code></li>
</ul>

<h2>Config Table</h2>
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Name</b> </td><td> <b>Default Value</b> </td><td> <b>Description</b> </td></tr>
<tr><td> <i>cancelButton</i> </td><td> <code>true</code> </td><td>  Shows the "cancel" button if set to <code>true</code>. </td></tr>
<tr><td> <i>cancelButtonLabel</i> </td><td> <code>""</code> </td><td>  Custom label for the 'cancel' button </td></tr>
<tr><td> <i>okButton</i> </td><td> <code>true</code> </td><td>  Shows the "ok" button if set to <code>true</code>. </td></tr>
<tr><td> <i>okButtonLabel</i> </td><td> <code>""</code> </td><td>  Custom label for the 'OK' button </td></tr>
<tr><td> <i>otherButtons</i> </td><td> <code>[]</code> </td><td>  Array of optional button, each item of the array is an object like the following<br>
<pre><code>{<br>
label: "Label of the button",<br>
click: function: { Function triggered on click }<br>
}</code></pre>
Note that in the 'click' function, <code>this</code> will refer to the instance of Dialog. </td></tr>
</table>
<h3>Inherited Configs</h3>
<ul><li><a href='APIPangolincomponentsFrame.md'>jplex.components.Frame</a>:  <code>ajax</code>,  <code>ajaxParameters</code>,  <code>center</code>,  <code>close</code>,  <code>constrainToCenter</code>,  <code>constrainToViewport</code>,  <code>draggable</code>,  <code>footer</code>,  <code>header</code>,  <code>height</code>,  <code>maxHeight</code>,  <code>maxWidth</code>,  <code>minHeight</code>,  <code>minWidth</code>,  <code>modal</code>,  <code>overflow</code>,  <code>overlayColor</code>,  <code>overlayFade</code>,  <code>overlayOpacity</code>,  <code>title</code>,  <code>width</code>,  <code>zBase</code>,</li></ul>

<h2>Event Table</h2>
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Name</b> </td><td> <b>Description</b> </td><td> <b>Parameters</b> </td></tr>
<tr><td> <i>onCancelButtonClickEvent</i> </td><td>  When the "CancelButton" is clicked </td><td>  </td></tr>
<tr><td> <i>onOkButtonClickEvent</i> </td><td>  When the "OK" button is clicked </td><td>  </td></tr>
</table>
<h3>Inherited Events</h3>
<ul><li><a href='APIPangolincomponentsFrame.md'>jplex.components.Frame</a>:  <code>afterRenderEvent</code>,  <code>beforeRenderEvent</code>,  <code>onAjaxRequestCompleteEvent</code>,  <code>onHideEvent</code>,  <code>onShowEvent</code>,</li></ul>

