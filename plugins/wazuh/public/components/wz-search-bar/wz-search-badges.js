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
exports.WzSearchBadges = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
const q_interpreter_1 = require("./lib/q-interpreter");
const wz_search_badges_1 = require("./components/wz-search-badges");
require("./src/style/wz-search-badges.less");
const eui_2 = require("@elastic/eui");
const eui_3 = require("@elastic/eui");
const eui_4 = require("@elastic/eui");
class WzSearchBadges extends react_1.Component {
    constructor(props) {
        super(props);
        this.buildBadge = (filter, index) => {
            const { searchFormat } = this.props;
            // if (filter.field === 'q') {
            //   return searchFormat !== '?Q' ? this.buildQBadges(filter) : null;
            // }
            return (react_1.default.createElement(eui_4.EuiFlexItem, null,
                react_1.default.createElement(eui_1.EuiBadge, { key: index, iconType: "cross", iconSide: "right", iconOnClickAriaLabel: "Remove", color: "hollow", iconOnClick: () => this.onDeleteFilter(filter) },
                    react_1.default.createElement(eui_2.EuiButtonEmpty, { color: 'text', size: "xs" }, `${filter.field}: ${filter.value}`))));
        };
        this.buildBadge.bind(this);
    }
    shouldComponentUpdate(nextProps) {
        if (nextProps.filters.length !== this.props.filters.length) {
            return true;
        }
        return false;
    }
    idGenerator() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }
    buildQBadges(filter) {
        const qInterpreter = new q_interpreter_1.QInterpreter(filter.value);
        const qBadges = qInterpreter.queryObjects.map((qFilter, index) => (this.buildQBadge(qInterpreter, index, qFilter)));
        return qBadges;
    }
    buildQBadge(qInterpreter, index, qFilter) {
        const { qSuggests } = this.props;
        return react_1.default.createElement(eui_1.EuiBadge, { className: "wz-search-badge", key: index, iconType: "cross", iconSide: "right", color: "hollow", iconOnClickAriaLabel: "Remove", iconOnClick: () => { this.deleteFilter(qInterpreter, index); } },
            react_1.default.createElement(wz_search_badges_1.ContextMenu, { qFilter: qFilter, index: index, qInterpreter: qInterpreter, deleteFilter: () => this.deleteFilter(qInterpreter, index), changeConjuntion: () => this.changeConjuntion(qInterpreter, index), invertOperator: () => this.invertOperator(qInterpreter, index), updateFilters: () => this.updateFilters(qInterpreter), qSuggest: qSuggests.find(item => item.label === qFilter.field) }));
    }
    updateFilters(qInterpreter) {
        const filters = {
            ...this.filtersToObject(),
            q: qInterpreter.toString(),
        };
        this.props.onChange(filters);
    }
    deleteFilter(qInterpreter, index) {
        qInterpreter.deleteByIndex(index);
        if (qInterpreter.qNumber() > 0) {
            const filters = {
                ...this.filtersToObject(),
                q: qInterpreter.toString()
            };
            this.props.onChange(filters);
        }
        else {
            this.onDeleteFilter({ field: 'q', value: '' });
        }
    }
    changeConjuntion(qInterpreter, index) {
        const oldQuery = qInterpreter.getQuery(index);
        const newQuery = {
            ...oldQuery,
            conjuntion: oldQuery.conjuntion === ';' ? ',' : ';',
        };
        qInterpreter.editByIndex(index, newQuery);
        const filters = {
            ...this.filtersToObject(),
            q: qInterpreter.toString(),
        };
        this.props.onChange(filters);
    }
    invertOperator(qInterpreter, index) {
        const oldQuery = qInterpreter.getQuery(index);
        let newOperator = '=';
        switch (oldQuery.operator) {
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
        const newQuery = {
            ...oldQuery,
            //@ts-ignore
            operator: newOperator,
        };
        qInterpreter.editByIndex(index, newQuery);
        const filters = {
            ...this.filtersToObject(),
            q: qInterpreter.toString(),
        };
        this.props.onChange(filters);
    }
    filtersToObject() {
        const filters = {};
        for (const f of this.props.filters) {
            filters[f.field] = f.value;
        }
        return filters;
    }
    onDeleteFilter(filter) {
        const filters = this.filtersToObject();
        delete filters[filter.field];
        this.props.onChange(filters);
    }
    render() {
        const { filters } = this.props;
        const badges = filters.map(this.buildBadge);
        return (react_1.default.createElement(eui_4.EuiFlexItem, { grow: false, "data-testid": "search-badges" },
            react_1.default.createElement(eui_3.EuiFlexGroup, null, badges)));
    }
}
exports.WzSearchBadges = WzSearchBadges;
