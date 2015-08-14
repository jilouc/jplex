# Class **jplex.components.Frame**  _extends [jplex.common.Component](APIPangolincommonComponent.md)_ #

## Description ##
Frame component.
The frame/window is a common component in every UI Library and widely used over the web.
Basically, it mimics the behavior of similar UI component in Java Swing, C++ QT...
and easily catches user's attention on a specific content.
<p>
This class provides the core features for displaying and manipulating windows, such as<br>
<ul>
<li>Title bar and footer bar, with an optional "close" button</li>
<li>Load the content with Ajax Request</li>
<li>Drag and drop the window</li>
<li>Control of the size and position of the window (center, min/max width/height...)</li>
<li>Events on key moments of the life-cycle</li>
<li>Display (or not) a semi-transparent overlay behind the window</li>
</ul>
Have a look to configuration parameters to see how you can set up your window and mix parameters together.<br>
</p>
<p>
jPlex also provides some preconfigured subclasses of the Frame component for<br>
<ul>
<li>Modal window : Display an overlay behing the window, see jplex.components.frame.Modal</li>
<li>Dialog window : Add two buttons automatically in the footer (typically "OK" and "Cancel"),<br>
see jplex.components.frame.Dialog</li>
</ul>
</p>

## Config Table ##
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Name</b> </td><td> <b>Default Value</b> </td><td> <b>Description</b> </td></tr>
<tr><td> <i>ajax</i> </td><td> <code>null</code> </td><td>  URL of the file to get the content from. If <code>null</code>, no content is loaded<br>
and you'll have to use the <code>setBody</code> method to add some content to your window. </td></tr>
<tr><td> <i>ajaxParameters</i> </td><td> <code>{}</code> </td><td>  HashSet of parameters for the ajax call. E.g. <code>{ foo: "bar" }</code> </td></tr>
<tr><td> <i>center</i> </td><td> <code>true</code> </td><td>  Center the window on the screen.<br>
Note: it won't stay centered on resize/scroll/content change<br>
unless you set <code>constrainToCenter</code> to <code>true</code>. </td></tr>
<tr><td> <i>close</i> </td><td> <code>Frame.CLOSE_BUTTON</code> </td><td>  Way to close the window:<br>
<ul><li><code>jplex.components.Frame.CLOSE_BUTTON</code>:<br>
will display a close button on the top-right corner</li>
<li><code>jplex.components.Frame.CLOSE_CLICK_OUT</code>:<br>
the window will be closed when the user clicks outside the window<br>
(be sure your users know it), it's designed especially for modal windows.</li>
<li><code>jplex.components.Frame.CLOSE_CUSTOM</code>:<br>
it's your responsability to call the <code>show()</code> and <code>hide()</code> methods.</li>
</ul> </td></tr>
<tr><td> <i>constrainToCenter</i> </td><td> <code>false</code> </td><td>  If <code>true</code>, the window will stay centered no matter<br>
if the viewport is resized, scrolled or if the content changes </td></tr>
<tr><td> <i>constrainToViewport</i> </td><td> <code>true</code> </td><td>  Make sure the window stay inside the viewport bounds (even when dragged) </td></tr>
<tr><td> <i>draggable</i> </td><td> <code>false</code> </td><td>  Indicates whether the window could be dragged in the viewport.<br>
Note: if the window has a header (title bar) only this header can be grabbed<br>
for drag'n'drop, if it has no header, the entire window can be grabbed.<br>
(Use of Script.aculo.us Draggable class) </td></tr>
<tr><td> <i>footer</i> </td><td> <code>false</code> </td><td>  Show a footer (like a status-bar) at the bottom of the window<br>
(for Dialog windows, the footer will contain the buttons) </td></tr>
<tr><td> <i>header</i> </td><td> <code>true</code> </td><td>  Show the title bar or not (so you can use <code>setTitle</code> and have a close button on top-right corner) </td></tr>
<tr><td> <i>height</i> </td><td> <code>null</code> </td><td>  The initial height of the window (in pixels) </td></tr>
<tr><td> <i>maxHeight</i> </td><td> <code>null</code> </td><td>  Maximum height of the window (constrained) </td></tr>
<tr><td> <i>maxWidth</i> </td><td> <code>null</code> </td><td>  Maximum width of the window (constrained) </td></tr>
<tr><td> <i>minHeight</i> </td><td> <code>null</code> </td><td>  Minimum Height of the window (constrained) </td></tr>
<tr><td> <i>minWidth</i> </td><td> <code>null</code> </td><td>  Minimum width of the window (constrained) </td></tr>
<tr><td> <i>modal</i> </td><td> <code>false</code> </td><td>  Flag indicating you want to add a modal behavior to the window<br>
(overlay behind) </td></tr>
<tr><td> <i>overflow</i> </td><td> <code>"auto"</code> </td><td>  CSS "overflow" Property for the body of the window<br>
(i.e. the window without header and footer).<br>
Use in combination with maxWidth/maxHeight.<br>
(<code>auto</code> adds scrollbar(s) if needed, <code>hidden</code> hides extra content,<br>
<code>scroll</code> adds scrollbars, <code>scroll-x</code> and <code>scroll-y</code> add the corresponding scroll bar) </td></tr>
<tr><td> <i>overlayColor</i> </td><td> <code>#000000 (black)</code> </td><td>  Background color of the overlay </td></tr>
<tr><td> <i>overlayFade</i> </td><td> <code>false</code> </td><td>  If set to <code>true</code> the overlay will (dis)appear with a fade in/out effect </td></tr>
<tr><td> <i>overlayOpacity</i> </td><td> <code>0.6</code> </td><td>  Opacity of the overlay (from 0 to 1, 1 is opaque and 0 fully transparent) </td></tr>
<tr><td> <i>title</i> </td><td> <code>""</code> </td><td>  Title of the window (pertinent only if there <i>is</i> a header). </td></tr>
<tr><td> <i>width</i> </td><td> <code>null</code> </td><td>  The initial width of the window (in pixels) </td></tr>
<tr><td> <i>zBase</i> </td><td> <code>9998</code> </td><td>  The z-index base for this window. You can adjust it to match your design.<br>
(the overlay (if any) will have this z-index and the window the same + 1) </td></tr>
</table>

