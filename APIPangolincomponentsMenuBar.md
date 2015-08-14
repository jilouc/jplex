# Class **jplex.components.MenuBar**  _extends [jplex.common.Component](APIPangolincommonComponent.md)_ #

## Description ##
MenuBar component
Place a nice menu bar on your page. It's designed as
the classical menu bars in applications.
It is possible to link events on terminal items.
As an additional feature, you could specify a key shortcut
for this event.
The source for the menu items could be either:
<ul>
<li>a raw JS array. The definition of an item looks like:<br>
<blockquote><pre>{<br>
name:"Item",<br>
click: clickHandler, //Reference to the function to be called at click<br>
icon: 'path/to/icon.png', // Path to a 16x16 icon which will be displayed on the left (optional)<br>
shortcut: {<br>
code: Event.Key.Y, // Key code of the shortcut<br>
ctrl: true, // The shortcut requires the modifier Ctrl to be pressed<br>
text: "Ctrl+Y" // Text displayed at right of the item<br>
},<br>
items: [{...},{...},...] // Array of subitems<br>
}</pre></li>
<li>XML document, fetched with Ajax.Request, with the following scheme:<xmp><br>
    <menubar><br>
       <item name="Item" icon="path/to/icon.png"><br>
            <click key="Event.Key.Y" ctrl="true" text="Ctrl+Y"><br>
                <![CDATA[function() { ... }]]><br>
            </click><br>
            <items><br>
                <item>...</item><br>
                ...<br>
            </items><br>
        </item><br>
    </menubar></xmp><br>
}}}</li><br>
<li>JSON document, fetched with Ajax.Request<br>
(exactly similar to the syntax of the JS Array)</li><br>
</ul><br>
Notice that this class is a singleton. Therefore it can't be instantiated twice.<br>
<br>
<br>
== Event Table ==<br>
<table border="1" cellspacing="0" cellpadding="5"><br>
<tr><td> *Name* </td><td> *Description* </td><td> *Parameters* </td></tr><br>
<tr><td> _afterRenderEvent_ </td><td>  Event that fires after the rendering of the menu </td><td>  </td></tr><br>
<tr><td> _beforeRenderEvent_ </td><td>  Event that fires before the rendering of the menu </td><td>  </td></tr><br>
<tr><td> _onClickEvent_ </td><td>  Event that fires when the menu is clicked </td><td>   - `event <Event>`  the DOM Event information <br/>  </td></tr><br>
<tr><td> _onItemAddEvent_ </td><td>  Event that fires when an item is added to the menu<br>
When an item is added, the handler is copied to the event of the same name of its submenu. </td><td>   - `item <menubar.MenuBarItem>`  the added item <br/>  </td></tr><br>
</table><br>
<br>
<br>
== Properties ==<br>
<table border="1" cellspacing="0" cellpadding="5">        <br>
<tr><td> *Name* </td><td> *Type* </td><td> *Description* </td></tr><br>
<tr><td> _me_ </td><td> `Element` </td><td> `private  `  The `<ul>` HTML Element of the menubar</td></tr><br>
<tr><td> _SOURCE_AJAX_JSON_ </td><td> `Integer` </td><td> `static  `  Configuration constant indicating that menu items comes from a JSON document</td></tr><br>
<tr><td> _SOURCE_AJAX_XML_ </td><td> `Integer` </td><td> `static  `  Configuration constant indicating that menu items comes from a XML document</td></tr><br>
<tr><td> _SOURCE_JS_ARRAY_ </td><td> `Integer` </td><td> `static  `  Configuration constant indicating that menu items comes from a raw JS array</td></tr><br>
<br>
</table><br>
<br>
<br>
<br>
== Methods ==<br>
<table border="1" cellspacing="0" cellpadding="5">                                <br>
<tr><td> *Signature* </td><td> *Return Type* </td><td> *Description* </td></tr><br>
<tr><td> `addItem(newItem, before)` </td><td> `MenuBar` </td><td> Adds the item oItem to the menu root.<br>
If specified, adds it before the nBefore'th item<br />  - `newItem <Object>` Item to add (please refer to the doc above for item properties)<br/> - `before <int>` Optional. Position of the item (by default the item is pushed at the end)<br/></td></tr><br>
<tr><td> `getHTMLElement()` </td><td> `Element` </td><td> Get the `<ul>` element containing the root menu items<br /> </td></tr><br>
<tr><td> `getItem(index)` </td><td> `MenuBar.Submenu` </td><td> Get the submenu of the item at position nIndex<br />  - `index <int>` Position of the item to get<br/></td></tr><br>
<tr><td> `getItems()` </td><td> `Array` </td><td> Returns the direct items of the menubar in an array.<br /> </td></tr><br>
<tr><td> `getRootMenuBar()` </td><td> `menubar.MenuBar` </td><td> Return the instance of MenuBar (convenience method for "polymorphism")<br /> </td></tr><br>
<tr><td> `hide()` </td><td> `void` </td><td> Hides every opened item of the menu<br /> </td></tr><br>
<tr><td> `isActive()` </td><td> `bool` </td><td> Indicated the status of the menubar<br /> </td></tr><br>
<tr><td> `removeItem(index)` </td><td> `void` </td><td> Removes the item at position index<br />  - `index <int>` Optional. Position of the item<br/></td></tr><br>
<tr><td> `render()` </td><td> `void` </td><td> Renders the menu bar root<br /> </td></tr><br>
<tr><td> `setActive(active)` </td><td> `void` </td><td> Set the status of the menubar<br />  - `active <bool>` `true` for "Active" (when the user is using the menubar)<br/></td></tr><br>
<br>
</table><br>
=== Inherited Methods ===<br>
<br>
 * [APIPangolincommonComponent jplex.common.Component]:  `$C`,  `cfg`,  `fireEvent`,  `getEvent`,  `lang`,  `locale`,  `setCfg`,  `setEvent`,  `unregister`, <br>
</code></pre>