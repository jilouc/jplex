/**
 * A preconfigured dialog box window class
 * @class window.Dialog
 * @extends jplex.components.Window
 */
jPlex.provide('jplex.components.window.Dialog', 'jplex.components.window.Modal', {
    
    _definition: {
        name: 'WindowDialog',
        defaultConfig: {
            header:true,
            footer:true,

            center:true,
            close:jplex.components.Window.CLOSE_BUTTON,
            draggable:true,

            okButton: true,
            cancelButton: true,
            okButtonLabel: '',
            cancelButtonLabel: '',

            zBase:9998,
            /**
             * Array of optional button, each item of the array is an object like the following
             * { label: "Label of the button", click: function: { Function triggered on click } }
             * Note that in the 'click' function, 'this' will refer to the Window.Dialog object.
             */
            otherButtons: [],

            events: {
                onShowEvent: Prototype.emptyFunction,
                onHideEvent: Prototype.emptyFunction,
                onPositionChangeEvent: Prototype.emptyFunction,
                onOkButtonClickEvent: Prototype.emptyFunction,
                onCancelButtonClickEvent: Prototype.emptyFunction
            }

        },
        defaultContainer: "div",
        text: {
            fr: { OK: 'OK', CANCEL: 'Annuler'},
            en: { OK: 'OK', CANCEL: 'Cancel'}
        }
    },


    initialize: function($super, eElement, oConfig) {

       oConfig = Object.extend(Object.clone(this._definition.defaultConfig), oConfig);
       $super(eElement, oConfig);

       this._addButtons();

       if($(this.ID+"-closecross")) {
           $(this.ID+"-closecross").observe('click', this._cancelButtonClick.bind(this));
       }
    },

    _addButtons: function() {
        var down = this.component.down('div.footer');        

        $A(this.cfg("otherButtons")).each(function(s,i) {
            var bt = new Element('input', {
                type: 'button',
                id: this.sID+'-bt'+i,
                value: s.label
            });
            down.appendChild(bt);
            bt.observe('click', s.click.bindAsEventListener(this));
        }.bind(this));

        if(this.cfg('okButton')) {
            var ok = new Element('input', {
                type: 'button',
                id: this.sID+'-ok',
                value: this.cfg('okButtonLabel').blank() ? this.lang('OK') : this.cfg('okButtonLabel')
            });
            down.appendChild(ok);
            ok.observe('click', this._okButtonClick.bindAsEventListener(this));
        }

        if(this.cfg('cancelButton')) {
            var cancel = new Element('input', {
                type: 'button',
                id: this.sID+'-cancel',
                value: this.cfg('cancelButtonLabel').blank() ? this.lang('CANCEL') : this.cfg('cancelButtonLabel')
            });
            down.appendChild(cancel);
            cancel.observe('click', this._cancelButtonClick.bindAsEventListener(this));
        }


        
    },

    _okButtonClick: function() {
        this.fireEvent('onOkButtonClickEvent');
        this.hide();
    },

    _cancelButtonClick: function() {
        this.fireEvent('onCancelButtonClickEvent');
        this.hide();
    },

    hide: function($super) {
        $super();
    }
});