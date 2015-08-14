# `static` Class **jplex.components.calendar.CalendarItem** #

## Description ##
Item representing one cell of the calendar (i.e. one day)
Store the corresponding HTML element and date and handle focus and select events.






## Methods ##
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Signature</b> </td><td> <b>Return Type</b> </td><td> <b>Description</b> </td></tr>
<tr><td> <code>check()</code> </td><td> <code>bool</code> </td><td> Check whether the date of the item match a valid date or not<br>
(regarding to the valid range set in the calendar configuration)<br /> </td></tr>
<tr><td> <code>focus()</code> </td><td> <code>void</code> </td><td> Set the focus on the item<br /> </td></tr>
<tr><td> <code>getCell()</code> </td><td> <code>Element</code> </td><td> Get the cell (td) element representing the item<br /> </td></tr>
<tr><td> <code>getDate()</code> </td><td> <code>Date</code> </td><td> Get the date of the item<br /> </td></tr>
<tr><td> <code>getIndex()</code> </td><td> <code>Integer</code> </td><td> Get the index of the item in the table<br /> </td></tr>
<tr><td> <code>select(e, click)</code> </td><td> <code>void</code> </td><td> Selects the date corresponding to the item<br />  - <code>e &lt;Event&gt;</code><br /> - <code>click &lt;bool&gt;</code> true if the selection results from a click on the cell<br /></td></tr>

</table>