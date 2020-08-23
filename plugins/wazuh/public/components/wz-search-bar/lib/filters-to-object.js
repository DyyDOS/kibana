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
exports.filtersToObject = void 0;
function buildQFilter(oldQ, newQ) {
    const parsedQ = newQ.replace(/ and | or /gi, parseConjuntions);
    return `${!!oldQ ? `${oldQ};` : ''}${parsedQ}`;
}
const parseConjuntions = (arg) => ((/ and /gi.test(arg)) ? ';' : ',');
function filtersToObject(filters) {
    return filters.reduce((acc, filter) => {
        const { field, value } = filter;
        if (field === 'q') {
            return {
                ...acc,
                q: buildQFilter(acc['q'], value),
            };
        }
        const newAcc = {
            ...acc,
            [field]: value,
        };
        return newAcc;
    }, {});
}
exports.filtersToObject = filtersToObject;
