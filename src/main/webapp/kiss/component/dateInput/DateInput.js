/*
      Author: Blake McBride
      Date:  4/22/18
 */

'use strict';


(function () {

    var processor = function (elm, attr, content) {

        var nstyle;
        var min = null;
        var max = null;
        var required = false;
        if (attr.style)
            nstyle = attr.style;
        else
            nstyle = '';

        var nattrs = '';
        var id;
        for (var prop in attr) {
            switch (prop) {

                // new attributes

                case 'min':
                    min = Number(utils.removeQuotes(attr[prop]).replace(/-/g, ""));
                    break;
                case 'max':
                    max = Number(utils.removeQuotes(attr[prop]).replace(/-/g, ""));
                    break;
                case 'required':
                    required = true;
                    break;

                // pre-existing attributes

                case 'style':
                    break;  // already dealing with this
                case 'id':
                    id = utils.removeQuotes(attr[prop]);
                    break;
                default:
                    nattrs += ' ' + prop + '="' + attr[prop] + '"';
                    break;
            }
        }

        var newElm = utils.replaceHTML(id, elm, '<input type="date" style="{style}" {attr} placeholder="{placeholder}" id="{id}">', {
            style: nstyle,
            attr: nattrs,
            placeholder: content
        });
        var jqObj = newElm.jqObj;

        newElm.getIntValue = function () {
            return dateutils.SQLtoInt(jqObj.val());
        };

        newElm.getSQLValue = function () {
            return jqObj.val();
        };

        newElm.getDateValue = function () {
            return dateutils.intToDate(dateutils.SQLtoInt(jqObj.val()));
        };

        newElm.setValue = function (val) {
            if (!val)
                jqObj.val('');
            else if (typeof val === 'number')
                jqObj.val(dateutils.intToSQL(val));
            else if (typeof val === 'string')
                jqObj.val(val);
            else if (typeof val === 'object')  // Date
                jqObj.val(val);
        };

        newElm.clear = function () {
            jqObj.val('');
        };

        newElm.disable = function () {
            jqObj.prop('disabled', true);
        };

        newElm.enable = function () {
            jqObj.prop('disabled', false);
        };

        newElm.hide = function () {
            jqObj.hide();
        };

        newElm.show = function () {
            jqObj.show();
        };

        newElm.focus = function () {
            jqObj.focus();
        };

        newElm.isError = function (desc) {
            var val = newElm.getIntValue();
            if (required && !val) {
                utils.showMessage('Error', desc + ' is required.', function () {
                    jqObj.focus();
                });
                return true;
            }
            if (val && (min !== null && val < min || max !== null && val > max)) {
                var msg;
                if ((min || min === 0) && (max || max === 0))
                    msg = desc + ' must be between ' + dateutils.intToStr4(min) + ' and ' + dateutils.intToStr4(max) + '.';
                else if (min && min !== 0)
                    msg = desc + ' must be greater than or equal to ' + dateutils.intToStr4(min) + '.';
                else
                    msg = desc + ' must be less than or equal to ' + dateutils.intToStr4(max) + '.';
                utils.showMessage('Error', msg, function () {
                    jqObj.focus();
                });
                return true;
            }
            return false;
        };
    };

    var componentInfo = {
        name: 'DateInput',
        tag: 'date-input',
        processor: processor
    };
    utils.newComponent(componentInfo);

})();



//# sourceURL=kiss/component/dateInput/DateInput.js
