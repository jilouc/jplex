
var CSSRulesExplorer = Class.create({
    initialize: function(component, stylesheet) {
        this.stylesheet = stylesheet;
        this.component = $(component || document.body);
        this.selectedRule = null;
        this.fixed = false;

        this.rules = $A([]);

        new Ajax.Request(this.stylesheet, {

            onComplete: function(transport) {

                // Fetch and parse CSS Stylesheet
                var css = transport.responseText;
                css.scan(/([\w-:\[.#][^{};]*){\s*([\-A-Za-z0-9: !,;()'"_\s".#\/]*)\s*}/, function(match) {
                    match[1].split(",").each(function(s) {
                        this.rules.push({
                            selector: s,
                            body: (match[2].strip()).gsub(/;\s*([a-z\-])/, ";\n#{1}") + "\n\n"
                        });
                    }.bind(this));
                }.bind(this));

                this.rules = this.rules.map(function(item) {
                    return {
                        selector:item.selector.strip(),
                        body:item.body
                    };
                }.bind(this)).uniq();

                var highlighter = $("rules");

                this.rules.each(function(s) {
                    var style = new Element("code").addClassName("css").addClassName("rule").update(s.selector);
                    highlighter.insert(style.wrap("pre"));

                    var full = new Element("code").addClassName("css").update(s.body);
                    highlighter.insert(full.wrap("pre", {
                        'style':'display:none',
                        'class':'body'
                    }));

                    style.observe("click", function() {


                        $(full.parentNode).toggle();
                        if (this.selectedRule) {
                            $(this.selectedRule.element.parentNode.nextSibling).toggle();
                            this.unfocusCSS2Element(this.selectedRule.rule, this.selectedRule.element);
                        }

                        if (!this.selectedRule || s.selector != this.selectedRule.rule.selector) {
                            this.focusCSS2Element(s, style);
                            if (this.selectedRule && s.selector != this.selectedRule.rule.selector) {
                                this.highlightElements(s);
                            }
                            this.selectedRule = {
                                rule: s,
                                element: style

                            };
                            this.fixed = true;
                        } else {
                            this.fixed = false;
                            this.selectedRule = null;
                            $(full.parentNode).toggle();
                        }


                    }.bind(this));

                    style.observe("mouseover", function() {
                        var time = new Date().getTime();
                        if(time - CSSRulesExplorer._time < 500) return;
                        else {
                            time = CSSRulesExplorer._time; 
                        }
                        if (this.fixed) return;

                        this.highlightElements(s);
                    }.bind(this));

                    style.observe("mouseout", function() {
                        if (this.fixed) return;

                        this.unhighlightElements(s);
                    }.bind(this));

                }.bind(this));

                CodeHighlighter.init();

                var hd = $$(".styles-header")[0];
                $("highlight-zone").setStyle({
                    marginTop:(hd.getDimensions().height) + "px"
                });

            }.bind(this)
        });
    },

    focusCSS2Element: function(rule, element) {
        $(element.parentNode).addClassName("selected");
        //this.highlightElements(rule);
    },

    highlightElements: function(rule) {
        var i = 10000;
        var matches = this.component.select(rule.selector);
        if (matches.length == 0) matches = $$(rule.selector);
        matches.each(function(e) {
            var layer = new Element("div");
            layer.addClassName("rules-highlighter-overlay");
            document.body.appendChild(layer);
            layer.clonePosition($(e));
            var dim = layer.getDimensions();
            layer.setStyle({
                zIndex: i++,
                width: (dim.width - 8) + "px",
                height: (dim.height - 8) + "px"
            }).setOpacity(0.5);
        });
    },

    unfocusCSS2Element: function(rule, element) {
        $(element.parentNode).removeClassName("selected");
        this.unhighlightElements(rule);
    },

    unhighlightElements: function(rule) {
        $$("div.rules-highlighter-overlay").each(function(e) {
            document.body.removeChild(e);
        });
    }
});

CSSRulesExplorer._time = 0;


CSSRulesExplorerFactory = {

    forComponent: function(component) {
        var c = CSSRulesExplorerFactory[component];
        if(!c) return;
        
        var name = component.toLowerCase();
        var css = "../../src/jplex/components/"+name+"/assets/"+name+".css";

        $("component-css").href = css;
        jPlex.include("jplex.components."+component);
        $("rules").removeChildren();
        
        $("highlight-zone-component").update(c.html);
        c.init();

        new CSSRulesExplorer("highlight-zone", css);
    },

    Calendar: {
        init: function() {

            var f = new Calendar("calendarExample", {
                events: {
                    onSelectEvent: function(o) {
                        $("result").value = this.getFormattedValue();
                    }
                }
            });
            var eClose = new Element("div", {
                id: f.UID + "_CLOSE"
            }).addClassName("close").update("&nbsp;" + f.lang("CLOSE") + "&nbsp;");
            f.component.appendChild(eClose);

        },

        html: '<input id="result" class="jplex-calendar" value="2009/02/20" type="text" style="margin:1em" readonly="true">' +
            '<input class="jplex-calendar" value="&nbsp;" type="button" style="margin:1em">' +
            '<div id="calendarExample" style="margin:1em;"></div>',

        styles: Prototype.emptyFunction

        
    },

    Frame: {
        init: function() {
            var f = new Frame("myFrameExample", {
                title: "Header"
            });
            f.setBody("Etiam vel tortor. Vestibulum iaculis tristique est. Nunc egestas, sapien sit amet fermentum tincidunt, ligula nibh viverra orci, ac varius tellus dolor a ante. Nullam mi nibh, venenatis non, adipiscing ut, volutpat in, sapien. Phasellus at nisl molestie est aliquet consequat. Nulla facilisi. Fusce dui eros, dignissim et, ultricies non, aliquam a, elit. Nam tincidunt vestibulum leo.");
            f.setFooter("Footer");
            f.show();

            f.component.setStyle({
                position:"static",
                width:"350px",
                margin:"1em"
            });
            f.component.down(".close").setStyle({
                position:"static",
                cssFloat:"right",
                margin:(Prototype.Browser.WebKit ? "0" : "-15px")+" -15px 0 0"
            });
        },

        html: '<div id="myFrameExample"></div>'
    },

    MenuBar: {
        init: function() {

            var f = new MenuBar("myMenuBarExample");
            f.addItem({name:"Root Item 1"}).addItem({name:"Root Item 2", icon:"img/arrow_stop.png"});
            f.getItem(0).addItem({name:"Item 1.1", icon:"img/arrow_stop.png"})
                    .addItem({name:"Item 1.2"})
                    .addItem({name:"Item 1.3", shortcut:{key:Event.Key.Y, ctrl:true, text:"Ctrl+Y"},click:function() {
                alert("You've clicked on the " + this.getDetails().label + " item");
            }});
            f.getItem(0).getItem(1).addItem({name:"<a href='http://code.google.com/p/jplex/'>Item 1.2.1 (with anchor)</a>"})
                    .addItem({name:"Item 1.2.2 (link)", link:"http://code.google.com/p/jplex/"});
            f.getItem(1).addItem({name:"Item 2.1"});

            (function() {
                f.getItem(0).show();
                f.getItem(0).getItem(1).show();
                f.getItem(0)._fixPosition();
            }).delay(2);
        },

        html: '<div id="myMenuBarExample" style="margin:1em 0 10em 0; min-width:350px;"></div>'
    },

    Tabs: {
        init: function() {
            new Tabs("myTabsExample", {
                data: [{title:"1st Tab", content:"tab1"},{title:"2nd Tab", content:"tab2"}]
            });
            $("highlight-zone-component").setStyle({
                maxWidth:"400px",
                padding:"1em"
            });
        },

        html: '<ul id="myTabsExample"></ul>' +
            '<div id="tab1" style="clear:both;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut purus. Curabitur eleifend aliquam nibh. Aliquam erat volutpat. Morbi commodo, sem vitae auctor tempor, felis leo pulvinar odio, id lacinia massa velit nec libero.</div>' +
            '<div id="tab2" style="clear:both;">Morbi nibh. Aliquam hendrerit, ipsum et interdum ullamcorper, ipsum risus suscipit est, a scelerisque eros elit eget sapien. Nunc gravida est quis justo. Etiam cursus semper augue.</div>'
    }
};