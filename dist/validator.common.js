'use strict';

const __assign = Object.assign || function (target) {
    for (var source, i = 1; i < arguments.length; i++) {
        source = arguments[i];
        for (var prop in source) {
            if (Object.prototype.hasOwnProperty.call(source, prop)) {
                target[prop] = source[prop];
            }
        }
    }
    return target;
};

var DirectiveParamParser = /** @class */ (function () {
    function DirectiveParamParser(_a) {
        var modifiers = _a.modifiers, value = _a.value, data = _a.data;
        this.setVModelKey(data);
        this.setDirectiveValue({ value: value });
        this.setModifiersObj({ modifiers: modifiers });
        this.setRules();
        this.setOptions();
    }
    DirectiveParamParser.prototype.setDirectiveValue = function (_a) {
        var value = _a.value;
        this.directiveValue = value || {};
    };
    DirectiveParamParser.prototype.setModifiersObj = function (_a) {
        var modifiers = _a.modifiers;
        var obj = {};
        for (var key in modifiers) {
            var keys = key.split(DirectiveParamParser.modifiersSplitter);
            obj[keys[0]] = keys[1] === undefined ? modifiers[key] : keys[1];
        }
        this.modifiersObj = obj;
    };
    DirectiveParamParser.prototype.setRules = function () {
        var directiveValue = this.directiveValue;
        var rules; // [{rule: 'required', message: ''}]
        if (Array.isArray(directiveValue)) {
            rules = directiveValue;
        }
        else if (Array.isArray(directiveValue.rules)) {
            rules = directiveValue.rules;
        }
        else {
            rules = [directiveValue]; // {rule: 'required', message: ''}
        }
        this.rules = this.formatRules(rules);
    };
    DirectiveParamParser.prototype.formatRules = function (rules) {
        return rules.map(function (item) {
            var rule = item.rule, message = item.message, trigger = item.trigger;
            var _rule = {
                key: '',
                modifies: {},
                message: {},
                trigger: trigger
            };
            if (typeof rule === 'string') {
                var ruleSplits = rule.split('.');
                _rule.key = ruleSplits[0].split(/\s*:\s*/)[0];
                if (ruleSplits.length <= 1) {
                    _rule.modifies = ruleSplits[0].split(/\s*:\s*/)[1];
                }
                else {
                    ruleSplits.map(function (item) {
                        var itemSplits = item.split(/\s*:\s*/);
                        _rule.modifies[itemSplits[0]] = itemSplits[1] === undefined ? true : itemSplits[1];
                    });
                }
            }
            else if (toString.call(rule) === '[object Object]') {
                _rule.key = Object.keys(rule)[0];
                _rule.modifies = rule[_rule.key];
            }
            else {
                _rule.key = rule;
            }
            _rule.modifies = __assign({}, _rule.modifies, item);
            _rule.message = message; // TODO merge error message
            return _rule;
        });
    };
    DirectiveParamParser.prototype.setOptions = function () {
        var _a = this, directiveValue = _a.directiveValue, modifiersObj = _a.modifiersObj, rules = _a.rules;
        var options = modifiersObj;
        options.rules = rules;
        if (!Array.isArray(directiveValue)) {
            options = __assign({}, options, directiveValue);
        }
        this.options = options;
    };
    DirectiveParamParser.prototype.setVModelKey = function (data) {
        var vModel;
        if (data.model) {
            vModel = data.model;
        }
        else {
            vModel = data.directives.filter(function (item) { return item.name === 'model'; })[0];
        }
        if (!vModel)
            throw 'smart validator: v-model not found';
        this.vModelKey = vModel.expression;
    };
    DirectiveParamParser.modifiersSplitter = '@';
    return DirectiveParamParser;
}());

/**
 * 判断值是否为空，定义为空的情况为：
 * 1. null
 * 2. undefined
 * 3. 空数组: []
 * 4. 只包含空格或者空字符串: ''或'  '
 * 5. 空对象：{}, 不考虑原型上的属性
 * @param val
 * @returns {boolean}
 */
