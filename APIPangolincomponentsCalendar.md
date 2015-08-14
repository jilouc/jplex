# Class **jplex.components.Calendar**  _extends [jplex.common.Component](APIPangolincommonComponent.md)_ #

## Description ##
Calendar component class.
Create a browsable calendar from a text field, a button or directly on the page.

<strong>Main features</strong>:
<ul>
<li>Link the calendar to a simple text input (appears on focus), to a button (appears on click)<br>
and a text field. You could also use whichever control you want and specify the behavior with custom events.</li>
<li>Browse the calendar by month or using the 'fast browse'</li>
<li>Key shortcuts enabled: move the focused date using arrow keys or to<br>
the previous/next month using PageDown/PageUp</li>
<li>Restrict the date to a chosen interval if you want</li>
<li>Custom events are fired at given steps of the component lifecycle (show/hide/select)</li>
<li>Use fade in/out from Script.aculo.us if you want so</li>
</ul>

## Config Table ##
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Name</b> </td><td> <b>Default Value</b> </td><td> <b>Description</b> </td></tr>
<tr><td> <i>date</i> </td><td> <code>new Date()</code> </td><td>  The default date to select </td></tr>
<tr><td> <i>dateFormat</i> </td><td> <code>"d-m-Y"</code> </td><td>  Pattern to format the output string of the calendar<br>
(e.g. the value of the linked text input field). To know<br>
more about pattern tokens, see jPlex.xprototype.Date#format </td></tr>
<tr><td> <i>fade</i> </td><td> <code>0.3</code> </td><td>  Time in seconds to show/hide the popup calendar.<br>
Set to 0 or <code>false</code> to disable fade in/out. </td></tr>
<tr><td> <i>fastBrowse</i> </td><td> <code>true</code> </td><td>  If set to <code>true</code>, a click on the title of the calendar (month or year)<br>
will pop up a tooltip allowing the user to set a value for the month<br>
(or the year) using combo-boxes </td></tr>
<tr><td> <i>fastBrowseYearEnd</i> </td><td> <code>The current year + 5</code> </td><td>  Maximum year in the combobx for fast browse </td></tr>
<tr><td> <i>fastBrowseYearStart</i> </td><td> <code>The current year - 5</code> </td><td>  Minimum year in the combobox for fast browse </td></tr>
<tr><td> <i>maxDate</i> </td><td> <code>false</code> </td><td>  All dates that are above this one are not allowed </td></tr>
<tr><td> <i>minDate</i> </td><td> <code>false</code> </td><td>  All dates that are bellow this one are not allowed </td></tr>
<tr><td> <i>source</i> </td><td> <code>null</code> </td><td>  The event source, can be a textfield or a button for example<br>
The source element for the calendar. Use one of the following configuration:<br>
<ul>
<li><code>textField = null, source = a text field</code>: links the calendar to a single text field</li>
<li><code>textField = a text field, source = a button</code>: links the calendar to a button, the result<br>
will be printed in the textfield</li>
<li><code>textField = null, source = a button</code>: links the calendar to a button, use the custom event<br>
onSelectEvent to catch the selected date and do what you want with it</li>
<li><code>textField = null, source = null</code>: just show a calendar without show/hide things</li>
</ul> </td></tr>
<tr><td> <i>textField</i> </td><td> <code>null</code> </td><td>  The textfield linked with the calendar (edited when a new date is selected)<br>
(see the <code>source</code> configuration parameter for more details) </td></tr>
<tr><td> <i>titleFormat</i> </td><td> <code>"{M} {Y}"</code> </td><td>  Template for the title of the calendar. You can use 3 tokens:<br>
<ul><li>{M} the month full name</li>
<li>{m} month number</li>
<li>{Y} year with 4 digits</li></ul> </td></tr>
<tr><td> <i>zBase</i> </td><td> <code>11000</code> </td><td>  zIndex base </td></tr>
</table>

