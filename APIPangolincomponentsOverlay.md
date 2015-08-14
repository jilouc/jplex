# Class **jplex.components.Overlay**  _extends [jplex.common.Component](APIPangolincommonComponent.md)_ #

## Description ##
Overlay component.
Place a semi-transparent layer which covers the source element on the page.
If no source is given, the overlay covers the entire body of the page.
It's mainly used by the Modal Frame component.

## Config Table ##
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Name</b> </td><td> <b>Default Value</b> </td><td> <b>Description</b> </td></tr>
<tr><td> <i>color</i> </td><td> <code>"#000000" (black)</code> </td><td>  Color of the overlay </td></tr>
<tr><td> <i>fade</i> </td><td> <code>false</code> </td><td>  If <code>true</code> the overlay will be shown/hidden using fade in/out </td></tr>
<tr><td> <i>opacity</i> </td><td> <code>0.75</code> </td><td>  Opacity of the overlay </td></tr>
<tr><td> <i>source</i> </td><td> <code>document.body</code> </td><td>  Element which will be covered by the overlay </td></tr>
<tr><td> <i>z</i> </td><td> <code>1</code> </td><td>  z-index for the overlay </td></tr>
</table>

## Event Table ##
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Name</b> </td><td> <b>Description</b> </td><td> <b>Parameters</b> </td></tr>
<tr><td> <i>afterRenderElement</i> </td><td>  Fired after the rendering of the overlay </td><td>  </td></tr>
<tr><td> <i>beforeRenderEvent</i> </td><td>  Fired before the rendering of the overlay </td><td>  </td></tr>
<tr><td> <i>onHideEvent</i> </td><td>  Fired after the overlay is hidden </td><td>  </td></tr>
<tr><td> <i>onShowEvent</i> </td><td>  Fired after the overlay is shown </td><td>  </td></tr>
</table>



## Methods ##
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Signature</b> </td><td> <b>Return Type</b> </td><td> <b>Description</b> </td></tr>
<tr><td> <code>hide()</code> </td><td> <code>void</code> </td><td> Hide the overlay<br /> </td></tr>
<tr><td> <code>render()</code> </td><td> <code>void</code> </td><td> Renders the overlay<br /> </td></tr>
<tr><td> <code>show()</code> </td><td> <code>void</code> </td><td> Show the overlay<br /> </td></tr>

</table>
### Inherited Methods ###

  * [jplex.common.Component](APIPangolincommonComponent.md):  `$C`,  `cfg`,  `fireEvent`,  `getEvent`,  `lang`,  `locale`,  `setCfg`,  `setEvent`,  `unregister`,