## Event Table ##
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Name</b> </td><td> <b>Description</b> </td><td> <b>Parameters</b> </td></tr>
<tr><td> <i>afterRenderEvent</i> </td><td>  After the rendering step (the window is built) </td><td>  </td></tr>
<tr><td> <i>beforeRenderEvent</i> </td><td>  Before the window is rendered (before any element is added) </td><td>  </td></tr>
<tr><td> <i>onAjaxRequestCompleteEvent</i> </td><td>  When the Ajax Request to retrieve the content of the window is completed </td><td>   - <code>result &lt;Object&gt;</code>  the Ajax Request's result (get the text result with <code>result.responseText</code> for instance) <br />  </td></tr>
<tr><td> <i>onHideEvent</i> </td><td>  When the window disappears </td><td>  </td></tr>
<tr><td> <i>onShowEvent</i> </td><td>  When the window appears </td><td>  </td></tr>
</table>


## Properties ##
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Name</b> </td><td> <b>Type</b> </td><td> <b>Description</b> </td></tr>
<tr><td> <i>CLOSE_BUTTON</i> </td><td> <code>String</code> </td><td> <code>static  </code>  Configuration constant: use a button to close the frame</td></tr>
<tr><td> <i>CLOSE_CLICK_OUT</i> </td><td> <code>String</code> </td><td> <code>static  </code>  Configuration constant: the frame is closed when the user clicks outside</td></tr>
<tr><td> <i>CLOSE_CUSTOM</i> </td><td> <code>String</code> </td><td> <code>static  </code>  Configuration constant: you decide when the frame is shown/hidden</td></tr>
<tr><td> <i>list</i> </td><td> <code>Array</code> </td><td> <code>static  </code>  Array of references to all window components used (useful to set z-indices)</td></tr>

</table>



## Methods ##
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Signature</b> </td><td> <b>Return Type</b> </td><td> <b>Description</b> </td></tr>
<tr><td> <code>constrain()</code> </td><td> <code>void</code> </td><td> Apply all positioning constraints to the window<br /> </td></tr>
<tr><td> <code>getZIndex()</code> </td><td> <code>void</code> </td><td> Get used ZI<br /> </td></tr>
<tr><td> <code>hide()</code> </td><td> <code>void</code> </td><td> Hide the frame<br /> </td></tr>
<tr><td> <code>makeCentered()</code> </td><td> <code>void</code> </td><td> Place the frame at the center of the viewport<br /> </td></tr>
<tr><td> <code>reload()</code> </td><td> <code>void</code> </td><td> Load or reload the content of the body from the result of the ajax request<br>
(the URL of the content is given by the <code>ajax</code> configuration parameter)<br /> </td></tr>
<tr><td> <code>render()</code> </td><td> <code>void</code> </td><td> Renders the component. Add elements depending on the configuration, apply CSS classes...<br /> </td></tr>
<tr><td> <code>setBody(body)</code> </td><td> <code>Element</code> </td><td> If the body already exists, update its content, else<br>
create the body element and add the content.<br />  - <code>body &lt;String&gt;</code> Content of the body<br /></td></tr>
<tr><td> <code>setFooter(footer)</code> </td><td> <code>Element</code> </td><td> If the footer already exists, update the footer with the given content,<br>
else create it and update the content.<br />  - <code>footer &lt;String&gt;</code><br /></td></tr>
<tr><td> <code>setHeader(header)</code> </td><td> <code>Element</code> </td><td> If the header already exists, replace the title with the given string.<br>
If not, create the title bar and set the given string as title.<br />  - <code>header &lt;String&gt;</code> the title of the window<br /></td></tr>
<tr><td> <code>setLoading(start)</code> </td><td> <code>void</code> </td><td> Show the "activity indicator" while the content of the frame is dynamically loaded<br>
or hide it when it's done.<br />  - <code>start &lt;bool&gt;</code> <code>true</code> to start loading mode, <code>false</code> to stop it<br /></td></tr>
<tr><td> <code>setTitle(title)</code> </td><td> <code>Element</code> </td><td> Alias for setHeader<br />  - <code>title &lt;String&gt;</code><br /></td></tr>
<tr><td> <code>show()</code> </td><td> <code>void</code> </td><td> Show the frame<br /> </td></tr>

</table>
### Inherited Methods ###

  * [jplex.common.Component](APIPangolincommonComponent.md):  `$C`,  `cfg`,  `fireEvent`,  `getEvent`,  `lang`,  `locale`,  `setCfg`,  `setEvent`,  `unregister`,