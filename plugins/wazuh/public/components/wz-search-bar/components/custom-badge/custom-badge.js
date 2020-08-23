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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomBadge = void 0;
const react_1 = __importStar(require("react"));
const __1 = require("../");
const q_interpreter_1 = require("../../lib/q-interpreter");
const eui_1 = require("@elastic/eui");
function CustomBadge(props) {
    const { badge, index, onChangeCustomBadges, customBadges, qSuggests } = props;
    const qInterpreter = new q_interpreter_1.QInterpreter(badge.value);
    const [filter, setFilter] = react_1.useState(qInterpreter.lastQuery());
    react_1.useEffect(() => {
        const { conjuntion = '', field, operator, value } = filter;
        const newBadge = {
            ...badge,
            value: `${conjuntion}${field}${operator}${value}`
        };
        const newBadges = [...(customBadges || [])];
        newBadges[index] = newBadge;
        onChangeCustomBadges(newBadges);
    }, [filter]);
    addOrRemoveConjuntion(filter, setFilter, props);
    return (react_1.default.createElement(eui_1.EuiBadge, { className: "wz-search-badge", iconType: "cross", iconSide: "right", color: "hollow", iconOnClickAriaLabel: "Remove", iconOnClick: () => deleteBadge(props) },
        react_1.default.createElement(__1.ContextMenu, { qFilter: filter, index: index, qInterpreter: qInterpreter, deleteFilter: () => deleteBadge(props), changeConjuntion: () => changeConjution(filter, setFilter), invertOperator: () => invertOperator(filter, setFilter), updateFilters: (args) => setFilter(args), qSuggest: qSuggests.find(item => item.label === filter.field) })));
}
exports.CustomBadge = CustomBadge;
function addOrRemoveConjuntion(filter, setFilter, props) {
    const { index, filters, } = props;
    if (filter.conjuntion) {
        const { field, operator, value } = filter;
        (!index && !filters['q']) && setFilter({ field, operator, value });
    }
    else {
        (index || filters['q']) &&
            setFilter({ ...filter, conjuntion: ' AND ' });
    }
}
function changeConjution(filter, setFilter) {
    const newFilter = {
        ...filter,
        conjuntion: filter.conjuntion === ' AND ' ? ' OR ' : ' AND ',
    };
    setFilter(newFilter);
}
function invertOperator(filter, setFilter) {
    let newOperator;
    switch (filter.operator) {
        case '!=':
            newOperator = '=';
            break;
        case '=':
            newOperator = '!=';
            break;
        case '<':
            newOperator = '>';
            break;
        case '>':
            newOperator = '<';
            break;
        case '~':
            newOperator = '~';
            break;
    }
    const newFilter = {
        ...filter,
        operator: newOperator
    };
    setFilter(newFilter);
}
function deleteBadge(props) {
    const { index, onChangeCustomBadges, customBadges: oldCustomBadges } = props;
    const customBadges = [...oldCustomBadges];
    customBadges.splice(index, 1);
    onChangeCustomBadges(customBadges);
}