function isEmpty(val) {
    if (val === undefined || val === null)
        return true;
    if (Array.isArray(val))
        return val.length <= 0;
    if (typeof val === 'string')
        return val.trim() === '';
    if (JSON.stringify(val) === '{}')
        return true;
    return false;
}
function isNullOrUndefined(val) {
    return val === null || val === undefined;
}

function required(value) {
    return !isEmpty(value);
}
var url = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
var email = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
function length(value, _a) {
    if (value === void 0) { value = ''; }
    var val = _a.val, max = _a.max, min = _a.min;
    if (val !== undefined) {
        if (value.length !== val)
            return false;
    }
    if (max !== undefined) {
        if (value.length > max)
            return false;
    }
    if (min !== undefined) {
        if (value.length < min)
            return false;
    }
    return true;
}
function number(value, _a) {
    var max = _a.max, min = _a.min, integer = _a.integer, float = _a.float, positive = _a.positive, negative = _a.negative;
    if (!/^[+-]?\d+(\.\d+)?$/.test(value))
        return false;
    if (max !== undefined) {
        if (+value > +max)
            return false;
    }
    if (min !== undefined) {
        if (+value < +min)
            return false;
    }
    if (integer !== undefined) {
        if (/\./.test(value))
            return false;
    }
    if (float !== undefined) {
        if (!/\./.test(value))
            return false;
    }
    if (positive !== undefined) {
        if (+value <= 0)
            return false;
    }
    if (negative !== undefined) {
        if (+value >= 0)
            return false;
    }
    return true;
}
function equal(value, args) {
    return value == args.value;
}
function notEqual(value, args) {
    return value != args.value;
}



var rules = Object.freeze({
	required: required,
	url: url,
	email: email,
	length: length,
	number: number,
	equal: equal,
	notEqual: notEqual
});

var messages = {
    required: '必填',
    url: '链接格式错误',
    email: '邮箱格式不合法',
    length: '长度不合法',
    number: '数字不合法',
    equal: '必须和某值相等',
    notEqual: '不能和某值相等'
};

var Options = /** @class */ (function () {
    function Options() {
        this.defaults = {
            trigger: 'change',
            rules: rules,
            messages: messages,
            appendErrorTip: false
        };
        this.global = {};
        this.local = {};
    }
    Options.getInstance = function () {
        return Options.instance;
    };
    Options.prototype.setGlobal = function (option) {
        if (option === void 0) { option = {}; }
        this.global = option;
    };
    Options.prototype.setLocal = function (option) {
        if (option === void 0) { option = {}; }
        this.local = option;
    };
    Options.prototype.resetLocal = function () {
        this.local = isEmpty(this.global) ? this.defaults : this.global;
    };
    Options.prototype.getOptions = function (directiveOptions) {
        var _a = this, defaults = _a.defaults, global = _a.global, local = _a.local;
        var options = {};
        Object.keys(defaults).map(function (key) {
            var defaultVal = defaults[key];
            var globalVal = global[key];
            var localVal = local[key];
            if (toString.call(defaultVal) === '[object Object]') {
                options[key] = __assign({}, defaultVal, (globalVal || {}), (localVal || {}));
            }
            else {
                options[key] = defaultVal;
                if (!isNullOrUndefined(localVal)) {
                    options[key] = localVal;
                }
                else if (!isNullOrUndefined(globalVal)) {
                    options[key] = globalVal;
                }
            }
        });
        if (directiveOptions) {
            Object.keys(directiveOptions).map(function (key) {
                if (key === 'rules')
                    return;
                var val = directiveOptions[key];
                if (toString.call(val) === '[object Object]') {
                    options[key] = __assign({}, options[key], val);
                }
                else {
                    options[key] = val;
                }
            });
        }
        return options;
    };
    Options.instance = new Options();
    return Options;
}());

