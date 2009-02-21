/**
 * A preconfigured dialog box window class
 * @class window.Dialog
 * @extends jplex.components.Window
 */
jPlex.provide('jplex.components.window.Dialog', 'jplex.components.Window', {

    _definition: {
        name: 'WindowDialog',
        defaultConfig: {
            header:true,
            footer:true,
            modal:false,
            center:true,
            close:jplex.components.Window.CLOSE_BUTTON,
            draggable:true,
            width: null,
            heigth: null,
            top: null,
            left: null,
            icon: '',
            title:'Dialog',
            okButton: true,
            cancelButton: true,
            okText: '',
            cancelText: '',

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

       oConfig = Object.extend(this._definition.defaultConfig, oConfig);
       $super(eElement, oConfig);

       this._addButtons();
    },

    _addButtons: function() {
        if(this.cfg('okButton')) {
            var ok = new Element('input', {
                type: 'button',
                id: this.sID+'-ok',
                value: this.cfg('okText').blank() ? this.lang('OK') : this.cfg('okText')
            });
            this.component.down('div.footer').appendChild(ok);
            ok.observe('click', this._okButtonClick.bindAsEventListener(this));
        }

        if(this.cfg('cancelButton')) {
            var cancel = new Element('input', {
                type: 'button',
                id: this.sID+'-cancel',
                value: this.cfg('cancelText').blank() ? this.lang('CANCEL') : this.cfg('cancelText')
            });
            this.component.down('div.footer').appendChild(cancel);
            cancel.observe('click', this._cancelButtonClick.bindAsEventListener(this));
        }
    },

    _okButtonClick: function() {
        this.fireEvent('onOkButtonClickEvent');
    },

    _cancelButtonClick: function() {
        this.fireEvent('onCancelButtonClickEvent');
    },

    hide: function($super) {
        this.fireEvent('onCancelButtonClickEvent');
        $super();
    }
});