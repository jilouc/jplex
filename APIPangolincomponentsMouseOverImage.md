# Class **jplex.components.MouseOverImage**  _extends [jplex.common.Component](APIPangolincommonComponent.md)_ #

## Description ##
This component is a little utility that adds a simple image in a container that appears only on mouse over.
It is useful in cases of optional actions that spams the render if they are all visible.

There are two rendering methods for this component. Both have advantages and drawbacks:
<ul>
<li>float:    Use of the css float property to display the image. The component accepts only two positions 'left'<br>
and 'right'. </li>
<li>absolute: Use of the css position absolute property. Can take all position wanted but can not accepts<br>
multiples components on one single container</li>
</ul>

## Config Table ##
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Name</b> </td><td> <b>Default Value</b> </td><td> <b>Description</b> </td></tr>
<tr><td> <i>img</i> </td><td> <code>false</code> </td><td>  Indicates the url of the image to show (must be defined if style is not) </td></tr>
<tr><td> <i>method</i> </td><td> <code>"absolute"</code> </td><td>  See before... </td></tr>
<tr><td> <i>onClickEvent</i> </td><td> <code>false</code> </td><td>  Binds the click event on the image. </td></tr>
<tr><td> <i>padding</i> </td><td> <code>4</code> </td><td>  Number of pixels to escape from the border </td></tr>
<tr><td> <i>position</i> </td><td> <code>"top-right"</code> </td><td>  Defines the position of the image.<br>
The different positions can be set with bottom, top, center and left, right.<br>
You can do combination with a caret '-', like 'bottom-left'. </td></tr>
<tr><td> <i>style</i> </td><td> <code>false</code> </td><td>  Indicates the css style to use (must be defined if img is not) </td></tr>
</table>




## Methods ##
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Signature</b> </td><td> <b>Return Type</b> </td><td> <b>Description</b> </td></tr>
<tr><td> <code>setPosition()</code> </td><td> <code>void</code> </td><td> Sets the right absolute position of the image.<br>
Needs to be called if the top/left/width/height css property is changed<br /> </td></tr>

</table>
### Inherited Methods ###

  * [jplex.common.Component](APIPangolincommonComponent.md):  `$C`,  `cfg`,  `fireEvent`,  `getEvent`,  `lang`,  `locale`,  `setCfg`,  `setEvent`,  `unregister`,