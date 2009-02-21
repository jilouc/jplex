/** 
 * A preconfigured modal window class
 * @class window.Modal
 * @extends jplex.components.Window
 */
jPlex.provide('jplex.components.window.Modal', 'jplex.components.Window', {

   _definition: {
        name: 'WindowDialog',
        defaultConfig: {
            header:false,
            footer:false,
            modal:true,
            center:true,
            close:'onclickout',
            draggable:false,
            width: null,
            heigth: null,
            top: null,
            left: null,
            title:"",
            zBase: 9998,

            events: {
                onShowEvent: Prototype.emptyFunction,
                onHideEvent: Prototype.emptyFunction,
                onPositionChangeEvent: Prototype.emptyFunction
            }

        },
        defaultContainer: "div"
    },

    initialize: function($super, eElement, oConfig) {

       oConfig = Object.extend(this._definition.defaultConfig, oConfig);
       oConfig.modal = true;
       $super(eElement, oConfig); 
   }
});
