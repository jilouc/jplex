/*! jPlex User Interface Framework
 *  (c) 2009 Loic Petit - Jean-Luc Dagon
 *
 *  jPlex is freely distributable under the terms of an MIT-style license.
 *  For details, see the jPlex web site: http://jplex.googlecode.com/
 *
 *--------------------------------------------------------------------------*/
/**
 * The main class of the jPlex Library
 * @module jPlex
 */
/**
 * The main jPlex class. Contains the current major version, the dependencies and the list of packages provided.
 * It also provides packaging primitives and dependancies loading. This class is the only one that you need to
 * include inside your page to use jPlex. It will load the packages you need after.
 * @static
 * @class jPlex
 */
var jPlex = {
    version: '1.1',

    /**
     * Array of the javascript to include in order to resolve the different dependancies
     * @property _dependancies
     * @private
     * @type Array
     */
    _dependancies: [
        'prototype-1.6.1',
        'scriptaculous'
    ],
    _dependanciesFF2: [
        'effects',
        'dragdrop'
    ],

    /**
     * List of each package to include. Useful to give the possibility to load everything of a group of package
     * @property _classes
     * @private
     * @type Array
     */
    _classes: [
        'jplex.common.Config',
        'jplex.common.Locale',
        'jplex.common.Component',
        'jplex.common.DataSource',
        'jplex.xprototype.Core',
        'jplex.xprototype.Date',
        'jplex.xprototype.Element',
        'jplex.xprototype.Event',
        'jplex.xprototype.Object',
        'jplex.xprototype.String',
        'jplex.components.Calendar',
        'jplex.components.Datatable',
        'jplex.components.Menu',
        'jplex.components.menu.MenuBar',
        'jplex.components.MouseOverImage',
        'jplex.components.Overlay',
        'jplex.components.Resizable',
        'jplex.components.Tabs',
        'jplex.components.Tooltip',
        'jplex.components.Frame',
        'jplex.components.frame.Dialog',
        'jplex.components.frame.Modal',
        'jplex.components.frame.FrameSet' 
    ],

    /**
     * Array containing the source code of some (or all) javascript file. Used when the sources are packaged in one file.
     * Of course, this array is indexed by the path from the source folder.
     * @property src
     * @type Array
     */
    src: [],

    /**
     * Boolean array: Stores the list of the loaded files.
     * @property _loaded
     * @type Array
     * @private
     */
    _loaded: [],

    /**
     * Loads a javascript file. If the source is embedded, then the source will be <em>eval()</em>, else it will
     * be loaded via Ajax. That's why you need to run jPlex source tree on a local webserver (for security reasons it's
     * not allowed to do a request on local disk or distant web service with a different domain).
     * @param load
     * @param {String} fileName The path of the file from the source folder
     */
    load: function (fileName) {
        if (jPlex._loaded[fileName]) return;
        if (this.src[fileName] != undefined) {
            eval(jPlex.src[fileName]);
            return;
        }
        new Ajax.Request(this.path + fileName, {
            method:'get',
            asynchronous:false
        });
        jPlex._loaded[fileName] = true;
    },

    /**
     * Loads a javascript file by writing a <em>&lt;script&gt;</em> on the page.
     * Currently used to include the dependancies.
     * @param {String} fileName The path of the file
     */
    loadJS: function(fileName) {
        //noinspection DocumentWriteJS,StringLiteralBreaksHTMLJS
        document.write("<script type='text/javascript' src='" + fileName + "'></script>");
    },

    /**
     * This function initialize jPlex if needed. If prototype is already loaded, then it won't to anything.
     */
    init: function() {
        var scripts = document.getElementsByTagName("script");
        for (var i = 0; i < scripts.length; i++) {
            var s = scripts[i];
            if (s.src && s.src.match(/j[pP]lex\.js(\?.*)?$/)) {
                var path = s.src.replace(/j[pP]lex\.js(\?.*)?$/, '');
                this.path = path;
                if (typeof Prototype != 'undefined') return;
                var includes = s.src.match(/\?.*load=([a-z,]*)/);
                var deps = (includes ? includes[1] : jPlex._dependancies);
                if (navigator.userAgent.indexOf("Firefox/2"))
                    deps = deps.concat(jPlex._dependanciesFF2);

                var tmp = path.split('/');
                tmp.length -= 2;
                var libpath = tmp.join('/') + "/libs/";
                for (var j = 0; j < deps.length; j++) {
                    jPlex.loadJS(libpath + deps[j] + '.js');
                }
            }
        }
    },

    /**
     * Packaging method. Includes the selected class by resolving its dependancies. When a class is included
     * its variable is created. For instance, when you want to include 'jplex.components.Frame', then the class Window
     * will be available in the var <em>jplex.components.Frame</em>. But by default and convention, the global var
     * <em>Window</em> is also defined/overwriten. If you do not want to override your global variable, just use the
     * optional argument.
     *
     * In the package name, you can also want to import everything from a subpackage (a typical example will be to
     * import XPrototype only). We have foreseen this trick by adding the possibility to use the * as a universal
     * selector.
     * @param {String} path The class/package you want
     * @param {bool} dontdefine Optional - True if you do not want to override the global variable
     * @return {Class} The provided class, or null if the package did not provide any class or if the * was used.
     */
    include: function(path, dontdefine) {
        var pack = path.split('.');

        var clazz = jPlex.get(path);

        if (clazz) {
            if (!window[pack[pack.length - 1]] && !dontdefine && pack[1] != 'xprototype')
                window[pack[pack.length - 1]] = clazz;
            return clazz;
        }

        if (pack[pack.length - 1] == '*') {
            $A(this._classes).each(function(item) {
                if (item.startsWith(path.replace('*', '')))
                    this.include(item, dontdefine);
            }, this);
            return null;
        }
        var acc = "";
        var i;
        for (i = 0; i < pack.length - 1; i++) {
            acc += pack[i] + "/";
        }
        if (pack[pack.length - 2] && pack[pack.length - 2] == 'components')
            acc += pack[pack.length - 1].toLowerCase() + "/";
        acc += pack[pack.length - 1] + ".js";
        jPlex.load(acc);
        var res = jPlex.get(path);
        var className = pack[pack.length - 1];
        if (!window[className] && !dontdefine && pack[1] != 'xprototype') {
            window[className] = res;
        }
        return res;
    },
    /**
     * Get a provided class by its full name, but does not include it.
     * @param clazz The class you want
     * @return {Class} The class or null if not found
     */
    get: function(clazz) {
        var k = window;
        var notfound = false;
        $A(clazz.split('.')).each(function(arg, i) {
            if (k) k = k[arg];
            else {
                notfound = true;
                throw $break;
            }
        });
        if (notfound) return null;
        return k;
    },

    /**
     * Provide to the jPlex package system a new class. This method encapsulates Class.create from prototype.
     * Any class in the jPlex source code must be declare like this.
     *
     * @param {String} clazz The full class name
     * @param {String|Object} arg1 The mother class name or directly the object that defines the class
     * @param {Object} arg2 The object that defines the class
     */
    provide: function(clazz, arg1, arg2) {
        var obj, mommy;
        if (!arg2) obj = arg1;
        else {
            obj = arg2;
            mommy = arg1;
        }

        var res;
        if (mommy) {
            mommy = jPlex.include(mommy);
            res = Class.create(mommy, obj);
        } else {
            res = Class.create(obj);
        }

        var path = $A(clazz.split('.'));
        var k = window;
        for (var i = 0; i < path.length - 1; i++) {
            var arg = path[i];
            if (!k[arg]) k[arg] = {};
            k = k[arg];
        }
        k[path[path.length - 1]] = res;
    },
    /**
     * Extends the class by giving static fields. Useful to create inner classes example: Calendar.Item
     * @param clazz The full class name
     * @param obj The new static field
     */
    extend: function(clazz, obj) {
        Object.extend(this.get(clazz), obj);
    },

    /**
     * Set the global skin theme for jPlex components
     * A "fake" CSS class is applied to the `<body>` element of the page. Override some css rules using
     * the following example:
     * <code>.custom-skin div.jplex-calendar { custom properties }
     * ...
     * .custom-skin div.menubar { custom properties }
     * ...</code>
     *  
     * @param {String} skin Name of a "fake" CSS class that will be added to the body of the page.
     */
    useSkin: function(skin) {
        var root = $(document.body);
        root.removeClassName(this._skin || "");
        root.addClassName(skin);
        this._skin = skin;
    }
};

jPlex.init();
