<extends path="main.tpl"/>

<block name="title">jPlex Date Picker</block>
<block name="css">datepicker.css</block>
<block name="datepicker_menu">
    <include path="tpl/menu.tpl"/>
</block>
<block name="overview">
    jPlex Calendar / DatePicker provides a simple date picker. Its main features are:
    <ul class="main">
        <li>Link it with any text field / button or simply add it statically to the page</li>
        <li>Browse the dates and the month using arrow keys</li>
        <li>Go straight to the desired month/year using the fast browse feature</li>
        <li>Allows single selection and multiple selections</li>
        <li>Fires custom events at key moments of the component life (selection, rendering, browse...)</li>
        <li>Fully customizable CSS</li>
        <li>Handles any date format thanks to jPlex XPrototype's <code>Date#format</code></li>
        <li>Other configuration options <em>(localization)</em></li>
    </ul>
</block>
<block name="usage">
    The first step basically consists in including the component. It is easy thanks to the embedded packaging system:
    <pre><code class="javascript">
        jPlex.include('jplex.components.Calendar');
    </code></pre>
    Then it's easy to create a new calendar:
    <pre><code class="javascript">
        var myCal = new Calendar('myCal', config);
    </code></pre>
    where <code class="javascript">config</code> is an object listing all configuration properties of your calendar.
    Below is the list of configuration parameters available:<br/><br/>

    <div class="expand-config">Click here to expand configuration properties.</div>
    <div class="compact-config" style="display:none;">Click here to reduce configuration properties.</div>
    <table class="config" cellpadding="0" cellspacing="0">
        <thead>
        <tr>
            <th>Name</th>
            <th>Default value</th>
            <th>Details</th>
        </tr>
        </thead>
        <tbody style="display:none">
        <tr>
            <td class="param">date</td>
            <td><code class="javascript">new Date()</code></td>
            <td>The default date to select</td>
        </tr>
        <tr>
            <td class="param">minDate</td>
            <td><code class="javascript">false</code></td>
            <td>All dates that are below this one are not allowed</td>
        </tr>
        <tr>
            <td class="param">maxDate</td>
            <td><code class="javascript">false</code></td>
            <td>All dates that are above this one are not allowed</td>
        </tr>
        <tr>
            <td class="param">dateFormat</td>
            <td><code class="javascript">"d-m-Y"</code></td>
            <td>Pattern to format the output string of the calendar (see <code>jPlex.xprototype.Date#format</code> for
                more details)
            </td>
        </tr>
        <tr>
            <td class="param">titleFormat</td>
            <td><code class="javascript">"{M} {Y}"</code></td>
            <td>Template for the title of the calendar. You can use 3 tokens:
                <code>{M}</code> the month full name, <code>{m}</code> month number, <code>{Y}</code> year with 4 digits
            </td>
        </tr>
        <tr>
            <td class="param">fade</td>
            <td><code class="javascript">0.3</code></td>
            <td>Time in seconds to show/hide the popup calendar. <code>0</code> or <code>false</code> to disable fade
                in/out.
            </td>
        </tr>
        <tr>
            <td class="param">textField</td>
            <td><code class="javascript">null</code></td>
            <td>The textfield linked with the calendar (edited when a new date is selected). See the <code>source</code>
                configuration parameter for more details.
            </td>
        </tr>
        <tr>
            <td class="param">source</td>
            <td><code class="javascript">null</code></td>
            <td>The source element for the calendar. Use one of the following configuration:
                <ul>
                    <li><code>textField = null, source = a text field</code>: links the calendar to a single text field
                    </li>
                    <li><code>textField = a text field, source = a butto</code>`: links the calendar to a button, the
                        result will be printed in the textfield
                    </li>
                    <li><code>textField = null, source = a button</code>: links the calendar to a button, use the custom
                        event <code>onSelectEvent</code> to catch the selected date and do what you want with it
                    </li>
                    <li><code>textField = null, source = null</code>: just show a calendar without show/hide things</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td class="param">fastBrowse</td>
            <td><code class="javascript">true</code></td>
            <td>If set to <code>true</code>, a click on the title of the calendar (month or year) will pop up a tooltip
                allowing the user to set a value for the month
            </td>
        </tr>
        <tr>
            <td class="param">fastBrowseYearStart</td>
            <td><code class="javascript">(new Date()).getFullYear() - 5</code></td>
            <td>Minimum year in the combobox for fast browse</td>
        </tr>
        <tr>
            <td class="param">fastBrowseYearEnd</td>
            <td><code class="javascript">(new Date()).getFullYear() + 5</code></td>
            <td>Maximum year in the combobx for fast browse</td>
        </tr>
        <tr>
            <td class="param">zBase</td>
            <td><code class="javascript">11000</code></td>
            <td>The z-index base for the calendar. Adjust the value if some of your elements have z-index interaction
                with the date picker.
            </td>
        </tr>
        <tr>
            <td class="param">multiselect</td>
            <td><code class="javascript">false</code></td>
            <td>Allow multiple selections within the calendar. If set to <code>true</code>, the associated form control
                is not automatically updated when a date is selected. You have to use the <code>onSelectEvent</code> to
                do what you want.
            </td>
        </tr>
        <tr>
            <td class="param">startWeekOn</td>
            <td><code class="javascript">Calendar.START_SUNDAY</code></td>
            <td>Give the starting day of the week (Calendar.START_MONDAY or Calendar.START_SUNDAY)</td>
        </tr>
        </tbody>
    </table>
    <div class="compact-config" style="display:none;">Click here to reduce configuration properties.</div>
</block>

<block name="examples">
    <ol id="examples">
        <li>DatePicker from a text field</li>
        <div class="example" id="ex1">
            HTML code of the example : <pre><code class="html">&lt;input type="text" id="example-1-tf"/&gt;</code></pre>
            Javascript code is really simple:
            <pre><code class="javascript">
new Calendar('example-1', {
    source:'example-1-tf'
});
            </code></pre>
            <input type="text" id="example-1-tf"/> <span class="info">(Try the Arrow Keys and Page Up/Page Down to browse dates)</span>
        </div>
        <li>DatePicker from a button. Value linked to a text field. French localization</li>
        <div class="example" id="ex2">
            HTML code of the example :
            <pre><code class="html">
&lt;input type="text" id="example-2-tf"/&gt;
&lt;input type="button" id="example-2-bt"/&gt;
            </code></pre>
            This date picker will have French localization and weeks starting on Monday.
            <pre><code class="javascript">
new Calendar('example-2', {
    source: 'example-2-bt',
    textField: 'example-2-tf',
    lang: 'fr',
    startWeekOn: Calendar.START_MONDAY
});
            </code></pre>
            <input type="text" id="example-2-tf"/>
            <input type="button" id="example-2-bt"/>
        </div>
        <li>DatePicker from a button. Use of custom event to update form values</li>
        <div class="example" id="ex3">
            HTML code of the example :
            <pre><code class="html">
&lt;select id="ex3-day"&gt;
    &lt;option value="01"&gt;01&lt;/option&gt;
    ...
&lt;/select&gt;
&lt;select id="ex3-month"&gt;
    &lt;option value="01"&gt;01&lt;/option&gt;
    ...
&lt;/select&gt;
&lt;input type="text" maxlength="4" readonly="true" id="ex3-year" size="4" /&gt;
&lt;input type="button" id="example-3-bt"/&gt;
            </code></pre>
            We use the custom event <code>onSelectEvent</code> to catch the value of the
            selected date and update the value of the combo-boxes and textfield.
            <pre><code class="javascript">
var customSelect = function(o) {
    $('ex3-day').value = o.date.format('d');
    $('ex3-month').value = o.date.format('m');
    $('ex3-year').value = o.date.format('Y');
};
new Calendar('example-3', {
    source: 'example-3-bt',
    events: {
        onSelectEvent: customSelect
    }
});
            </code></pre>
            <select id="ex3-day">
                <option value="01">01</option>
                <option value="02">02</option>
                <option value="03">03</option>
                <option value="04">04</option>
                <option value="05">05</option>

                <option value="06">06</option>
                <option value="07">07</option>
                <option value="08">08</option>
                <option value="09">09</option>
                <option value="10">10</option>
                <option value="11">11</option>

                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
                <option value="16">16</option>
                <option value="17">17</option>

                <option value="18">18</option>
                <option value="19">19</option>
                <option value="20">20</option>
                <option value="21">21</option>
                <option value="22">22</option>
                <option value="23">23</option>

                <option value="24">24</option>
                <option value="25">25</option>
                <option value="26">26</option>
                <option value="27">27</option>
                <option value="28">28</option>
                <option value="29">29</option>

                <option value="30">30</option>
                <option value="31">31</option>
            </select>
            <select id="ex3-month">
                <option value="01">01</option>
                <option value="02">02</option>
                <option value="03">03</option>

                <option value="04">04</option>
                <option value="05">05</option>
                <option value="06">06</option>
                <option value="07">07</option>
                <option value="08">08</option>
                <option value="09">09</option>

                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
            </select>
            <input type="text" maxlength="4" readonly="true" id="ex3-year" size="4" />
            <input type="button" id="example-3-bt"/>
        </div>
        <li>Static DatePicker on the page</li>
        <div class="example" id="ex4">
            HTML code of the example :
            <pre><code class="html">
&lt;div id="example-4"/&gt;
            </code></pre>
            Javascript code is really simple:
            <pre><code class="javascript">
new Calendar('example-4');
            </code></pre>
            <div id="example-4" style="float:left;"></div>
            <div style="clear:both;">&nbsp;</div>
            
        </div>
        <li>DatePicker with multiple selection enabled</li>
        <div class="example" id="ex5">
            HTML code of the example : <pre><code class="html">&lt;input type="text" id="example-1-tf"/&gt;</code></pre>
            Again, we use the <code>onSelectEvent</code> custom event to catch the selected dates. The object parameter
            receives a <code>selected</code> field: it's an array containing all selected dates.
            <pre><code class="javascript">
var multiSelect = function(o) {
    $('example-5-values').update(
        '&lt;li&gt;'+o.selected.invoke('format', 'Y/m/d').join('&lt;/li&gt;&lt;li&gt;')+'&lt;/li&gt;'
    );
};

new Calendar('example-5', {
    source: 'example-5-bt',
    dateFormat: 'Y/m/d',
    multiselect: true,
    events: {
        onSelectEvent: multiSelect
    }
});
            </code></pre>
            <input type="button" id="example-5-bt"/>
            <div style="margin-left:250px;">Selected values:</div>
            <ul id="example-5-values" style="margin-left:250px;"></ul>


        </div>
    </ol>


</block>

<block name="js">
    jPlex.include('jplex.components.Calendar');

    var runners = [
        function() {
            new Calendar('example-1', {source:'example-1-tf'});
        },

        function() {
            new Calendar('example-2', {source:'example-2-bt', textField:'example-2-tf', lang:'fr', startWeekOn:Calendar.START_MONDAY});
        },
        function() {
            var customSelect = function(o) {
                $('ex3-day').value = o.date.format('d');
                $('ex3-month').value = o.date.format('m');
                $('ex3-year').value = o.date.format('Y');
            };
            new Calendar('example-3', {source:'example-3-bt', events:{onSelectEvent:customSelect}});
        },
        function() {
            new Calendar('example-4');
        },
        function() {
            var multiSelect = function(o) {
                $('example-5-values').update(
                    '<li>'+o.selected.invoke('format', 'Y/m/d').join('</li><li>')+'</li>'
                );
            };

            new Calendar('example-5', {
                source: 'example-5-bt',
                dateFormat: 'Y/m/d',
                multiselect: true,
                events: {
                    onSelectEvent: multiSelect
                }
            });
        }
    ];
    runners.each(function(s,i) {
        Demos.examples[i] = new Demos.Example(s, 'ex'+(i+1));
    });

</block>
