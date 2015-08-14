# Class **jplex.common.Config** #

## Description ##
The common configuration object that is used in the Component class





## Methods ##
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Signature</b> </td><td> <b>Return Type</b> </td><td> <b>Description</b> </td></tr>
<tr><td> <code>each(fCallback)</code> </td><td> <code>void</code> </td><td> Iterate over the configuration<br />  - <code>fCallback &lt;Function&gt;</code> with a single argument: an object with two properties <em>key</em> and <em>value</em><br /></td></tr>
<tr><td> <code>get(sName)</code> </td><td> <code>Object</code> </td><td> Get the value of the conf. parameter<br />  - <code>sName &lt;String&gt;</code> parameter's name<br /></td></tr>
<tr><td> <code>set(sName, mValue)</code> </td><td> <code>void</code> </td><td> Sets the value of the conf. parameter, if the parameter already exists it will be replaced<br />  - <code>sName &lt;String&gt;</code> parameter's name<br /> - <code>mValue &lt;object&gt;</code> new value<br /></td></tr>

</table>