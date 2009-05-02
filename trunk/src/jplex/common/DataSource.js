jPlex.include("jplex.xprototype.*");

/**
 *
 */
jPlex.provide("jplex.common.DataSource", function() {
    var CACHE = $H();
    var UID = 0;

    return {
        initialize: function(type, source, schema, config) {
            this.UID = "jplex-ds-" + (++UID);
            this.type = type;
            this.source = source;
            this.poller = null;
            this.config = {
                parser: null,
                cache: false,
                lifetime: 1800,
                parameters: {},
                poll: false,
                pollInterval: 60,
                process: Prototype.emptyFunction
            };

            this.schema = {
                root: "datasource",
                item: "item",
                properties: []
            };

            Object.extendRecursive(this.schema, schema || {});
            Object.extendRecursive(this.config, config || {});

            // TODO check sur JSON et XML

            CACHE.set(this.UID, {last: null, data: null});
        },

        request: function() {
            if (this.config.poll && this.poller === null) {
                this.poller = new PeriodicalExecuter(this.request.bind(this), this.config.pollInterval);
            }
            var cache = CACHE.get(this.UID);
            var now = new Date();

            if (this.config.cache && cache.last !== null && now.compareTo(cache.last) < this.config.lifetime * 1000) {
                this.update(cache.data, true);
            } else {
                this.retrieve();
            }
        },

        stop: function() {
            if (this.poller !== null) {
                this.poller.stop();
                this.poller = null;
            }
        },

        update: function(data, fromCache) {
            var cache = CACHE.get(this.UID);
            if (!fromCache) {
                cache.last = new Date();
                cache.data = this.parse(data);
            }

            this.config.process(cache.data);
        },

        retrieve: function() {
            switch (this.type) {
                case jplex.common.DataSource.TYPE_ARRAY:
                    this.update(this.source, false);
                    break;
                case jplex.common.DataSource.TYPE_JSON:
                    var callback_json = this.update.bind(this);
                    new Ajax.Request(this.source, {
                        parameters: this.config.parameters,

                        onComplete: function(transport) {
                            if (transport.responseJSON === null) {
                                transport.responseJSON = transport.responseText.evalJSON();
                            }
                            if (transport.responseJSON !== null) {
                                callback_json(transport.responseJSON, false);
                            } else {
                                // throw some stuff
                            }
                        }
                    });
                    break;
                case jplex.common.DataSource.TYPE_XML:
                    var callback_xml = this.update.bind(this);
                    new Ajax.Request(this.source, {
                        parameters: this.config.parameters,

                        onComplete: function(transport) {
                            callback_xml(transport.responseXML, false);
                        }
                    });
                    break;
                case jplex.common.DataSource.TYPE_FUNCTION:
                    this.update(this.source(), false);
                    break;
                default:
                    throw {
                        name: "UnknownDataSourceType",
                        messsage: "'" + this.type + "' is not a supported DataSource type."
                    };
            }
        },

        parse: function(data) {
            var res;
            var DS = jplex.common.DataSource;
            switch (this.type) {
                case DS.TYPE_ARRAY:
                case DS.TYPE_FUNCTION:
                case DS.TYPE_JSON:
                          
                    res = $A();

                    if (this.config.parser !== null) {
                        res = this.config.parser(data);
                    } else {
                        var items;
                        if(this.type == DS.TYPE_JSON) {
                            items = eval("data" + (this.schema.root.charAt(0) == '[' ? "" : ".") + this.schema.root);
                        } else {
                            items = data;
                        }
                        items.each(function(item) {
                            var it = {};
                            if (this.schema.properties.length > 0) {
                                this.schema.properties.each(function(prop) {
                                    var path = prop.path || prop;
                                    it[prop.key || prop] = eval("item" + (path.charAt(0) == '[' ? "" : ".") + path) || null;
                                }, this);
                            } else {
                                it = item;
                            }
                            res.push(it);
                        }, this);
                    }
                    return res;
                case DS.TYPE_XML:

                    res = $A();

                    if (this.config.parser !== null) {
                        res = this.config.parser(data);
                    } else {
                        $A(data.getElementsByTagName(this.schema.item)).each(function(item) {
                            var it = {};
                            if (this.schema.properties.length > 0) {
                                this.schema.properties.each(function(prop) {
                                    var elt = {
                                        node:item,
                                        content:null
                                    };
                                    (prop.path || prop).strip().split("/").each(function(chunk) {
                                        var ch, attr = null, index = 0;
                                        if (chunk.indexOf('@') !== -1) {
                                            var parts = chunk.split('@');
                                            attr = parts[1];
                                            chunk = parts[0];
                                        }
                                        var matches = /^(.*?)\[([0-9]+)\]$/.exec(chunk);
                                        if (matches !== null) {
                                            index = parseInt(matches[2], 10);
                                            chunk = matches[1];
                                        }

                                        ch = elt.node.getElementsByTagName(chunk);

                                        if (!Object.isUndefined(ch[index])) {
                                            elt.node = ch[index];
                                            elt.content = attr === null ? elt.node.textContent :
                                                          elt.node.getAttribute(attr);
                                        } else {
                                            throw $break;
                                        }


                                    });
                                    it[prop.key || prop] = elt.content || null;
                                }, this);
                            } else {
                                it = item.textContent.strip();
                            }
                            res.push(it);
                        }, this);
                    }

                    return res;
                default:
                    throw {
                        name: "UnknownDataSourceType",
                        messsage: "'" + this.type + "' is not a supported DataSource type."
                    };
            }
        }

    };

}());

jPlex.extend("jplex.common.DataSource", {
    TYPE_ARRAY: 0,
    TYPE_JSON: 1,
    TYPE_XML: 2,
    TYPE_FUNCTION: 3

});