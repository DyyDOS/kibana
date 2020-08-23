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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WzSearchFormatSelector = void 0;
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
const prop_types_1 = __importDefault(require("prop-types"));
const eui_1 = require("@elastic/eui");
class WzSearchFormatSelector extends react_1.Component {
    constructor(props) {
        super(props);
        this.qLegend = (react_1.default.createElement("div", null,
            react_1.default.createElement("p", null, "The ?Q filter offers a simplified query syntax to get data of the Wazuh"),
            react_1.default.createElement("a", { href: "https://documentation.wazuh.com/current/user-manual/api/queries.html", target: "_blank" }, "?Q filter documentation")));
        this.apiLegend = (react_1.default.createElement("div", null,
            react_1.default.createElement("p", null, "Use the parameters of the Wazuh API to filter the data output, check our documentation for more info"),
            react_1.default.createElement("a", { href: "https://documentation.wazuh.com/current/user-manual/api/reference.html", target: "_blank" }, "API Reference")));
        this.onToggleChange = optionId => {
            const newSelectedOption = this.getLabelButtonSelected(optionId);
            this.setState({
                toggleIdSelected: newSelectedOption,
            });
            this.props.onChange((newSelectedOption || {}).label);
        };
        const { qFilterEnabled, apiFilterEnabled } = props;
        this.toggleButtons = this.initToggleButtons(qFilterEnabled, apiFilterEnabled);
        const toggleIndex = props.format === '?Q' ? 0 : 1;
        this.state = {
            isPopoverOpen: false,
            toggleIdSelected: this.toggleButtons[toggleIndex],
        };
    }
    initToggleButtons(qEnable, apiEnable) {
        const makeId = () => {
            const id = Math.random().toString(36).slice(-8);
            return /^\d/.test(id) ? 'x' + id : id;
        };
        const idPrefix = makeId();
        const toggleButtons = [];
        if (qEnable) {
            toggleButtons.push({
                id: `${idPrefix}0`,
                label: '?Q',
            });
        }
        else {
            toggleButtons.push({});
        }
        if (apiEnable) {
            toggleButtons.push({
                id: `${idPrefix}1`,
                label: 'API',
            });
        }
        else {
            toggleButtons.push({});
        }
        return toggleButtons;
    }
    onButtonClick() {
        this.setState({
            isPopoverOpen: !this.state.isPopoverOpen,
        });
    }
    closePopover() {
        this.setState({
            isPopoverOpen: false,
        });
    }
    getLabelButtonSelected(optionId) {
        const toggleIdSelected = this.toggleButtons.find((item) => { return item.id == optionId; });
        return toggleIdSelected;
    }
    renderFooter() {
        const { toggleIdSelected } = this.state;
        if (this.toggleButtons.length <= 1) {
            return null;
        }
        return (react_1.default.createElement(eui_1.EuiPopoverFooter, null,
            react_1.default.createElement(eui_1.EuiButtonGroup, { legend: "This is a basic group", color: 'primary', options: this.toggleButtons, idSelected: toggleIdSelected.id, onChange: this.onToggleChange })));
    }
    render() {
        const { toggleIdSelected } = this.state;
        const { apiFilterEnabled, qFilterEnabled } = this.props;
        const button = (react_1.default.createElement(eui_1.EuiButtonEmpty, { onClick: this.onButtonClick.bind(this) }, "Help"));
        const renderFooter = (qFilterEnabled && apiFilterEnabled)
            ? this.renderFooter()
            : null;
        return (react_1.default.createElement(eui_1.EuiPopover, { id: 'wzFormatSelector', ownFocus: true, button: button, isOpen: this.state.isPopoverOpen, closePopover: this.closePopover.bind(this) },
            react_1.default.createElement(eui_1.EuiPopoverTitle, null, "Help"),
            react_1.default.createElement("div", { style: { width: '300px' } },
                react_1.default.createElement(eui_1.EuiText, null, (toggleIdSelected.label === '?Q')
                    ? this.qLegend
                    : this.apiLegend)),
            renderFooter));
    }
}
exports.WzSearchFormatSelector = WzSearchFormatSelector;
WzSearchFormatSelector.propTypes = {
    onChange: prop_types_1.default.func,
};
