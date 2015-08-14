# `private` `static` Class **jplex.components.menubar.MenuBarSubmenu** #

## Description ##
MenuBar Submenu




## Properties ##
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Name</b> </td><td> <b>Type</b> </td><td> <b>Description</b> </td></tr>
<tr><td> <i>me</i> </td><td> <code>Element</code> </td><td> <code>private  </code>  The <code>&lt;ul&gt;</code> HTML Element of the submenu</td></tr>

</table>



## Methods ##
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Signature</b> </td><td> <b>Return Type</b> </td><td> <b>Description</b> </td></tr>
<tr><td> <code>addItem(item, before)</code> </td><td> <code>MenuBar.Submenu</code> </td><td> Adds the item oItem to the submenu.<br>
If specified, adds it before the nBefore'th item<br />  - <code>item &lt;Object&gt;</code> Item to add (please refer to MenuBar's description above for item properties)<br /> - <code>before &lt;int&gt;</code> Optional. Position of the item (by default the item is pushed at the end)<br /></td></tr>
<tr><td> <code>getHTMLElement()</code> </td><td> <code>Element</code> </td><td> Get the <code>&lt;ul&gt;</code> element for the submenu<br /> </td></tr>
<tr><td> <code>getItem(index)</code> </td><td> <code>MenuBar.Submenu|bool</code> </td><td> Get the submenu of the item at position nIndex<br />  - <code>index &lt;int&gt;</code> Position of the item to get<br /></td></tr>
<tr><td> <code>getItems()</code> </td><td> <code>Array</code> </td><td> Returns the submenu items (array)<br /> </td></tr>
<tr><td> <code>getParentItem()</code> </td><td> <code>menubar.MenuBarItem</code> </td><td> Get the parent item of the submenu<br /> </td></tr>
<tr><td> <code>getRootMenuBar()</code> </td><td> <code>MenuBar</code> </td><td> Returns a reference to the root menu bar<br /> </td></tr>
<tr><td> <code>hide()</code> </td><td> <code>void</code> </td><td> Hides the submenu<br /> </td></tr>
<tr><td> <code>isEmpty()</code> </td><td> <code>bool</code> </td><td> Checks whether the submenu is empty or not<br /> </td></tr>
<tr><td> <code>removeItem(index)</code> </td><td> <code>menubar.MenuBarSubmenu|boolean</code> </td><td> Removes the index-th item of the submenu<br />  - <code>index &lt;int&gt;</code> position of the item to remove<br /></td></tr>
<tr><td> <code>render()</code> </td><td> <code>void</code> </td><td> Renders the submenu, with shade<br /> </td></tr>
<tr><td> <code>show()</code> </td><td> <code>void</code> </td><td> Makes the submenu visible<br /> </td></tr>

</table>