var Rule = /** @class */ (function () {
    function Rule() {
    }
    Rule.getRule = function (key) {
        var rules = Options.getInstance().getOptions().rules;
        var rule;
        if (toString.call(key) === '[object String]') {
            rule = rules[key];
            if (rule === undefined) {
                console.error("smart validator: rule " + key + " do snot exists");
            }
        }
        else {
            rule = key;
        }
        switch (toString.call(rule)) {
            case '[object String]':
                return function (val) {
                    return val === rule;
                };
            case '[object RegExp]':
                return function (value) {
                    return rule.test(value);
                };
            case '[object Function]':
                return rule;
        }
    };
    return Rule;
}());

/**
 * @param expression 表达式 eg: a + b
 * @param scope eval函数执行上下文 eg: {a: 1, b: 2}
 * @returns {any}  表达式返回值 eg: 3
 */
var scopedEval = function (expression, scope) {
    var keys = Object.keys(scope);
    var values = keys.map(function (key) { return scope[key]; });
    return Function.apply(void 0, keys.concat(["return " + expression])).apply(scope, values);
};

function isEditableFormEl(el) {
    return ['input', 'select', 'textarea'].indexOf(el.tagName.toLowerCase()) >= 0;
}
function onlyOneEditableFormElChild(el) {
    return el.querySelectorAll('input, select, textarea').length === 1;
}
function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
function appendErrorEl(target, message) {
    var nextEl = target.nextSibling;
    if (nextEl && nextEl.id === 'validator-error-tip') {
        nextEl.innerHTML = "" + message;
        return;
    }
    var errorEl = document.createElement('span');
    errorEl.id = 'validator-error-tip';
    errorEl.className = 'validator-error-tip';
    errorEl.innerHTML = "" + message;
    insertAfter(errorEl, target);
}
function removeErrorEl(target) {
    var nextEl = target.nextSibling;
    if (nextEl && nextEl.id === 'validator-error-tip') {
        nextEl.remove();
    }
}

var Validator = /** @class */ (function () {
    function Validator(_a) {
        var rules = _a.rules, options = _a.options, vModelKey = _a.vModelKey, context = _a.context, errorEl = _a.errorEl, targetEl = _a.targetEl;
        this.validators = [];
        this.targetEl = targetEl;
        this.errorEl = errorEl;
        this.vModelKey = vModelKey;
        this.context = context;
        this.options = options;
        this.setValidators({ rules: rules, options: options });
    }
    Validator.prototype.setValidators = function (_a) {
        var rules = _a.rules, options = _a.options;
        this.validators = [];
        var _b = this, validators = _b.validators;
        rules.map(function (_a, index) {
            var key = _a.key, modifies = _a.modifies, message = _a.message, trigger = _a.trigger;
            var rule = Rule.getRule(key);
            if (!rule)
                return console.error("smart validator: rule '" + key + "' do not exists");
            var _trigger = trigger || options.trigger || Options.getInstance().getOptions().trigger;
            if (toString.call(key) === '[object String]') {
                message = message || Options.getInstance().getOptions().messages[key];
            }
            validators.push({
                index: index,
                key: typeof key === 'string' ? key : undefined,
                check: (function (message) {
                    return function (modelValue) {
                        if (!rule(modelValue, modifies))
                            return message || 'message not set';
                    };
                })(message),
                trigger: _trigger
            });
        });
    };
    Validator.prototype.getExistsTriggers = function () {
        var triggerObj = {};
        this.validators.map(function (item) { return triggerObj[item.trigger] = true; });
        return Object.keys(triggerObj);
    };
    Validator.prototype.check = function (_a) {
        var trigger = _a.trigger;
        var _b = this, validators = _b.validators, context = _b.context, errorEl = _b.errorEl, vModelKey = _b.vModelKey;
        var modelValue = scopedEval(vModelKey, context);
        for (var _i = 0, validators_1 = validators; _i < validators_1.length; _i++) {
            var validator = validators_1[_i];
            if (trigger) {
                (validator.trigger === trigger) && (validator.errorMessage = validator.check(modelValue));
            }
            else {
                validator.errorMessage = validator.check(modelValue);
            }
        }
        var message = this.firstError();
        var options = Options.getInstance().getOptions(this.options);
        if (message) {
            errorEl.classList.add('validator-has-error');
            errorEl.setAttribute('data-validator-error', message);
            if (options.appendErrorTip) {
                appendErrorEl(errorEl, message);
            }
        }
        else {
            errorEl.classList.remove('validator-has-error');
            errorEl.removeAttribute('data-validator-error');
            removeErrorEl(errorEl);
        }
        context.$forceUpdate();
        return this;
    };
    Validator.prototype.getError = function () {
        var error = {};
        this.validators.filter(function (_a) {
            var errorMessage = _a.errorMessage;
            return errorMessage;
        }).map(function (_a) {
            var index = _a.index, key = _a.key, errorMessage = _a.errorMessage;
            if (key)
                error[key] = errorMessage;
            error[index] = errorMessage;
        });
        return error;
    };
    Validator.prototype.firstError = function () {
        var error = this.getError();
        if (isEmpty(error))
            return;
        var key = Object.keys(error).filter(function (item) { return typeof +item === 'number'; }).sort()[0];
        return error[key];
    };
    Validator.prototype.refresh = function (_a) {
        var rules = _a.rules, options = _a.options;
        this.options = options;
        this.setValidators({ rules: rules, options: options });
    };
    return Validator;
}());