## Event Table ##
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Name</b> </td><td> <b>Description</b> </td><td> <b>Parameters</b> </td></tr>
<tr><td> <i>onHideEvent</i> </td><td>  When the calendar disappears (textfield losing focus, new date selected for instance) </td><td>  </td></tr>
<tr><td> <i>onPositionChangeEvent</i> </td><td>  Called each time the position of the calendar is re-computed </td><td>   - <code>position &lt;Object&gt;</code>  The computed position (position.top and position.left) <br /> - <code>dimensions &lt;Object&gt;</code>  Dimensions of the calendar container (width and height) <br />  </td></tr>
<tr><td> <i>onSelectEvent</i> </td><td>  When a new date is selected </td><td>   - <code>date &lt;Date&gt;</code>  The selected date <br />  </td></tr>
<tr><td> <i>onShowEvent</i> </td><td>  When the calendar appears (textfield receiving focus for instance) </td><td>  </td></tr>
</table>



## Methods ##
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Signature</b> </td><td> <b>Return Type</b> </td><td> <b>Description</b> </td></tr>
<tr><td> <code>down()</code> </td><td> <code>void</code> </td><td> Navigate down in the current month, from the currently focused day.<br /> </td></tr>
<tr><td> <code>getFocusedItem()</code> </td><td> <code>Calendar.CalendarItem</code> </td><td> Get the currently focused item of the calendar<br /> </td></tr>
<tr><td> <code>getFormattedValue(format)</code> </td><td> <code>void</code> </td><td> Get the current date string representation, formatted with the given<br>
pattern. If no pattern is given, uses the "dateFormat" configuration parameter.<br />  - <code>format &lt;object&gt;</code><br /></td></tr>
<tr><td> <code>getSelectedItem()</code> </td><td> <code>Calendar.CalendarItem</code> </td><td> Get the currently selected item of the calendar<br /> </td></tr>
<tr><td> <code>getTextField()</code> </td><td> <code>Element</code> </td><td> Get the targetted text field of the calendar (null if not set)<br /> </td></tr>
<tr><td> <code>goTo(month, year)</code> </td><td> <code>void</code> </td><td> Change the page of the calendar to the specified month and year<br />  - <code>month &lt;Integer&gt;</code> New month (optional)<br /> - <code>year &lt;Integer&gt;</code> New year (optional)<br /></td></tr>
<tr><td> <code>hide()</code> </td><td> <code>void</code> </td><td> Makes the calendar disappear, with a fade out effect if configured so<br /> </td></tr>
<tr><td> <code>left()</code> </td><td> <code>void</code> </td><td> Navigate to the left in the current month, from the currently focused day.<br /> </td></tr>
<tr><td> <code>next()</code> </td><td> <code>void</code> </td><td> Go to the next month<br /> </td></tr>
<tr><td> <code>previous()</code> </td><td> <code>void</code> </td><td> Go to the previous month<br /> </td></tr>
<tr><td> <code>render()</code> </td><td> <code>void</code> </td><td> Render the calendar for the current month<br /> </td></tr>
<tr><td> <code>right()</code> </td><td> <code>void</code> </td><td> Navigate to the right in the current month, from the currently focused day.<br /> </td></tr>
<tr><td> <code>select(index)</code> </td><td> <code>void</code> </td><td> Explicitly selects the index'th cell in the calendar<br />  - <code>index &lt;Integer&gt;</code> Index of the cell to select (0 to oItems.length)<br /></td></tr>
<tr><td> <code>setFocusedItem(oItem)</code> </td><td> <code>void</code> </td><td> Sets the current focused item of the calendar (the one that would be selected)<br />  - <code>oItem &lt;Calendar.CalendarItem&gt;</code> calendar item to be marked as focused<br /></td></tr>
<tr><td> <code>setSelectedItem(oItem)</code> </td><td> <code>void</code> </td><td> Sets the current selected item of the calendar<br />  - <code>oItem &lt;Calendar.CalendarItem&gt;</code> calendar item to be marked as selected<br /></td></tr>
<tr><td> <code>show()</code> </td><td> <code>void</code> </td><td> Makes the calendar container appear, with a fade in effect if configured so<br /> </td></tr>
<tr><td> <code>up()</code> </td><td> <code>void</code> </td><td> Navigate up in the current month, from the currently focused day.<br /> </td></tr>

</table>
### Inherited Methods ###

  * [jplex.common.Component](APIPangolincommonComponent.md):  `$C`,  `cfg`,  `fireEvent`,  `getEvent`,  `lang`,  `locale`,  `setCfg`,  `setEvent`,  `unregister`,