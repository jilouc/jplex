/**
 * Tabs component, creates a neat tab bar in a <em>ul</em> container. This bar controls the display of
 * <em>div</em>s. There is two methods, a classical one with many <em>div</em>s that are managed by show/hide methods. 
 * Or another one by getting the content via Ajax and display it on a single <em>div</em>. 
 * 
 * <table class='config'>
 *      <tr><td>data</td><td>null</td>
 *          <td><strong>Mandatory.</strong> Describes the tab structure. It is a array of objects that have only two 
 *              fields, <em>title</em>: which is the title to put in the tab bar and <em>content</em> which is a div 
 *              id if the method is the div one, or a url if it's the other.</td></tr>
 *      <tr><td>style</td><td>pui-tabs</td>
 *          <td>Default style to apply to the <em>ul</em> markup</td></tr>
 *      <tr><td>method</td><td>div</td>
 *          <td>'div' indicates the classical method, 'ajax' indicates the other (see bellow)</td></tr>
 *      <tr><td>ajaxDiv</td><td>false</td>
 *          <td><em>Require 'ajax' method. </em><strong>Mandatory.</strong>  Container to display the content</td></tr>   
 *      <tr><td>ajaxMethod</td><td>get</td>
 *          <td><em>Require 'ajax' method.</em> HTTP method to use for Ajax Requests</td></tr>            
 *      <tr><td>ajaxReload</td><td>false</td>
 *          <td><em>Require 'ajax' method.</em> If false, the content of each tabs is cached and will not be
 *                  requested again. Else for each tab switch, you will do a request</td></tr>          
 *      <tr><td>activeTab</td><td>0</td>
 *          <td>Default active tab index</td></tr>
 * </table>
 *          
 * <table class='events'>
 *      <tr><td>onSwitchEvent</td><td>When an effective switch has been done</td>
 *          <td>oldContent: The content field from <em>data</em> that corresponds to the tab the user just quitted<br/>
 *              newContent: The content field from <em>data</em> that corresponds to the tab the user just selected</td></tr>
 * </table> 
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
            data:null,
            style: 'jplex-tabs',
            method: 'div',
            ajaxDiv: false,
            ajaxMethod: 'get',
            ajaxReload: false,
            activeTab: 0,
            events: {
                onSwitchEvent: Prototype.emptyFunction
            }
        },
        defaultContainer: "ul"
    },
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

        // TODO Event.onElementReady
        if (this.cfg('method') == 'div')
            Event.observe(window, 'load', this.initDivMethod.curry(this.aDefinition, activeTab).bind(this));
        else
            Event.observe(window, 'load', this.initAjaxMethod.curry(this.aDefinition, activeTab).bind(this));
        var ajaxDiv = this.cfg('ajaxDiv');
        if (ajaxDiv)
            this.ajaxDiv = ajaxDiv;
    },
    initDivMethod: function(definition, activeTab) {
        definition.each(function(v) {
            $(v.content).hide();
        });
        $(definition[activeTab].content).show();
    },
    initAjaxMethod: function(definition, activeTab) {
        this.handleAjaxMethod(definition[activeTab].content, false);
    },
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
    handleDivMethod: function(newTab, oldTab) {
        $(newTab).show();
        $(oldTab).hide();
    },
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
    }
});