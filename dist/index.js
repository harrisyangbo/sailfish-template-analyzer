"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var TemplateAnalyzer = /** @class */ (function () {
    function TemplateAnalyzer(sourceStr, tempStart, tempEnd) {
        this.sourceStr = sourceStr || '';
        this.tempStart = tempStart || '{{';
        this.tempEnd = tempEnd || '}}';
        this.regexp = null;
        this.replaceReg = null;
    }
    TemplateAnalyzer.prototype.createRegexp = function () {
        if (this.tempStart.length > 2 || this.tempEnd.length > 2) {
            throw new Error('开始和结束模板字符超出最大长度限制!');
        }
        if (this.tempStart.length !== this.tempEnd.length) {
            throw new Error('开始和结束模板字符长度不相等!');
        }
        // 生成正则表达式
        if (this.tempStart.length > 1 && this.tempEnd.length > 1) {
            var startArr = this.tempStart.split('');
            var endArr = this.tempEnd.split('');
            eval("this.regexp = /\\" + startArr[0] + "\\" + startArr[1] + "[\\s\\S]*" + "\\" + endArr[0] + "\\" + endArr[1] + "/g");
            eval("this.replaceReg = /^\\" + startArr[0] + "\\" + startArr[1] + "|" + "\\" + endArr[0] + "\\" + endArr[1] + "$/g");
        }
        else {
            eval("this.regexp = /\\" + this.tempStart + "[\\s\\S]*" + "\\" + this.tempEnd + "/g");
            eval("this.replaceReg = /^\\" + this.tempStart + "|" + "\\" + this.tempEnd + "$/g");
        }
        return this.regexp;
    };
    TemplateAnalyzer.prototype.matchTemplate = function () {
        // 匹配模板字符串
        var regexp = this.createRegexp();
        if (regexp !== null) {
            var matchArr = this.sourceStr.match(regexp);
            return matchArr || [];
        }
        else {
            throw new Error('没有生成有效的正则表达式!');
        }
    };
    TemplateAnalyzer.prototype.createTemplateMap = function () {
        var _this = this;
        // 生成模板字符串的map
        var matchArr = this.matchTemplate();
        if (matchArr.length <= 0)
            throw new Error('没有匹配到模板字符!');
        if (this.replaceReg === null)
            throw new Error('没有生成可用于替换的正则表达式!');
        var tempMap = {};
        matchArr.forEach(function (item) {
            if (_this.replaceReg) {
                var param = item.replace(_this.replaceReg, '');
                tempMap[param] = {
                    source: item,
                    result: null
                };
            }
        });
        return tempMap;
    };
    TemplateAnalyzer.prototype.getDataModel = function (tempStr, dataModel) {
        // 拆分要匹配的字符串并从dataModel取值
        var dataModelKeys = Object.keys(dataModel) || [];
        var fn = new (Function.bind.apply(Function, __spreadArrays([void 0], dataModelKeys, ["return " + tempStr])))();
        var args = dataModelKeys.map(function (item) {
            return dataModel[item];
        });
        try {
            return fn.apply(void 0, args);
        }
        catch (e) {
            console.error("@xes/fe-template-analyzer: 模板解析失败!");
            return tempStr;
        }
    };
    TemplateAnalyzer.prototype.getDataModelByArray = function (tempStr, dataModel) {
        // 处理通过[]的方式取值
        if (typeof tempStr === 'string' && tempStr.indexOf('\[') !== -1) {
            var matchs = tempStr.match(/\[[a-zA-Z_.\d\$]\]/g);
            var strKeys = tempStr.match(/[a-zA-Z_.\d\$]+(?=\[)/);
            if (strKeys && matchs) {
                var datas = dataModel[strKeys[0]];
                if (datas instanceof Array) {
                    var matchInde = matchs[0].match(/\d/);
                    var ind = matchInde ? ~~matchInde[0] : null;
                    return ind === 0 || ind ? datas[ind] : tempStr;
                }
            }
        }
        return dataModel[tempStr];
    };
    TemplateAnalyzer.prototype.result = function (dataModel) {
        var _this = this;
        // 结果
        var tempMap = this.createTemplateMap();
        var sourceStr = this.sourceStr;
        Object.keys(tempMap).forEach(function (item) {
            tempMap[item]['result'] = _this.getDataModel(item, dataModel);
            var tempMapRes = '';
            if (sourceStr.indexOf(tempMap[item]['source']) !== -1) {
                if (typeof tempMap[item]['result'] === 'string') {
                    tempMapRes = "'" + tempMap[item]['result'] + "'";
                }
                else {
                    tempMapRes = tempMap[item]['result'];
                }
                sourceStr = sourceStr.replace(tempMap[item]['source'], tempMapRes);
            }
        });
        try {
            var res = eval(sourceStr);
            return res;
        }
        catch (e) {
            return sourceStr;
        }
    };
    return TemplateAnalyzer;
}());
exports.default = TemplateAnalyzer;
