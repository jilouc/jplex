/**
 * Tabs component, creates a neat tab bar in a <em>ul</em> container. This bar controls the display of
 * <em>div</em>s. There is two methods, a classical one with many <em>div</em>s that are managed by show/hide methods. 
 * Or another one by getting the content via Ajax and display it on a single <em>div</em>. 
 * 
 * The content has the following form:
 * {{{
 * [
 *   {title: 'First test', content:'test1'}, // test1 is a div id
 *   {title: 'Second test', content:'test2'} // test2 is a div id
 * ]
 * }}}
 * 
 * @class Tabs
 * @param {Element|String} eElement
 * @param {Object} oConfig Configuration properties
 * @constructor
 * @extends jplex.common.Component
 */
jPlex.provide('jplex.components.Tabs', 'jplex.common.Component', {
    _definition: {
        name: 'Tabs',
        defaultConfig: {
            /**
             * <strong>Mandatory.</strong> Describes the tab structure. It is a array of objects that have only two 
             * fields, `title`: which is the title to put in the tab bar and `content` which is a div 
             * id if the method is the div one, or a url if it's the other.
             * @config data
             * @default null
             */
            data:null,
            /**
             * Default style to apply to the `ul` markup
             * @config style
             * @default "jplex-tabs"
             */
            style: 'jplex-tabs',
            /**
             * 'div' indicates the classical method, 'ajax' indicates the other (see bellow)
             * @config method
             * @default "div"
             */
            method: 'div',
            /**
             * <em>Require 'ajax' method. </em><strong>Mandatory.</strong>  Container to display the content
             * @config ajaxDiv
             * @default false
             */
            ajaxDiv: false,
            /**
             * <em>Require 'ajax' method.</em> HTTP method to use for Ajax Requests
             * @config ajaxMethod
             * @default "get"
             */
            ajaxMethod: 'get',
            /**
             * <em>Require 'ajax' method.</em> If false, the content of each tabs is cached and will not be
             * requested again. Else for each tab switch, you will do a request
             * @config ajaxReload
             * @default false 
             */
            ajaxReload: false,
            /**
             * Default active tab index (first = 0)
             * @config activeTab
             * @default 0
             */
            activeTab: 0,
            events: {
                /**
                 * Well named event which is triggered after the tab switch
                 * @event onSwitchEvent
                 * @param {Array} oldContent The content field from <em>data</em> that corresponds to the tab the user just quitted  
                 * @param {Array} newContent The content field from <em>data</em> that corresponds to the tab the user just selected
                 */
                onSwitchEvent: Prototype.emptyFunction
            }
        },
        defaultContainer: "ul"
    },
    /**
     * The cache stores each tabs's innerHTML when ajaxReload is false 
     * @property cache
     * @type Array<String>
     * @private
     */
    cache: $A(),
    initialize: function($super, eElement, oConfig) {      
        $super(eElement, oConfig);
        
        if(this.cfg('method') != 'div' && !this.cfg('ajaxDiv'))
            throw "Mandatory parameter 'ajaxDiv' not provided";
        
        this.aDefinition = $A(this.cfg("data"));
        
        if(!this.aDefinition)
            throw "Mandatory parameter 'data' not provided";
        
        this.component.addClassName(this.cfg('style'));
        var activeTab = this.cfg('activeTab');
        this.aDefinition.each(function(obj, key) {
            var li = new Element("li").update(obj.title);
            if (key == activeTab) {
                this.oldLi = li;
                li.addClassName(this.cfg('style') + '-active');
                this.activeTab = obj.content;
            }
            li.observe('click', this.handler.curry(obj.content, li).bind(this));
            this.component.appendChild(li);
        }.bind(this));

        if (this.cfg('method') == 'div')
            this.initDivMethod(this.aDefinition, activeTab);
        else
            this.initAjaxMethod(this.aDefinition, activeTab);
        var ajaxDiv = this.cfg('ajaxDiv');
        if (ajaxDiv)
            this.ajaxDiv = ajaxDiv;
    },
    /**
     * Initialize the Div Method : hide the right divs, and show the `activeTab`th one
     * @param {Array} definition Same form as `data` from config
     * @param {int} activeTab The tab to show
     * @private
     */
    initDivMethod: function(definition, activeTab) {
        definition.each(function(v) {
            $(v.content).hide();
        });
        $(definition[activeTab].content).show();
    },
    /**
     * Initialize the Ajax Method: redirect to `handleAjaxMethod`
     * @param {Array} definition Same form as `data` from config
     * @param {int} activeTab The tab to show
     * @private
     */                                         
    initAjaxMethod: function(definition, activeTab) {
        this.handleAjaxMethod(definition[activeTab].content, false);
    },
    /**
     * Switch handler
     * @param newTab New definition object
     * @param li `li` markup where it has been clicked
     */
    handler: function(newTab, li) {       
        var oldTab = this.activeTab;
        if (oldTab == newTab) return;                     
        this.oldLi.removeClassName(this.cfg('style') + '-active');
        this.activeTab = newTab;

        if (this.cfg('method') == 'div')
            this.handleDivMethod(newTab, oldTab);
        else if (this.cfg('method') == 'ajax')
            this.handleAjaxMethod(newTab, oldTab);
        
        this.fireEvent("onSwitchEvent", {oldContent:oldTab, newContent:newTab});
        li.addClassName(this.cfg('style') + '-active');
        this.oldLi = li;
    },
    /**
     * Sub handler for Div Method
     * @param {String} newTab `id` of the new tab 
     * @param {String} oldTab `id` of the old tab
     */
    handleDivMethod: function(newTab, oldTab) {
        $(newTab).show();
        $(oldTab).hide();
    },
    /**
     * Sub handler for Ajax Method. Depending of the config `ajaxReload` an AJAX request should be launched 
     * @param {String} newUrl `URL` of the new content
     * @param {String} oldUrl `URL` of the old content
     */
    handleAjaxMethod: function(newUrl, oldUrl) {
        var content;
        if (!this.cfg('ajaxReload') && oldUrl) {
            this.cache[oldUrl] = $(this.ajaxDiv).innerHTML;
            if (this.cache[newUrl])
                content = this.cache[newUrl];
        }
        if (!content)
            new Ajax.Request(newUrl, {
                method: this.cfg('ajaxMethod'),
                onSuccess: function(transport) {
                    $(this.ajaxDiv).innerHTML = transport.responseText;
                }.bind(this)});
        else
            $(this.ajaxDiv).innerHTML = content;
    },
    /**
     * Returns the current active tab
     * @return {int} The current index
     */
    getActiveTab: function() {
        return this.activeTab;
    }
    
});