var Validators = /** @class */ (function () {
    function Validators() {
        this.validators = [];
    }
    Validators.getInstance = function (uid) {
        var instance = Validators.instanceMap[uid];
        if (!instance)
            instance = Validators.instanceMap[uid] = new Validators();
        return instance;
    };
    Validators.prototype.setContext = function (context) {
        !this.context && (this.context = context);
    };
    Validators.prototype.addValidator = function (_a) {
        var validator = _a.validator, options = _a.options, vModelKey = _a.vModelKey;
        this.validators.push({
            key: options.key || vModelKey,
            group: options.group,
            validator: validator
        });
    };
    Validators.prototype.refresh = function (_a) {
        var rules = _a.rules, options = _a.options;
        this.validators.map(function (_a) {
            var validator = _a.validator;
            validator.refresh({ rules: rules, options: options });
        });
    };
    Validators.prototype.check = function (index) {
        var validators = this.validators;
        validators.map(function (_a) {
            var key = _a.key, group = _a.group, validator = _a.validator;
            if (index === undefined) {
                validator.check({});
            }
            else if (typeof index === 'string') {
                if (index === key)
                    validator.check({});
            }
            else {
                if (index.group === group)
                    validator.check({});
            }
        });
        return this;
    };
    Validators.prototype.getError = function (index) {
        var validators = this.validators;
        var error;
        validators.filter(function (_a) {
            var key = _a.key, group = _a.group;
            if (index === undefined) {
                return true;
            }
            else if (typeof index === 'string') {
                return index === key;
            }
            else {
                return index.group === group;
            }
        }).map(function (_a) {
            var key = _a.key, validator = _a.validator;
            var _error = validator.getError();
            if (typeof index === 'string') {
                error = _error;
            }
            else {
                if (!isEmpty(_error)) {
                    error = error || {};
                    error[key] = _error;
                }
            }
        });
        return error;
    };
    Validators.prototype.firstError = function (index) {
        if (index === undefined)
            throw 'smart validator: method $validator.firstError needs a param';
        var error = this.getError(index);
        if (isEmpty(error))
            return;
        var key = Object.keys(error).filter(function (item) { return typeof +item === 'number'; }).sort()[0];
        return error[key];
    };
    Validators.instanceMap = {};
    return Validators;
}());

