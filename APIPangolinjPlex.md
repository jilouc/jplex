# `static` Class **jPlex** #

## Description ##
The main jPlex class. Contains the current major version, the dependencies and the list of packages provided.
It also provides packaging primitives and dependancies loading. This class is the only one that you need to
include inside your page to use jPlex. It will load the packages you need after.




## Properties ##
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Name</b> </td><td> <b>Type</b> </td><td> <b>Description</b> </td></tr>
<tr><td> <i>src</i> </td><td> <code>Array</code> </td><td> <code> </code>  Array containing the source code of some (or all) javascript file. Used when the sources are packaged in one file.<br>
Of course, this array is indexed by the path from the source folder.</td></tr>

</table>



## Methods ##
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Signature</b> </td><td> <b>Return Type</b> </td><td> <b>Description</b> </td></tr>
<tr><td> <code>extend(clazz, obj)</code> </td><td> <code>void</code> </td><td> Extends the class by giving static fields. Useful to create inner classes example: Calendar.Item<br />  - <code>clazz &lt;object&gt;</code> The full class name<br /> - <code>obj &lt;object&gt;</code> The new static field<br /></td></tr>
<tr><td> <code>get(clazz)</code> </td><td> <code>Class</code> </td><td> Get a provided class by its full name, but does not include it.<br />  - <code>clazz &lt;object&gt;</code> The class you want<br /></td></tr>
<tr><td> <code>include(path, dontdefine)</code> </td><td> <code>Class</code> </td><td> Packaging method. Includes the selected class by resolving its dependancies. When a class is included<br>
its variable is created. For instance, when you want to include 'jplex.components.Frame', then the class Window<br>
will be available in the var <em>jplex.components.Frame</em>. But by default and convention, the global var<br>
<em>Window</em> is also defined/overwriten. If you do not want to override your global variable, just use the<br>
optional argument.<br>
In the package name, you can also want to import everything from a subpackage (a typical example will be to<br>
import XPrototype only). We have foreseen this trick by adding the possibility to use the <b>as a universal<br>
selector.</b><br />  - <code>path &lt;String&gt;</code> The class/package you want<br /> - <code>dontdefine &lt;object&gt;</code> Optional - True if you do not want to override the global variable<br /></td></tr>
<tr><td> <code>init()</code> </td><td> <code>void</code> </td><td> This function initialize jPlex if need. If prototype is already loaded, then it won't to anything.<br /> </td></tr>
<tr><td> <code>load(load, fileName)</code> </td><td> <code>void</code> </td><td> Loads a javascript file. If the source is embedded, then the source will be <em>eval()</em>, else it will<br>
be loaded via Ajax. That's why you need to run jPlex source tree on a local webserver (for security reasons it's<br>
not allowed to do a request on local disk or distant web service with a different domain).<br />  - <code>load &lt;object&gt;</code><br /> - <code>fileName &lt;String&gt;</code> The path of the file from the source folder<br /></td></tr>
<tr><td> <code>loadJS(fileName)</code> </td><td> <code>void</code> </td><td> Loads a javascript file by writing a <em>&lt;script&gt;</em> on the page.<br>
Currently used to include the dependancies.<br />  - <code>fileName &lt;String&gt;</code> The path of the file<br /></td></tr>
<tr><td> <code>provide(clazz, arg1, arg2)</code> </td><td> <code>void</code> </td><td> Provide to the jPlex package system a new class. This method encapsulates Class.create from prototype.<br>
Any class in the jPlex source code must be declare like this.<br />  - <code>clazz &lt;String&gt;</code> The full class name<br /> - <code>arg1 &lt;String|Object&gt;</code> The mother class name or directly the object that defines the class<br /> - <code>arg2 &lt;Object&gt;</code> The object that defines the class<br /></td></tr>
<tr><td> <code>useSkin(skin)</code> </td><td> <code>void</code> </td><td> Set the global skin theme for jPlex components<br>
A "fake" CSS class is applied to the <code>&lt;body&gt;</code> element of the page. Override some css rules using<br>
the following example:<br>
<pre><code>.custom-skin div.jplex-calendar { custom properties }<br>
...<br>
.custom-skin div.menubar { custom properties }<br>
...</code></pre><br />  - <code>skin &lt;string&gt;</code> Name of a "fake" CSS class that will be added to the body of the page.<br /></td></tr>

</table>