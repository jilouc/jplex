# Class **jplex.xprototype.Date** #

## Description ##
jPlex's XPrototype extended Date




## Properties ##
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Name</b> </td><td> <b>Type</b> </td><td> <b>Description</b> </td></tr>
<tr><td> <i>YEAR_OFFSET</i> </td><td> <code>Integer</code> </td><td> <code>static  </code>  Offset to get real year since IE, Opera and Firefox<br>
return different result for Date.getYear</td></tr>

</table>



## Methods ##
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Signature</b> </td><td> <b>Return Type</b> </td><td> <b>Description</b> </td></tr>
<tr><td> <code>compareTo(date)</code> </td><td> <code>Integer</code> </td><td> Compare the date with a given date<br />  - <code>date &lt;Date&gt;</code> to compare<br /></td></tr>
<tr><td> <code>firstDayOfMonth()</code> </td><td> <code>void</code> </td><td> Get the first day of the month<br /> </td></tr>
<tr><td> <code>format(pattern)</code> </td><td> <code>void</code> </td><td> Formats a date to its representing string, given a pattern<br>
using the following symbols map (same syntax as PHP 'date' function)<br />  - <code>pattern &lt;String&gt;</code> to format the string :<br />  d : day in month (with padding 0)<br />  D : day in week (3 letters (en))<br />  j : day in month (without padding 0)<br />  l : full day (letters (en))<br />  N : ISO day of the week (1 to 7)<br />  S : ordinal suffix for the day (st, nd, rd or th)<br />  w : day of the week (0 (sun) to 6 (sat))<br />  z : day in year<br />  W : week of the year (1 to 52)<br />  F : full month (letters (en))<br />  m : month number (padded with 0)<br />  M : month (3 letters (en))<br />  n : month number (without 0)<br />  t : number of days during month<br />  L : leap year or not (1 or 0)<br />  o : <br />  Y : full year (4 digits)<br />  y : year (2 digits)<br />  a : am or pm<br />  A : AM or PM<br />  B : Internet time (swatch, 0 to 999)<br />  g : Hour 1-12 (without 0)<br />  G : Hour 0-23 (without 0)<br />  h : Hour 01-12 (padded with 0)<br />  H : Hour 00-23 (padded with 0)<br />  i : Minutes 00-59 (padded with 0)<br />  s : Seconds 00-59 (padded with 0)<br />  u : Microseconds<br />  e :<br />  I :<br />  P :<br />  T :<br />  Z :<br /></td></tr>
<tr><td> <code>getMonthLength()</code> </td><td> <code>Integer</code> </td><td> Get the number of days in the current month<br /> </td></tr>
<tr><td> <code>isLeapYear()</code> </td><td> <code>Boolean</code> </td><td> Checks whether this is a leap year or not<br /> </td></tr>
<tr><td> <code>lastDayOfMonth()</code> </td><td> <code>void</code> </td><td> Get the last day of the month<br /> </td></tr>
<tr><td> <code>locale(field)</code> </td><td> <code>void</code> </td><td> Get a locale field content<br />  - <code>field &lt;String&gt;</code> Name of the field<br /></td></tr>
<tr><td> <code>setNextDay()</code> </td><td> <code>void</code> </td><td> Set the current date to the next day<br /> </td></tr>
<tr><td> <code>setPreviousDay()</code> </td><td> <code>void</code> </td><td> Set the current date to the previous day<br /> </td></tr>

</table>