"use strict";
/*
 * Wazuh app - React component for show search and filter
 * Copyright (C) 2015-2020 Wazuh, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuggestHandler = void 0;
const _1 = require("./");
class SuggestHandler extends _1.BaseHandler {
    constructor(props, setInputValue) {
        super();
        this.status = 'unchanged';
        this.operators = {
            '=': 'Equal',
            '!=': 'Not equal',
            '>': 'Bigger',
            '<': 'Smaller',
            '~': 'Like',
            ':': 'Equals',
        };
        this.combine = (...args) => (input) => args.reduceRight((acc, arg) => acc = arg(acc), input);
        this.someItem = (queryElement, key) => this.suggestItems.some(item => item[key] === queryElement);
        this.findItem = (queryElement, key) => this.suggestItems.find(item => item[key] === queryElement);
        this.checkType = (input) => {
            const operator = /:|=|!=|~|<|>/.exec(input);
            this.searchType = operator
                ? operator[0] === ':' ? 'params' : 'q'
                : 'search';
            return input;
        };
        this.checkStage = (input) => {
            const { searchType } = this;
            if (searchType === 'search') {
                this.inputStage = 'field';
                return { field: input };
            }
            else if (searchType === 'params') {
                this.inputStage = 'value';
                const { 0: field, 1: value, 2: operator = ':' } = input.split(':');
                return { field, value, operator };
            }
            else if (searchType === 'q') {
                const qInterpreter = new _1.QInterpreter(input);
                const { conjuntion, field, operator, value } = qInterpreter.lastQuery();
                if (!!conjuntion && !field) {
                    this.inputStage = !operator ? 'field' : 'value';
                }
                else if (!!operator) {
                    this.inputStage = 'value';
                }
                else {
                    this.inputStage = 'field';
                }
                return { conjuntion, field, operator, value };
            }
            return input;
        };
        this.checkQuery = async (query) => {
            try {
                const { inputStage, lastCall, searchType } = this;
                const { field = '', value = '', operator } = query;
                if ((operator && !this.someItem(field, 'label')))
                    throw { error: 'Invalid field', message: `The field '${field}' is not valid` };
                //@ts-ignore
                if (operator && ((searchType === 'params' && operator !== ':') || (searchType === 'q' && operator === ':')))
                    throw { error: 'Invalid operator', message: `The operator '${operator}' is not valid` };
                const suggestions = [
                    ...this.buildSuggestSearch(field),
                    ...(value && inputStage === 'value' ? this.buildSuggestApply() : []),
                    ...(value && inputStage === 'value' ? this.buildSuggestConjuntions(field) : []),
                    ...((this.someItem(field, 'label') && inputStage !== 'value') ? this.buildSuggestOperator(field) : []),
                    ...(inputStage === 'field' ? this.buildSuggestFields(field) : []),
                    ...(inputStage === 'value' ? await this.buildSuggestValues(field, value) : [])
                ];
                if (lastCall === this.lastCall) {
                    this.lastCall++;
                    return { suggestions };
                }
            }
            catch (error) {
                return { error };
            }
            throw "New request in progress";
        };
        this.checkErrors = async (promise) => {
            const { suggestions = [], error } = await promise;
            if (!error)
                return suggestions;
            return [{
                    label: error.error,
                    type: { iconType: 'alert', color: 'tint2' },
                    ...(!!error.message && { description: error.message })
                }];
        };
        this.buildSuggestItems = this.combine(this.checkErrors, this.checkQuery, this.checkStage, this.checkType);
        this.props = props;
        this.filters = props.filters;
        this.inputStage = 'field';
        this.setInputValue = setInputValue;
        this.suggestItems = props.suggestions;
        this.searchType = 'search';
        this.lastCall = 0;
    }
    buildSuggestSearch(inputValue) {
        const { searchDisable } = this.props;
        if (!searchDisable && this.searchType === 'search') {
            return [{
                    label: inputValue,
                    type: { iconType: 'search', color: 'tint8' },
                    description: 'Search',
                }];
        }
        return [];
    }
    buildSuggestApply() {
        return [{
                label: 'Apply filter',
                type: { iconType: 'kqlFunction', color: 'tint5' },
                description: 'Click here or press "Enter" to apply the filter',
            }];
    }
    buildSuggestFields(inputValue) {
        return this.suggestItems
            .filter(item => item.label.includes(inputValue))
            .map(this.mapSuggestFields);
    }
    buildSuggestOperator(inputValue) {
        const { operators } = this;
        const operatorSuggest = op => ({
            label: op,
            description: operators[op],
            type: { iconType: 'kqlOperand', color: 'tint1' }
        });
        const item = this.findItem(inputValue, 'label');
        if (item && item.type === 'params') {
            return [operatorSuggest(':')];
        }
        else {
            const ops = (item || {}).operators || Object.keys(operators);
            return ops
                .filter(op => op !== ':').map(operatorSuggest);
        }
    }
    async buildSuggestValues(field, value) {
        const item = this.findItem(field, 'label');
        const rawSuggestions = (item && typeof item.values === 'function')
            ? await this.getFunctionValues(item, value)
            : (item || {}).values;
        const suggestions = rawSuggestions.map(this.buildSuggestValue);
        return suggestions;
    }
    buildSuggestConjuntions(inputValue) {
        if (this.searchType !== 'q')
            return [];
        const suggestions = [
            { 'label': 'AND ', 'description': 'Requires `both arguments` to be true' },
            { 'label': 'OR ', 'description': 'Requires `one or more arguments` to be true' }
        ].map((item) => {
            return {
                type: { iconType: 'kqlSelector', color: 'tint3' },
                label: item.label,
                description: item.description
            };
        });
        return suggestions;
    }
    async getFunctionValues(item, value) {
        const { setStatus } = this.props;
        this.status = 'loading';
        setStatus('loading');
        const values = await item.values(value);
        this.status = 'unchanged';
        setStatus('unchanged');
        return values;
    }
    createParamFilter(field, value) {
        const filters = [...this.filters];
        const idx = filters.findIndex(filter => filter.field === field);
        idx !== -1
            ? filters[idx].value = value
            : filters.push({ field: field, value });
        this.props.onFiltersChange(filters);
        this.setInputValue('');
        this.props.setIsOpen(false);
        this.inputRef.blur();
    }
    createQFilter(inputValue) {
        const qInterpreter = new _1.QInterpreter(inputValue);
        if (qInterpreter.queryObjects.some(q => !q.value))
            return;
        const value = qInterpreter.toString();
        const filters = [
            ...this.filters,
            { field: 'q', value }
        ];
        this.props.onFiltersChange(filters);
        this.setInputValue('');
        this.props.setIsOpen(false);
        this.inputRef.blur();
    }
    onItemClick(item, inputValue) {
        if (this.status === 'loading')
            return;
        switch (item.type.iconType) {
            case 'search':
                inputValue && this.createParamFilter('search', item.label);
                return;
            case 'kqlField':
                this.searchType = (this.suggestItems.find(e => e.label === item.label) || { type: 'params' }).type;
                if (this.searchType === 'params') {
                    this.setInputValue(`${item.label}:`);
                }
                else {
                    const qInterpreter = new _1.QInterpreter(inputValue);
                    qInterpreter.setlastQuery(item.label, 'field');
                    this.setInputValue(qInterpreter.toString());
                }
                break;
            case 'kqlOperand':
                this.setInputValue(`${inputValue}${item.label}`);
                break;
            case 'kqlValue':
                if (this.searchType === 'params') {
                    const { 0: field } = inputValue.split(':');
                    this.createParamFilter(field, item.label);
                    return;
                }
                else {
                    const qInterpreter = new _1.QInterpreter(inputValue);
                    qInterpreter.setlastQuery(item.label, 'value');
                    this.setInputValue(qInterpreter.toString());
                }
                break;
            case 'kqlSelector':
                const qInterpreter = new _1.QInterpreter(inputValue);
                qInterpreter.addNewQuery(item.label);
                this.setInputValue(qInterpreter.toString());
                break;
            case 'kqlFunction':
                if (this.searchType === 'q') {
                    this.createQFilter(inputValue);
                    return;
                }
                else if (this.searchType === 'params') {
                    const { 0: field, 1: value } = inputValue.split(':');
                    this.createParamFilter(field, value);
                    return;
                }
                break;
        }
        this.inputRef.focus();
    }
    onKeyPress(inputValue, event) {
        if (event.key !== 'Enter' || !inputValue)
            return;
        const { inputStage, searchType } = this;
        if (searchType === 'search') {
            this.createParamFilter('search', inputValue);
        }
        if (inputStage !== 'value')
            return;
        if (searchType === 'params') {
            const { 0: field, 1: value } = inputValue.split(':');
            if (!!value)
                this.createParamFilter(field, value);
        }
        if (searchType === 'q') {
            this.createQFilter(inputValue);
        }
    }
}
exports.SuggestHandler = SuggestHandler;
