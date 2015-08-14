# Class **jplex.components.Tooltip**  _extends [jplex.common.Component](APIPangolincommonComponent.md)_ #

## Description ##
Tooltip component

This simple component is commonly used to create <em>help</em> tips on a page.

## Config Table ##
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Name</b> </td><td> <b>Default Value</b> </td><td> <b>Description</b> </td></tr>
<tr><td> <i>content</i> </td><td> <code>""</code> </td><td>  Inner text of the bubble. You can put HTML code if you want </td></tr>
<tr><td> <i>position</i> </td><td> <code>"top-right"</code> </td><td>  Sets the position of the bubble relative to the source component. This parameter must be expressed<br>
as a join of two strings. The first one is the vertical align (<code>top</code> or <code>bottom</code>) and the second is<br>
the horizontal align (<code>left</code> or <code>right</code>) </td></tr>
<tr><td> <i>positionRatio</i> </td><td> <code>0.83</code> </td><td>  Sets the position of the bubble compared to the element. This ratio is the x-position of the pin related<br>
to the beginning (or end) of the element divided by the width of the element </td></tr>
<tr><td> <i>shadowWidth</i> </td><td> <code>1</code> </td><td>  The bubble has a <code>div</code> shadow, with this little parameter you can configure how to render it </td></tr>
<tr><td> <i>source</i> </td><td> <code>&lt;component ID&gt;-source</code> </td><td>  The HTML Element that will be the source of the tooltip. Basically, when the mouse enters<br>
this element, the tooltip is shown.<br>
If no <code>source</code> is given, the tooltip is associated with the element that has the following ID:<br>
<code>&lt;the tooltip ID&gt;-source</code>. If not present, <code>document.body</code> is used. </td></tr>
<tr><td> <i>trigger</i> </td><td> <code>Tooltip.TRIGGER_MOUSEOVER</code> </td><td>  Sets the trigger type to show/hide the bubble. The three types of triggers are defined in the static<br>
properties </td></tr>
<tr><td> <i>zIndex</i> </td><td> <code>99</code> </td><td>  Sets the zIndex of the bubble </td></tr>
</table>

## Event Table ##
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Name</b> </td><td> <b>Description</b> </td><td> <b>Parameters</b> </td></tr>
<tr><td> <i>onHideEvent</i> </td><td>  Fired after hiding the component </td><td>  </td></tr>
<tr><td> <i>onShowEvent</i> </td><td>  Fired after showing the component </td><td>  </td></tr>
</table>


## Properties ##
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Name</b> </td><td> <b>Type</b> </td><td> <b>Description</b> </td></tr>
<tr><td> <i>TRIGGER_CLICK</i> </td><td> <code>String</code> </td><td> <code>static  </code>  The bubble will be shown if the user clicks on the element</td></tr>
<tr><td> <i>TRIGGER_CUSTOM</i> </td><td> <code>String</code> </td><td> <code>static  </code>  The bubble will not be shown by an event, the user must directly call <code>show</code>/<code>hide</code> functions</td></tr>
<tr><td> <i>TRIGGER_MOUSEOVER</i> </td><td> <code>String</code> </td><td> <code>static  </code>  The bubble will be shown if the element is hovered by the mouse</td></tr>

</table>



## Methods ##
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Signature</b> </td><td> <b>Return Type</b> </td><td> <b>Description</b> </td></tr>
<tr><td> <code>getBody()</code> </td><td> <code>Element</code> </td><td> Get the body <code>div</code> HTML element of the tooltip (content placeholder)<br /> </td></tr>
<tr><td> <code>getSource()</code> </td><td> <code>Element</code> </td><td> Get the source HTML Element that triggers the tooltip<br /> </td></tr>
<tr><td> <code>hide()</code> </td><td> <code>void</code> </td><td> Hides the bubble<br /> </td></tr>
<tr><td> <code>render()</code> </td><td> <code>void</code> </td><td> Render the bubble and hide it<br /> </td></tr>
<tr><td> <code>setContent(newContent)</code> </td><td> <code>void</code> </td><td> Set the content of the tooltip (Support HTML content)<br />  - <code>newContent &lt;object&gt;</code> Raw text or HTML content<br /></td></tr>
<tr><td> <code>setPosition(top, left)</code> </td><td> <code>void</code> </td><td> Set the absolute position of the tooltip on the viewport<br />  - <code>top &lt;object&gt;</code> top offset in pixels (relative to the viewport)<br /> - <code>left &lt;object&gt;</code> left offset in pixels (relative to the viewport)<br /></td></tr>
<tr><td> <code>show()</code> </td><td> <code>void</code> </td><td> Shows the bubble<br /> </td></tr>

</table>
### Inherited Methods ###

  * [jplex.common.Component](APIPangolincommonComponent.md):  `$C`,  `cfg`,  `fireEvent`,  `getEvent`,  `lang`,  `locale`,  `setCfg`,  `setEvent`,  `unregister`,