var ErrorTrigger = /** @class */ (function () {
    function ErrorTrigger(_a) {
        var validator = _a.validator;
        this.validator = validator;
        this.checkTrigger();
    }
    ErrorTrigger.prototype.checkTrigger = function () {
        var validator = this.validator;
        var targetEl = validator.targetEl;
        var triggers = validator.getExistsTriggers();
        if (isEditableFormEl(targetEl)) {
            triggers.map(function (trigger) {
                if (trigger !== 'change' && !("on" + trigger in targetEl)) {
                    console.error("smart validator: can not register event 'on" + trigger + "' on element :");
                    console.log(targetEl);
                }
            });
        }
    };
    ErrorTrigger.prototype.register = function () {
        var validator = this.validator;
        var context = validator.context;
        var triggers = validator.getExistsTriggers();
        var targetEl = validator.targetEl;
        if (isEditableFormEl(targetEl)) {
            triggers.map(function (trigger) {
                targetEl.addEventListener(trigger, function () {
                    validator.check({ trigger: trigger });
                });
            });
        }
        else {
            var vueInstance_1 = context.$children[0];
            triggers.map(function (trigger) {
                vueInstance_1.$on(trigger, function () {
                    validator.check({ trigger: trigger });
                });
            });
            if (onlyOneEditableFormElChild(targetEl)) {
                triggers.map(function (trigger) {
                    targetEl.querySelector('input, select, textarea').addEventListener(trigger, function () {
                        validator.check({ trigger: trigger });
                    });
                });
            }
        }
    };
    ErrorTrigger.prototype.triggerChange = function () {
        var validator = this.validator;
        validator.check({ trigger: 'change' });
    };
    return ErrorTrigger;
}());

var validatorDirective = {
    bind: function (el, bindings, vnode) {
        var value = bindings.value, modifiers = bindings.modifiers;
        var context = vnode.context, data = vnode.data;
        var paramParser = new DirectiveParamParser({ modifiers: modifiers, value: value, data: data });
        var validator = new Validator({
            targetEl: el,
            errorEl: el,
            context: context,
            rules: paramParser.rules,
            options: paramParser.options,
            vModelKey: paramParser.vModelKey
        });
        var $validator = Validators.getInstance(context._uid);
        $validator.setContext(context);
        $validator.addValidator({ validator: validator, options: paramParser.options, vModelKey: paramParser.vModelKey });
        context.$validator = $validator;
        // 触发校验
        el.errorTrigger = new ErrorTrigger({ validator: validator });
        el.errorTrigger.register();
    },
    update: function (el, bindings, vnode, oldVnode) {
        var value = bindings.value, modifiers = bindings.modifiers;
        var data = vnode.data;
        var paramParser = new DirectiveParamParser({ modifiers: modifiers, value: value, data: data });
        vnode.context.$validator.refresh({
            rules: paramParser.rules,
            options: paramParser.options
        });
        var oldModal = oldVnode.data.model || oldVnode.data.directives.filter(function (item) { return item.name === 'model'; })[0];
        var newModal = vnode.data.model || vnode.data.directives.filter(function (item) { return item.name === 'model'; })[0];
        if (oldModal.value !== newModal.value) {
            el.errorTrigger.triggerChange();
        }
    },
    unbind: function (el) {
    }
};

var Index = /** @class */ (function () {
    function Index(opts) {
        var options = Options.getInstance();
        options.setGlobal(opts);
    }
    Index.prototype.install = function (Vue) {
        Vue.mixin({
            beforeCreate: function () {
                var _this = this;
                this.$validator = Validators.getInstance('default');
                this.$validator.options = function (opts) {
                    Options.getInstance().setLocal(opts);
                    _this.$validatorLocalOptionsHasSet = true;
                };
            },
            destroyed: function () {
                if (this.$validatorLocalOptionsHasSet) {
                    Options.getInstance().resetLocal();
                }
            }
        });
        Vue.directive('validator', validatorDirective);
    };
    
    
    return Index;
}());

module.exports = Index;
