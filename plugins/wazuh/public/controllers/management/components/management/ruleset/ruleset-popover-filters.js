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
/*
 * Wazuh app - React component for show filter list.
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
const react_redux_1 = require("react-redux");
const eui_1 = require("@elastic/eui");
class WzPopoverFilters extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPopoverOpen: false
        };
        this.filters = {
            rules: [
                { label: 'File', value: 'file' }, { label: 'Path', value: 'path' }, { label: 'Level', value: 'level' },
                { label: 'Group', value: 'group' }, { label: 'PCI control', value: 'pci' }, { label: 'GDPR', value: 'gdpr' }, { label: 'HIPAA', value: 'hipaa' }, { label: 'NIST-800-53', value: 'nist-800-53' }, { label: 'TSC', value: 'tsc' }
            ],
            decoders: [
                { label: 'File', value: 'file' }, { label: 'Path', value: 'path' }
            ]
        };
    }
    onButtonClick() {
        this.setState({
            isPopoverOpen: !this.state['isPopoverOpen'],
        });
    }
    closePopover() {
        this.setState({
            isPopoverOpen: false,
        });
    }
    render() {
        const { section } = this.props['state'];
        const button = (react_1.default.createElement(eui_1.EuiButton, { fill: true, style: { padding: 12 }, color: 'primary', onClick: () => this.onButtonClick(), iconType: "logstashFilter", "aria-label": "Filter" }, "Filters"));
        return (react_1.default.createElement(eui_1.EuiFlexItem, { grow: false, style: { marginLeft: 0 } },
            react_1.default.createElement(eui_1.EuiPopover, { id: "trapFocus", ownFocus: true, button: button, isOpen: this.state['isPopoverOpen'], anchorPosition: "downRight", closePopover: this.closePopover.bind(this) }, this.filters[section].map((filter, idx) => (react_1.default.createElement("div", { key: idx },
                react_1.default.createElement(eui_1.EuiButtonEmpty, { size: "s", iconSide: 'right', 
                    // TODO: Add the logic to applyFilters
                    onClick: () => null }, filter.label)))))));
    }
}
const mapStateToProps = (state) => {
    return {
        state: state.rulesetReducers,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {};
};
exports.default = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(WzPopoverFilters);
