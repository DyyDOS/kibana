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
exports.CheckUpgrade = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
const wz_request_1 = require("../../../react-services/wz-request");
class CheckUpgrade extends react_1.Component {
    constructor(props) {
        super(props);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.upgrading !== this.props.upgrading) {
            if (this.props.upgrading === true)
                this.interval = setInterval(() => this.checkUpgrade(this.props.id), 3000);
        }
    }
    checkUpgrade(agentId) {
        wz_request_1.WzRequest.apiReq('GET', `/agents/${agentId}/upgrade_result`, {}).then(value => {
            if (value.status === 200) {
                this.props.changeStatusUpdate(agentId);
                this.props.reloadAgent();
                clearInterval(this.interval);
                console.log(`${this.props.id} agente termina intervalo`);
            }
        })
            .catch((error) => {
            console.log(error);
        });
    }
    ;
    addUpgraingProgress() {
        const { id, version, upgrading, managerVersion } = this.props;
        if (version === '.' || version === managerVersion) {
            return;
        }
        else if (upgrading === true) {
            /* this.interval = setInterval(() => this.checkUpgrade(id), 30000); */
            return (react_1.default.createElement(eui_1.EuiToolTip, { content: "This agent is being updated.", position: "right" },
                react_1.default.createElement(eui_1.EuiLoadingSpinner, { size: "s" })));
        }
    }
    ;
    render() {
        const { version } = this.props;
        let upgrading = this.addUpgraingProgress();
        return (react_1.default.createElement("div", null,
            version,
            "\u00A0",
            upgrading));
    }
}
exports.CheckUpgrade = CheckUpgrade;
