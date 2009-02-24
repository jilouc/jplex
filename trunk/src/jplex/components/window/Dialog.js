/**
 * A preconfigured dialog box window class
 * @class window.Dialog
 * @extends jplex.components.Window
 */
jPlex.provide('jplex.components.window.Dialog', 'jplex.components.Window', {
    
    _extension: {
        name: 'WindowDialog',
        defaultConfig: {
            header:true,
            footer:true,

            center: true,

            draggable:true,

            okButton: true,
            cancelButton: true,
            okButtonLabel: '',
            cancelButtonLabel: '',

            zBase:9998,
            /**
             * Array of optional button, each item of the array is an object like the following
             * <pre>{
             * &nbsp;&nbsp;label: "Label of the button",
             * &nbsp;&nbsp;click: function: { Function triggered on click }
             * }</pre>
             * Note that in the 'click' function, 'this' will refer to the Window.Dialog object.
             * @config otherButtons
             * @default []
             */
            otherButtons: [],

            events: {
                onOkButtonClickEvent: Prototype.emptyFunction,
                onCancelButtonClickEvent: Prototype.emptyFunction
            }

        },
        text: {
            fr: { OK: 'OK', CANCEL: 'Annuler'},
            en: { OK: 'OK', CANCEL: 'Cancel'}
        }
    },


    initialize: function($super, eElement, oConfig) {
       $super(eElement, oConfig);

       this._addButtons();

       if($(this.sID+"-closecross")) {
           $(this.sID+"-closecross").observe('click', this._cancelButtonClick.bind(this));
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