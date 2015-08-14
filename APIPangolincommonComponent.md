# Class **jplex.common.Component** #

## Description ##
Component class. This class is the mother class of every widget we use
in jPlex. It provides us a global management of the configurations and a unified ID allocation.

Defining a new component needs a bit more than just extending this class.
You'll need to initialize it by calling in the constructor
```
$super(element, config);```
And you need to define a private property object <em>_definition</em> containing at least the name of the component.
Here is a complete example of a component:_

```
jPlex.provide('jplex.components.A', 'jplex.common.Component', {
    _definition: {
        name: 'A', // Name
        defaultConfig: { // The default config available in this.cfg('...')
            ...
        },
        events: {...}, // Custom Events
        text: { fr: {...}, en: {...}, ... } // Global labels for this components
        text: { fr: {...}, en: {...}, ... } // Global labels for this components
    },
    initialize: function($super, element, config) {
        $super(element, config);
        ...
    },
    ...
}
```

You can also define an **extension** of another component by setting the private property object `_extension` rather
than `_definition`. In this case, the definition will be taken from the mother component and refined by the child
component. A common example is the Dialog and the Modal components that are extensions of the Frame component. You
are welcome to browse the source of our components to see how to define yours.




## Properties ##
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Name</b> </td><td> <b>Type</b> </td><td> <b>Description</b> </td></tr>
<tr><td> <i>component</i> </td><td> <code>Element</code> </td><td> <code> </code>  The container HTML Element of the jplex Component</td></tr>
<tr><td> <i>createdComponent</i> </td><td> <code>bool</code> </td><td> <code>private  </code>  If true, the component property has been created during the initialization</td></tr>
<tr><td> <i>ID</i> </td><td> <code>String</code> </td><td> <code> </code>  ID of the main HTML Element of the component</td></tr>
<tr><td> <i>UID</i> </td><td> <code>String</code> </td><td> <code> </code>  Computed Unique ID of the component</td></tr>

</table>



## Methods ##
<table cellpadding='5' border='1' cellspacing='0'>
<tr><td> <b>Signature</b> </td><td> <b>Return Type</b> </td><td> <b>Description</b> </td></tr>
<tr><td> <code>$C(c)</code> </td><td> <code>Component</code> </td><td> The ultimate function to get the component by its ID. This function can also accept an instance of Component too.<br />  - <code>c &lt;String|Component&gt;</code> The concerned component ID<br /></td></tr>
<tr><td> <code>cfg(name)</code> </td><td> <code>String</code> </td><td> Get a configuration parameter<br />  - <code>name &lt;String&gt;</code> Name of the config parameter<br /></td></tr>
<tr><td> <code>fireEvent(eventName, parameters)</code> </td><td> <code>void</code> </td><td> Fires the specified custom event with given parameters<br />  - <code>eventName &lt;String&gt;</code> the custom event name<br /> - <code>parameters &lt;Object&gt;</code> Optional. Hash of event parameters.<br /></td></tr>
<tr><td> <code>getEvent(eventName)</code> </td><td> <code>Function</code> </td><td> Get the event handler for the custom event<br />  - <code>eventName &lt;String&gt;</code> the custom event name<br /></td></tr>
<tr><td> <code>lang(name)</code> </td><td> <code>String|Array|Boolean</code> </td><td> Reads the string or array that corresponds to the right lang<br />  - <code>name &lt;String&gt;</code> name corresponding to the text field<br /></td></tr>
<tr><td> <code>locale(component, field)</code> </td><td> <code>void</code> </td><td> Reads the string or array in the common corresponding to the locale<br />  - <code>component &lt;String&gt;</code><br /> - <code>field &lt;String&gt;</code><br /></td></tr>
<tr><td> <code>setCfg(name, value)</code> </td><td> <code>void</code> </td><td> Sets a local configuration parameter<br />  - <code>name &lt;String&gt;</code> Name of the config parameter<br /> - <code>value &lt;mixed&gt;</code> Value to set<br /></td></tr>
<tr><td> <code>setEvent(eventName, handler)</code> </td><td> <code>void</code> </td><td> Set the event handler for the custom event.<br>
The context is bound to the component.<br />  - <code>eventName &lt;String&gt;</code> the custom event name<br /> - <code>handler &lt;Function&gt;</code> the custom event handler<br /></td></tr>
<tr><td> <code>unregister()</code> </td><td> <code>void</code> </td><td> Deletes the reference in the component table, usefull when you delete a lot of component, it avoids memory<br>
overflow<br /> </td></tr>

</table>