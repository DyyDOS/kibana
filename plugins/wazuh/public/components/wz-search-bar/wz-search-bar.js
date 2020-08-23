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
exports.WzSearchBar = void 0;
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
const react_1 = __importStar(require("react"));
const eui_suggest_1 = require("../eui-suggest");
const eui_1 = require("@elastic/eui");
const wz_search_buttons_1 = require("./wz-search-buttons");
const components_1 = require("./components");
const lib_1 = require("./lib");
function WzSearchBar(props) {
    const [inputRef, setInputRef] = react_1.useState();
    const [inputValue, setInputValue] = react_1.useState('');
    const [isOpen, setIsOpen] = react_1.useState(false);
    const [suggestsItems, handler, status, isInvalid] = useSuggestHandler(props, inputValue, setInputValue, inputRef, setIsOpen);
    return (react_1.default.createElement(eui_1.EuiFlexGroup, null,
        react_1.default.createElement(eui_1.EuiFlexItem, null,
            react_1.default.createElement(eui_suggest_1.EuiSuggest, { status: status, inputRef: setInputRef, prepend: react_1.default.createElement(components_1.WzSearchBadges, { filters: props.filters, onFiltersChange: props.onFiltersChange }), value: inputValue, onKeyPress: event => handler && handler.onKeyPress(inputValue, event), onItemClick: (item) => handler && handler.onItemClick(item, inputValue), isPopoverOpen: isOpen, onClosePopover: () => setIsOpen(false), onPopoverFocus: () => setIsOpen(true), suggestions: suggestsItems, onInputChange: setInputValue, isInvalid: isInvalid, placeholder: props.placeholder })),
        !!props.buttonOptions &&
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(wz_search_buttons_1.WzSearchButtons, { filters: props.filters, options: props.buttonOptions, onChange: (filters) => props.onFiltersChange(filters) }))));
}
exports.WzSearchBar = WzSearchBar;
function useSuggestHandler(props, inputValue, setInputValue, inputRef, setIsOpen) {
    const [handler, setHandler] = react_1.useState();
    const [suggestsItems, setSuggestItems] = react_1.useState([]);
    const [status, setStatus] = react_1.useState('unchanged');
    const [isInvalid, setInvalid] = react_1.useState(false);
    react_1.useEffect(() => {
        setHandler(new lib_1.SuggestHandler({ ...props, status, setStatus, setInvalid, setIsOpen }, setInputValue));
        !props.noDeleteFiltersOnUpdateSuggests && props.onFiltersChange([]);
    }, [props.suggestions]);
    react_1.useEffect(() => { handler && (handler.inputRef = inputRef); }, [inputRef]);
    react_1.useEffect(() => {
        handler && handler.buildSuggestItems(inputValue)
            .then(setSuggestItems)
            .catch((e) => { e !== 'New request in progress' && console.log(e); });
    }, [inputValue, handler]);
    react_1.useEffect(() => {
        handler && (handler.filters = props.filters);
    }, [props.filters]);
    return [suggestsItems, handler, status, isInvalid];
}
