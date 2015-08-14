# `static` Class **jplex.common.Locale** #

## Description ##
Global class that manipulates the global language and local settings. We define components on it corresponding to
some parts of the locales. The defined components are for now: 'Date' (and that's all)




## Properties ##
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Name</b> </td><td> <b>Type</b> </td><td> <b>Description</b> </td></tr>
<tr><td> <i>lang</i> </td><td> <code>String</code> </td><td> <code> </code>  The global lang parameter, every default value for lang will be used considering this property.<br>
<br /><b>This value has to be changed if you consider writing an application in a different language than the default value</b><br />Default Value: 'en'</td></tr>

</table>



## Methods ##
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Signature</b> </td><td> <b>Return Type</b> </td><td> <b>Description</b> </td></tr>
<tr><td> <code>current(component, field)</code> </td><td> <code>String|Array</code> </td><td> Useful default usage of the locale string, corresponds to:<br>
<br>
<br>
<source><br>
<br>
Locale.get(component).get(field)<br>
<br>
Unknown end tag for </code><br>
<br>
<br>
with undefined error treatment of course<br />  - <code>component &lt;String&gt;</code> The locale component<br /> - <code>field &lt;String&gt;</code> The wanted field<br />

Unknown end tag for </td>

<br>
<br>
Unknown end tag for </tr><br>
<br>
<br>
<tr><td> <code>get(component, lang)</code> </td><td> <code>Hash</code> </td><td> Get the complete HashSet corresponding to the following component and lang<br />  - <code>component &lt;String&gt;</code> The component<br /> - <code>lang &lt;String&gt;</code> The lang, Locale.lang if not defined<br /></td></tr>
<tr><td> <code>init(component, hashSet)</code> </td><td> <code>void</code> </td><td> Initialize a component into the Locale storage<br />  - <code>component &lt;String&gt;</code> The component<br /> - <code>hashSet &lt;String&gt;</code> Its definition, first indexed by the ISO code of the language, then by the fields<br /></td></tr>

<br>
<br>
Unknown end tag for </table><br>
<br>
