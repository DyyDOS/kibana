"use strict";
/*
 * Wazuh app - React Component to cut text strings of several elements that exceed a certain number of length.
 *
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
exports.AgentGroupTruncate = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
class AgentGroupTruncate extends react_1.default.Component {
    constructor(props) {
        super(props);
        this._isMount = false;
        this.state = {
            groups: ''
        };
    }
    renderGroups(groups) {
        const { length } = this.props;
        let auxGroups = [];
        let tooltipGroups = [];
        let auxLength = 0;
        let auxIndex = 0;
        if (groups.length >= 2 && groups.toString().length >= length) {
            groups.map((group, index) => {
                auxLength = auxLength + group.length;
                if (auxLength >= length) {
                    tooltipGroups.push(`${group}${index === (groups.length - 1) ? '' : ', '}`);
                    ++auxIndex;
                }
                else {
                    auxGroups.push(`${group}${index === (groups.length - 1) ? '' : ', '}`);
                }
            });
        }
        else {
            groups.map((group, index) => {
                auxGroups.push(`${group}${index === (groups.length - 1) ? '' : ', '}`);
            });
        }
        return (react_1.default.createElement("div", { style: { display: 'inline' } },
            auxGroups,
            auxIndex > 0 &&
                react_1.default.createElement(eui_1.EuiToolTip, { key: auxIndex, content: tooltipGroups },
                    react_1.default.createElement(eui_1.EuiLink, { style: { textDecoration: 'none' } },
                        "\u00A0",
                        `+${auxIndex} ${this.props.label}`))));
    }
    render() {
        const groups = this.renderGroups(this.props.groups);
        return (react_1.default.createElement(react_1.Fragment, null, groups));
    }
}
exports.AgentGroupTruncate = AgentGroupTruncate;
