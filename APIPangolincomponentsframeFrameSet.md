# Class **jplex.components.frame.FrameSet**  _extends [jplex.common.Component](APIPangolincommonComponent.md)_ #

## Description ##
Creates a set of Frames.
This component is a kind of windows manager since it handles the
interaction between the different frames you've added.
<p>
Since Modal windows are <code>modal</code> (sic), it makes no sense to add a modal<br>
frame to the frame set: a modal frame doesn't interact with any other frame, it is modal.<br>
Even if there is no code-limitation about that, it leads to strange<br>
behaviors sometimes. Just avoid it.<br>
<br>
<h2>Config Table</h2>
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Name</b> </td><td> <b>Default Value</b> </td><td> <b>Description</b> </td></tr>
<tr><td> <i>overlay</i> </td><td> <code>false</code> </td><td>  Show an overlay behind the whole frame set if <code>true</code> </td></tr>
<tr><td> <i>overlayColor</i> </td><td> <code>"#000000" (black)</code> </td><td>  Color of the overlay (only if <code>overlay</code> is <code>true</code>) </td></tr>
<tr><td> <i>overlayOpacity</i> </td><td> <code>0.6</code> </td><td>  Opacity of the overlay (only if <code>overlay</code> is <code>true</code>) </td></tr>
</table>

<h2>Event Table</h2>
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Name</b> </td><td> <b>Description</b> </td><td> <b>Parameters</b> </td></tr>
<tr><td> <i>onAddFrameEvent</i> </td><td>  When a frame is added to the group </td><td>   - <code>frame &lt;jplex.components.Frame&gt;</code>  the window that has been added <br />  </td></tr>
</table>



<h2>Methods</h2>
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Signature</b> </td><td> <b>Return Type</b> </td><td> <b>Description</b> </td></tr>
<tr><td> <code>add(Id)</code> </td><td> <code>jplex.components.Frame</code> </td><td> Add a new frame to the frame set. You can either supply a string to create<br>
a new component or an existing Frame component.<br>
The 'new' frame is extended and receives a new method (<code>toFront</code>) to handle<br>
the relative positioning between the frames of the set.<br />  - <code>Id &lt;jplex.components.Frame|String&gt;</code> of the new window to create,<br />or Frame component to be added to the frame set.<br /></td></tr>

</table>
<h3>Inherited Methods</h3>

<ul><li><a href='APIPangolincommonComponent.md'>jplex.common.Component</a>:  <code>$C</code>,  <code>cfg</code>,  <code>fireEvent</code>,  <code>getEvent</code>,  <code>lang</code>,  <code>locale</code>,  <code>setCfg</code>,  <code>setEvent</code>,  <code>unregister</code>,