/*
      Author: Blake McBride
 */

/* global Utils, Component */

'use strict';

(function () {
    let processor = (elm, attr, content) => {
        let nstyle;
        let hasFor = false;

        if (attr.style)
            nstyle = attr.style;
        else
            nstyle = '';

        let nattrs = '';
        let id;

        for (let prop in attr) {
            switch (prop) {
                case 'style':
                    break;  // already dealing with this
                case 'id':
                    id = Utils.removeQuotes(attr[prop]);
                    break;
                case 'for':
                    hasFor = true;
                    // no break
                default:
                    nattrs += ' ' + prop + '="' + attr[prop] + '"';
                    break;
            }
        }

        let newElm;
        if (hasFor)
            newElm = Utils.replaceHTML(id, elm, `<label style="{style}" {attr} id="{id}">${content ? content.trim() : ''}</label>`, {
                style: nstyle,
                attr: nattrs
            });
        else
            newElm = Utils.replaceHTML(id, elm, `<span style="{style}" {attr} id="{id}">${content ? content.trim() : ''}</span>`, {
                style: nstyle,
                attr: nattrs
            });

        var jqObj = newElm.jqObj;

        newElm.getValue = function () {
            var sval = jqObj.text();
            return sval ? sval : '';
        };

        newElm.setValue = function (val) {
            if (val !== 0  &&  !val) {
                jqObj.text('');
                return this;
            }
            jqObj.text(val);
            return this;
        };

        newElm.clear = function () {
            jqObj.text('');
            return this;
        };

        //--

        newElm.hide = function () {
            jqObj.hide();
            return this;
        };

        newElm.show = function () {
            jqObj.show();
            return this;
        };

        newElm.isHidden = function () {
            return jqObj.is(':hidden');
        };

        newElm.isVisible = function () {
            return jqObj.is(':visible');
        };
    };

    var componentInfo = {
        name: 'TextLabel',
        tag: 'text-label',
        processor: processor
    };
    Utils.newComponent(componentInfo);

    Component.TextLabel.$textlabel = function (elm) {
        var val = elm.value.replace(/^\s+/, "");
        return val;
    };
})();
