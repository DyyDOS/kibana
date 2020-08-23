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
exports.BaseHandler = void 0;
class BaseHandler {
    async buildSuggestItems(inputValue) {
        return [];
    }
    buildSuggestFields(inputValue) {
        return [];
    }
    ;
    async buildSuggestValues(inputValue, value = '') {
        return [];
    }
    buildSuggestValue(value) {
        return {
            type: { iconType: 'kqlValue', color: 'tint0' },
            label: typeof value !== 'string' ? value.toString() : value,
        };
    }
    filterSuggestFields(item, field = '') {
        return item.label.includes(field);
    }
    filterSuggestValues(item, inputValue) {
        if (typeof item === 'number' && !!inputValue) {
            // @ts-ignore
            return item == inputValue;
        }
        else if (!!inputValue) {
            // @ts-ignore
            return item.includes(inputValue);
        }
        return true;
    }
    onItemClick(item, inputValue, filters) { }
    onInputChange(inputValue, currentFilters) { return { isInvalid: true, filters: {} }; }
    onKeyPress(inputValue, currentFilters) { }
    mapSuggestFields(item) {
        const suggestItem = {
            type: {
                iconType: 'kqlField',
                color: 'tint4'
            },
            label: item.label,
        };
        if (item.description) {
            suggestItem['description'] = item.description;
        }
        return suggestItem;
    }
}
exports.BaseHandler = BaseHandler;
