/**
 * angular-ui-utils-validation - Validation directive taken from angular-ui-utils but modified to not remove model
 * properties on invalid input data.
 * version v0.0.4 - 2013-08-01
 * @link http://angular-ui.github.com
 * @license MIT License, http://www.opensource.org/licenses/MIT .
 */

(function(document, window, navigator) {
    'use strict';

    /**
     * General-purpose validator for ngModel.
     * angular.js comes with several built-in validation mechanism for input fields (ngRequired, ngPattern etc.)
     * but using an arbitrary validation function requires creation of a custom formatters and / or parsers.
     * The x-validate directive makes it easy to use any function(s) defined in scope as a validator function(s).
     * A validator function will trigger validation on both model and input changes.
     *
     * example <input x-validate=" 'myValidatorFunction($value)' ">
     * example <input x-validate="{ foo : '$value > anotherModel', bar : 'validateFoo($value)' }">
     * example <input x-validate="{ foo : '$value > anotherModel' }" x-validate-watch=" 'anotherModel' ">
     * example <input x-validate="{ foo : '$value > anotherModel', bar : 'validateFoo($value)' }"
     * x-validate-watch=" { foo : 'anotherModel' } ">
     *
     * @param {string|Object} x-validate If strings is passed it should be a scope's function to be used
     * as a validator.
     * If an object literal is passed a key denotes a validation error key while a value should be a validator function.
     * In both cases validator function should take a value to validate as its argument and should return true/false
     * indicating a validation result.
     */
    angular.module('myApp.validation', []).directive('validate', function($injector) {

        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                var validators = {},
                    validateExpr, injectValidateExpression;

                function applyWatch(watch)
                {
                    //string - update all validators on expression change
                    if (angular.isString(watch))
                    {
                        scope.$watch(watch, function() {
                            angular.forEach(validators, function(validatorFn) {
                                validatorFn(ctrl.$modelValue);
                            });
                        });
                        return;
                    }

                    //array - update all validators on change of any expression
                    if (angular.isArray(watch))
                    {
                        angular.forEach(watch, function(expression) {
                            scope.$watch(expression, function()
                            {
                                angular.forEach(validators, function(validatorFn) {
                                    validatorFn(ctrl.$modelValue);
                                });
                            });
                        });
                        return;
                    }

                    //object - update appropriate validator
                    if (angular.isObject(watch))
                    {
                        angular.forEach(watch, function(expression, validatorKey)
                        {
                            //value is string - look after one expression
                            if (angular.isString(expression))
                            {
                                scope.$watch(expression, function() {
                                    validators[validatorKey](ctrl.$modelValue);
                                });
                            }

                            //value is array - look after all expressions in array
                            if (angular.isArray(expression))
                            {
                                angular.forEach(expression, function(intExpression)
                                {
                                    scope.$watch(intExpression, function() {
                                        validators[validatorKey](ctrl.$modelValue);
                                    });
                                });
                            }
                        });
                    }
                }

                function parseValidateExpression(validateExpr, defaultName) {
                    var result;

                    if (!validateExpr) { return;}

                    if (angular.isString(validateExpr)) {
                        result = {};
                        result[defaultName] = validateExpr;
                    } else {
                        result = validateExpr;
                    }

                    return result;
                }

                validateExpr = parseValidateExpression(scope.$eval(attrs.validate), 'validator');

                angular.forEach(validateExpr, function(exprssn, key) {
                    var validateFn = function(valueToValidate) {
                        var expression = scope.$eval(exprssn, { '$value' : valueToValidate });
                        if (angular.isObject(expression) && angular.isFunction(expression.then)) {
                            // expression is a promise
                            expression.then(function() {
                                ctrl.$setValidity(key, true);
                            }, function() {
                                ctrl.$setValidity(key, false);
                            });
                            return valueToValidate;
                        } else if (expression) {
                            // expression is true
                            ctrl.$setValidity(key, true);
                            return valueToValidate;
                        } else {
                            // expression is false
                            ctrl.$setValidity(key, false);
//                          return undefined;
                            return valueToValidate;
                        }
                    };
                    validators[key] = validateFn;
                    ctrl.$formatters.push(validateFn);
                    ctrl.$parsers.push(validateFn);
                });

                // Support for x-inject-validate
                injectValidateExpression = parseValidateExpression(scope.$eval(attrs.injectValidate),
                    'injectedValidator');

                if (_.isUndefined(injectValidateExpression) && attrs.injectValidate) {
                    logger.error('Invalid validate expression: ' + attrs.injectValidate);
                }

                angular.forEach(injectValidateExpression, function(injectValidatorStr, key) {
                    var injectValidator = $injector.get(injectValidatorStr),
                        parameters = {};

                    if (_.isUndefined(injectValidator)) {
                        logger.error('Could not find validator class: ' + injectValidatorStr);
                        return;
                    }

                    injectValidator.getParametersList = injectValidator.getParametersList || function() {};

                    _.each(injectValidator.getParametersList(), function(item) {
                        var attrKey = injectValidatorStr[0].toLowerCase() + injectValidatorStr.slice(1) +
                            item[0].toUpperCase() + item.slice(1);

                        attrs.$observe(attrKey, function(val) {
                            parameters[item] = val;
                            validateFn(ctrl.$modelValue);
                        });

                        parameters[item] = attrs[attrKey];
                    });

                    function validateFn(valueToValidate) {
                        ctrl.$setValidity(key, injectValidator.test(valueToValidate, parameters, scope));
                        return valueToValidate;
                    }

                    validators[key] = validateFn;
                    ctrl.$formatters.push(validateFn);
                    ctrl.$parsers.push(validateFn);
                });

                // Support for x-validate-watch
                if (attrs.validateWatch) {
                    applyWatch(scope.$eval(attrs.validateWatch));
                }
            }
        };
    });
})(document, window, navigator);
