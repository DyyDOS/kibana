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
exports.QTagsHandler = void 0;
const base_handler_1 = require("./base-handler");
const q_interpreter_1 = require("./q-interpreter");
class QTagsHandler extends base_handler_1.BaseHandler {
    constructor(qSuggests) {
        super();
        this.operators = {
            '=': 'Equal',
            '!=': 'Not equal',
            '>': 'Bigger',
            '<': 'Smaller',
            '~': 'Like',
        };
        this.CreateSuggestOperator = (operator) => {
            return {
                type: { iconType: 'kqlOperand', color: 'tint1' },
                label: operator,
                description: this.operators[operator]
            };
        };
        this.qSuggests = qSuggests;
        this.inputStage = 'fields';
    }
    //#region Build suggests elements
    async buildSuggestItems(inputValue) {
        this.isSearch = false;
        if (this.inputStage === 'fields' || inputValue === '') {
            this.isSearch = inputValue.length >= 0;
            return this.buildSuggestFields(inputValue);
        }
        else if (this.inputStage === 'operators') {
            return this.buildSuggestOperators(inputValue);
        }
        else if (this.inputStage === 'values') {
            return await this.buildSuggestValues(inputValue);
        }
        return this.buildSuggestFields(inputValue);
    }
    buildSuggestFields(inputValue) {
        const { field } = this.getLastQuery(inputValue);
        const fields = this.qSuggests
            .filter((item) => this.filterSuggestFields(item, field))
            .map(this.mapSuggestFields);
        return fields;
    }
    buildSuggestOperators(inputValue) {
        const { operators = false } = this.getCurrentField(inputValue);
        const operatorsAllow = operators
            ? operators
            : [...Object.keys(this.operators)];
        const suggestions = operatorsAllow.map(this.CreateSuggestOperator);
        return suggestions;
    }
    async buildSuggestValues(inputValue) {
        const { values } = this.getCurrentField(inputValue);
        const { value } = this.getLastQuery(inputValue);
        const rawSuggestions = typeof values === 'function'
            ? await values(value)
            : values;
        //@ts-ignore
        const filterSuggestions = rawSuggestions.filter(item => this.filterSuggestValues(item, value));
        const suggestions = [];
        for (const value of filterSuggestions) {
            const item = this.buildSuggestValue(value);
            suggestions.push(item);
        }
        return suggestions;
    }
    //#endregion
    getLastQuery(inputValue) {
        const qInterpreter = new q_interpreter_1.QInterpreter(inputValue);
        return qInterpreter.lastQuery();
    }
    getCurrentField(inputValue) {
        const { field } = this.getLastQuery(inputValue);
        const currentField = this.qSuggests.find(item => item.label === field);
        if (currentField) {
            return currentField;
        }
        else {
            throw Error('Error when try to get the current suggest element');
        }
    }
    //#region Events
    onItemClick(item, inputValue, currentFilters) {
        const filters = {
            ...currentFilters,
        };
        const qInterpreter = new q_interpreter_1.QInterpreter(inputValue);
        switch (item.type.iconType) {
            case 'kqlField':
                qInterpreter.setlastQuery(item.label);
                this.inputStage = 'operators';
                break;
            case 'kqlOperand':
                qInterpreter.setlastQuery(item.label);
                this.inputStage = 'values';
                break;
            case 'kqlValue':
                qInterpreter.setlastQuery(item.label);
                filters['q'] = !filters['q']
                    ? qInterpreter.toString()
                    : `${filters['q']};${qInterpreter.toString()}`;
                qInterpreter.cleanQuery();
                this.inputStage = 'fields';
                break;
        }
        return {
            inputValue: qInterpreter.toString(),
            filters
        };
    }
    onInputChange(inputValue, currentFilters) {
        const filters = { ...currentFilters };
        const { field, value = false } = this.getLastQuery(inputValue);
        let isInvalid = false;
        if (value !== false) {
            const fieldExist = this.qSuggests.find(item => item.label === field);
            if (fieldExist) {
                this.inputStage = 'values',
                    isInvalid = false;
            }
            else {
                isInvalid = true;
            }
        }
        else {
            this.inputStage = 'fields';
            isInvalid = false;
        }
        return { isInvalid, filters };
    }
    onKeyPress(inputValue, currentFilters) {
        if (this.inputStage !== 'values') {
            return { inputValue, filters: currentFilters };
        }
        const qInterpreter = new q_interpreter_1.QInterpreter(inputValue);
        const filters = {
            ...currentFilters,
            q: !currentFilters['q']
                ? qInterpreter.toString()
                : `${currentFilters['q']};${qInterpreter.toString()}`
        };
        this.inputStage = 'fields';
        return { inputValue: '', filters };
    }
}
exports.QTagsHandler = QTagsHandler;
