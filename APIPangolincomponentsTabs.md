# Class **jplex.components.Tabs**  _extends [jplex.common.Component](APIPangolincommonComponent.md)_ #

## Description ##
Tabs component, creates a neat tab bar in a <em>ul</em> container. This bar controls the display of
<em>div</em>s. There is two methods, a classical one with many <em>div</em>s that are managed by show/hide methods.
Or another one by getting the content via Ajax and display it on a single <em>div</em>.

The content has the following form:
```
[
  {title: 'First test', content:'test1'}, // test1 is a div id
  {title: 'Second test', content:'test2'} // test2 is a div id
]
```

## Config Table ##
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Name</b> </td><td> <b>Default Value</b> </td><td> <b>Description</b> </td></tr>
<tr><td> <i>activeTab</i> </td><td> <code>0</code> </td><td>  Default active tab index (first = 0) </td></tr>
<tr><td> <i>ajaxDiv</i> </td><td> <code>false</code> </td><td>  <em>Require 'ajax' method. </em><strong>Mandatory.</strong>  Container to display the content </td></tr>
<tr><td> <i>ajaxMethod</i> </td><td> <code>"get"</code> </td><td>  <em>Require 'ajax' method.</em> HTTP method to use for Ajax Requests </td></tr>
<tr><td> <i>ajaxReload</i> </td><td> <code>false</code> </td><td>  <em>Require 'ajax' method.</em> If false, the content of each tabs is cached and will not be<br>
requested again. Else for each tab switch, you will do a request </td></tr>
<tr><td> <i>data</i> </td><td> <code>null</code> </td><td>  <strong>Mandatory.</strong> Describes the tab structure. It is a array of objects that have only two<br>
fields, <code>title</code>: which is the title to put in the tab bar and <code>content</code> which is a div<br>
id if the method is the div one, or a url if it's the other. </td></tr>
<tr><td> <i>method</i> </td><td> <code>"div"</code> </td><td>  'div' indicates the classical method, 'ajax' indicates the other (see bellow) </td></tr>
<tr><td> <i>style</i> </td><td> <code>"jplex-tabs"</code> </td><td>  Default style to apply to the <code>ul</code> markup </td></tr>
</table>

## Event Table ##
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Name</b> </td><td> <b>Description</b> </td><td> <b>Parameters</b> </td></tr>
<tr><td> <i>onSwitchEvent</i> </td><td>  Well named event which is triggered after the tab switch </td><td>   - <code>oldContent &lt;Array&gt;</code>  The content field from <em>data</em> that corresponds to the tab the user just quitted <br /> - <code>newContent &lt;Array&gt;</code>  The content field from <em>data</em> that corresponds to the tab the user just selected <br />  </td></tr>
</table>


## Properties ##
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Name</b> </td><td> <b>Type</b> </td><td> <b>Description</b> </td></tr>
<tr><td> <i>cache</i> </td><td> <code>Array&lt;String&gt;</code> </td><td> <code>private  </code>  The cache stores each tabs's innerHTML when ajaxReload is false</td></tr>

</table>



## Methods ##
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Signature</b> </td><td> <b>Return Type</b> </td><td> <b>Description</b> </td></tr>
<tr><td> <code>getActiveTab()</code> </td><td> <code>int</code> </td><td> Returns the current active tab<br /> </td></tr>
<tr><td> <code>handleAjaxMethod(newUrl, oldUrl)</code> </td><td> <code>void</code> </td><td> Sub handler for Ajax Method. Depending of the config <code>ajaxReload</code> an AJAX request should be launched<br />  - <code>newUrl &lt;String&gt;</code> <code>URL</code> of the new content<br /> - <code>oldUrl &lt;String&gt;</code> <code>URL</code> of the old content<br /></td></tr>
<tr><td> <code>handleDivMethod(newTab, oldTab)</code> </td><td> <code>void</code> </td><td> Sub handler for Div Method<br />  - <code>newTab &lt;String&gt;</code> <code>id</code> of the new tab<br /> - <code>oldTab &lt;String&gt;</code> <code>id</code> of the old tab<br /></td></tr>
<tr><td> <code>handler(newTab, li)</code> </td><td> <code>void</code> </td><td> Switch handler<br />  - <code>newTab &lt;object&gt;</code> New definition object<br /> - <code>li &lt;object&gt;</code> <code>li</code> markup where it has been clicked<br /></td></tr>
<tr><td> <code>initAjaxMethod(definition, activeTab)</code> </td><td> <code>void</code> </td><td> Initialize the Ajax Method: redirect to <code>handleAjaxMethod</code><br />  - <code>definition &lt;Array&gt;</code> Same form as <code>data</code> from config<br /> - <code>activeTab &lt;int&gt;</code> The tab to show<br /></td></tr>
<tr><td> <code>initDivMethod(definition, activeTab)</code> </td><td> <code>void</code> </td><td> Initialize the Div Method : hide the right divs, and show the <code>activeTab</code>th one<br />  - <code>definition &lt;Array&gt;</code> Same form as <code>data</code> from config<br /> - <code>activeTab &lt;int&gt;</code> The tab to show<br /></td></tr>

</table>
### Inherited Methods ###

  * [jplex.common.Component](APIPangolincommonComponent.md):  `$C`,  `cfg`,  `fireEvent`,  `getEvent`,  `lang`,  `locale`,  `setCfg`,  `setEvent`,  `unregister`,