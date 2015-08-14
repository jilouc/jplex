# `private` `static` Class **jplex.components.menubar.MenuBarItem** #

## Description ##
MenuBar Item subclass




## Properties ##
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Name</b> </td><td> <b>Type</b> </td><td> <b>Description</b> </td></tr>
<tr><td> <i>me</i> </td><td> <code>Element</code> </td><td> <code>private  </code>  The <code>&lt;li&gt;</code> HTML Element of the item</td></tr>

</table>



## Methods ##
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Signature</b> </td><td> <b>Return Type</b> </td><td> <b>Description</b> </td></tr>
<tr><td> <code>getDetails()</code> </td><td> <code>Object</code> </td><td> Get details about the item. The method returns an object following this model:<br>
<pre><code>{<br>
label: the label of the item,<br>
icon: the path to the 16x16 icon,<br>
shortcut: {<br>
key: Key shortcut (Event.Key.&lt;a key&gt;),<br>
ctrl: Requires the ctrl key to be pressed or not,<br>
text: label of the helper text for the shortcut<br>
},<br>
link: link for the item,<br>
event: custom event on item activation (click or shortcut)<br>
}</code></pre>
Each field of the object is boolean equivalent to <code>false</code> if undefined.<br /> </td></tr>
<tr><td> <code>getHTMLElement()</code> </td><td> <code>Element</code> </td><td> Get the <code>&lt;li&gt;</code> HTMLElement of the item, extended by Prototype's Element.extend<br /> </td></tr>
<tr><td> <code>getMenu()</code> </td><td> <code>menubar.MenuBarSubmenu|menubar.MenuBar</code> </td><td> Get the menu that contains the item<br /> </td></tr>
<tr><td> <code>getSubmenu()</code> </td><td> <code>menubar.MenuBarSubmenu</code> </td><td> Get the submenu of the item (not its containing submenu)<br /> </td></tr>
<tr><td> <code>render(items)</code> </td><td> <code>void</code> </td><td> Renders the menu item (and creates all submenus)<br />  - <code>items &lt;Array&gt;</code> The sub-items of the item, defining its submenu<br /></td></tr>

</table>