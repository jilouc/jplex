# Welcome #

Welcome to the wonderful world of jPlex programming. In the sidebar on the left you can see the different modules of jPlex. When clicking on one, it will go into the module and then see the different classes (or components).

We try to keep the doc as updated as possible. If you see any error or inconstancies or even a mal formed description, do not hesitate to notify us via our mailing-list or by a comment on the page.

This API has been generated directly from the code via a modified version of [YUIDoc](http://yuilibrary.com/projects/yuidoc/wiki). This version is available [on the repository](http://code.google.com/p/jplex/source/browse/#svn/trunk/dist/tools/yuidoc). Each API page shows the list of properties, methods and in the case of a component the list of configs and events related to it.

This page will tell you how to **use** the jPlex API and the main code guideline related to it.

# [Packager](APIPangolinjPlex.md) #
jPlex embeds its own packager to classify the class loading and the dependancies. The main idea is to use the Java package style. For instance if you want to use the calendar component, you will need to put in your code:
```
jPlex.include("jplex.components.Calendar");```
After including this piece of code, you can call the calendar directly via the class name `Calendar`. If you do not want to set this variable (for example if you have already set a variable of the same name), you can put the optional argument to true.

```
jPlex.include("jplex.components.Calendar", true);```
You can stil call the calendar but via the global variable `jplex.components.Calendar` and not by `Calendar` directly. Alternatively you can also put it on another more manipulable variable like that :
```
var CalComponent = jPlex.include("jplex.components.Calendar", true);```

If you want to include many classes you can also use the special item `*` that will includes all classes inside the package _AND_ all the subpackages. Of course, the second parameter will be transmitted on recursive calls. It is typically useful if you need to use our `XPrototype` extension by:
```
jPlex.include("jplex.xprototype.*");```

If you like the packager (you should :)): you can also use the packager **for your own good** via the jPlex.provide method! Consult the API of the static class [jPlex](APIPangolinjPlex.md) for more detail.

# [Components](APIPangolincommonComponent.md) #
We use a very powerful and unified model of components to instanciate the different UI widgets.

Every components are instanciated like that:
```
var myComponent = new MyComponent("idMyComponent", {config1: value1, ..., events: {eventName1: handler1,...});```
Every component is related to one main HTML element as its body. If the element `idMyComponent` exists, it will be the body of the component. If the element does not exist, it is automatically created and appenend to `document.body`.

Of course each config parameter has a default value so if the config **is not mandatory**, you are not obliged to put a value to it. This is the same thing for the custom events. If you do not like this way to put the handler like that you can define the event handling via the method `setEvent`.

If you want to get the instance variable but you lost it (_oh dammit!_) because you are in an other class, or in a separated runtime (event handling for example), you can still get it via the method $C.
```
var myComponent = $C("idMyComponent");```

If you generate a lot of component and then destroy them, a method has been created for that to ensure that you do not have any pointer that remains inside the jPlex API (to let the GC do its work) you will need to use the `unregister` method like:
```
myComponent.unregister();
$C("idMyComponent") // undefined
```

Again you can use our component model **for your own good**. As it is really easy to program via a single `_definition` property that will describe the default config etc...

# Locale #
The Locale is fairly simple to use. The default language for all the component is English (en). But you can change this parameter by just setting your global language with:
```
Locale.lang = 'fr';```

For now here is the list of implemented languages:
  * `en`: English
  * `fr`: French
  * `jp`: Japanese

This locale is used for example to set the month and days name in the Date component (used in the Calendar component).

Again you can use it **for your own good**! (yes I'm repeating myself but it's necessary) You can define the sets in your components or in the global Locale class. See the [Locale API](APIPangolincommonLocale.md) to see more details.

# Enjoy ! #
That's it, you know **everything** to play with jPlex. Yes that's it, there is no more weird features, everything is here and the detail of each config/event/method... is inside the API.

Enjoy your jPlex experience and do not hesitate to contribute, make comments or suggestions!