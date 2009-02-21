/**
 * Global class that manipulates the global language and local settings. We define components on it corresponding to
 * some parts of the locales. The defined components are for now: 'Date', ...
 * @class Locale
 * @namespace jplex.common
 * @static
 */
jPlex.provide('jplex.common.Locale', {});
jPlex.extend('jplex.common.Locale', {
    /**
     * The global lang parameter, every default value for lang will be used considering this property. 
     * <br/><b>This value has to be changed if you consider writing an application in a different language than the default value</b>
     * @property lang
     * @type String
     * @default 'fr'
     */
    lang: 'fr',
    /**
     * Get the complete HashSet corresponding to the following component and lang
     * @param {String} component The component 
     * @param {String} lang The lang, Locale.lang if not defined  
     * @return {Hash} The locale HashSet corresponding
     */
    get: function(component, lang) {
        var comp = this._components.get(component);
        if (!comp) return undefined;    
        if (!lang) lang = this.lang;
        return $H(comp.get(lang));
    },
    /**
     * Useful default usage of the locale string, corresponds to: 
     * <pre>Locale.get(component).get(field)</pre>
     * with undefined error treatment of course
     * @param {String} component The locale component
     * @param {String} field The wanted field
     * @return {String|Array} The locale string or array, undefined if not found
     */
    current: function(component, field) {
        var comp = this.get(component);
        if (!comp) return undefined;
        return $H(comp).get(field);
    },
    /**
     * Initialize a component into the Locale storage 
     * @param {String} component The component
     * @param {String} hashSet Its definition, first indexed by the language, then by the fields
     */
    init: function(component, hashSet) {
        return this._components.set(component, $H(hashSet));
    },
    /**
     * Internal storage
     * @private
     */
    _components: new Hash()
});

jplex.common.Locale.init('Date', {
    fr: {
        DAYS_SHORT: $A(['Di.', 'Lu.', 'Ma.', 'Me.', 'Je.', 'Ve.', 'Sa.']),
        DAYS: $A(['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']),
        MONTHS: $A(['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']),
        MONTHS_SHORT: $A(['Jan.', 'Fév.', 'Mars', 'Avr.', 'Mai', 'Juin',
            'Jui.', 'Août', 'Sep.', 'Oct.', 'Nov.', 'Déc.']),
        FORMAT: 'd/m/Y'
    },
    en: {
        DAYS_SHORT: $A(['Su.', 'Mo.', 'Tu.', 'We.', 'Th.', 'Fr.', 'Sa.']),
        DAYS: $A(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']),
        MONTHS: $A(['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December']),
        MONTHS_SHORT: $A(['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'June',
            'July', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.']),
        FORMAT: 'm-d-Y'
    }
});