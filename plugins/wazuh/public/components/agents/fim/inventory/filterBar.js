"use strict";
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
exports.FilterBar = void 0;
/*
 * Wazuh app - Integrity monitoring components
 * Copyright (C) 2015-2020 Wazuh, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
const react_1 = __importStar(require("react"));
const lib_1 = require("./lib");
const wz_search_bar_1 = require("../../../../components/wz-search-bar");
const eui_1 = require("@elastic/eui");
class FilterBar extends react_1.Component {
    constructor() {
        super(...arguments);
        // TODO: Change the type
        this.suggestions = {
            files: [
                { type: 'q', label: 'file', description: "Name of the file", operators: ['=', '!=', '~'], values: async (value) => lib_1.getFilterValues('file', value, this.props.agent.id, { type: 'file' }) },
                ...(((this.props.agent || {}).os || {}).platform !== 'windows' ? [{ type: 'q', label: 'perm', description: "Permisions of the file", operators: ['=', '!=', '~'], values: async (value) => lib_1.getFilterValues('perm', value, this.props.agent.id) }] : []),
                { type: 'q', label: 'mtime', description: "Date the file was modified", operators: ['=', '!=', '>', '<'], values: async (value) => lib_1.getFilterValues('mtime', value, this.props.agent.id) },
                { type: 'q', label: 'date', description: "Date of registration of the event", operators: ['=', '!=', '>', '<'], values: async (value) => lib_1.getFilterValues('date', value, this.props.agent.id) },
                { type: 'q', label: 'uname', description: "Owner of the file", operators: ['=', '!=', '~'], values: async (value) => lib_1.getFilterValues('uname', value, this.props.agent.id) },
                { type: 'q', label: 'uid', description: "Id of the onwner file", operators: ['=', '!=', '~'], values: async (value) => lib_1.getFilterValues('uid', value, this.props.agent.id) },
                ...(((this.props.agent || {}).os || {}).platform !== 'windows' ? [{ type: 'q', label: 'gname', description: "Name of the group owner file", operators: ['=', '!=', '~'], values: async (value) => lib_1.getFilterValues('gname', value, this.props.agent.id) }] : []),
                ...(((this.props.agent || {}).os || {}).platform !== 'windows' ? [{ type: 'q', label: 'gid', description: "Id of the group owner", operators: ['=', '!=', '~'], values: async (value) => lib_1.getFilterValues('gid', value, this.props.agent.id) }] : []),
                { type: 'q', label: 'md5', description: "md5 hash", operators: ['=', '!=', '~'], values: async (value) => lib_1.getFilterValues('md5', value, this.props.agent.id) },
                { type: 'q', label: 'sha1', description: "sha1 hash", operators: ['=', '!=', '~'], values: async (value) => lib_1.getFilterValues('sha1', value, this.props.agent.id) },
                { type: 'q', label: 'sha256', description: "sha256 hash", operators: ['=', '!=', '~'], values: async (value) => lib_1.getFilterValues('sha256', value, this.props.agent.id) },
                ...(((this.props.agent || {}).os || {}).platform !== 'windows' ? [{ type: 'q', label: 'inode', description: "Inode of the file", operators: ['=', '!=', '~'], values: async (value) => lib_1.getFilterValues('inode', value, this.props.agent.id) }] : []),
                { type: 'q', label: 'size', description: "Size of the file in Bytes", values: value => !!value ? [value] : [0] },
            ],
            registry: [
                { type: 'q', label: 'file', description: "Name of the registry", operators: ['=', '!=', '~'], values: async (value) => lib_1.getFilterValues('file', value, this.props.agent.id, { type: 'registry' }) },
            ]
        };
    }
    render() {
        const { onFiltersChange, selectView, filters } = this.props;
        return (react_1.default.createElement(eui_1.EuiFlexGroup, null,
            react_1.default.createElement(eui_1.EuiFlexItem, null,
                react_1.default.createElement(wz_search_bar_1.WzSearchBar, { noDeleteFiltersOnUpdateSuggests: true, filters: filters, onFiltersChange: onFiltersChange, suggestions: this.suggestions[selectView], placeholder: 'Add filter or search' }))));
    }
}
exports.FilterBar = FilterBar;
