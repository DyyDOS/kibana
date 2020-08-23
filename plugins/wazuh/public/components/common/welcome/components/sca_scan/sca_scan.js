"use strict";
/*
 * Wazuh app - React component information about last SCA scan.
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScaScan = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const chrome_1 = __importDefault(require("ui/chrome"));
const store_1 = __importDefault(require("../../../../../redux/store"));
const appStateActions_1 = require("../../../../../redux/actions/appStateActions");
const wz_request_1 = require("../../../../../react-services/wz-request");
class ScaScan extends react_1.Component {
    constructor(props) {
        super(props);
        this._isMount = false;
        this.state = {
            lastScan: {},
            isLoading: true,
        };
    }
    async componentDidMount() {
        this._isMount = true;
        const $injector = await chrome_1.default.dangerouslyGetActiveInjector();
        this.router = $injector.get('$route');
        this.getLastScan(this.props.agent.id);
    }
    async getLastScan(agentId) {
        const scans = await wz_request_1.WzRequest.apiReq('GET', `/sca/${agentId}?sort=-end_scan`, { limit: 1 });
        this._isMount &&
            this.setState({
                lastScan: (((scans.data || {}).data || {}).items || {})[0],
                isLoading: false,
            });
    }
    durationScan() {
        const { lastScan } = this.state;
        const start_scan = moment_timezone_1.default(lastScan.start_scan);
        const end_scan = moment_timezone_1.default(lastScan.end_scan);
        let diff = start_scan.diff(end_scan);
        let duration = moment_timezone_1.default.duration(diff);
        let auxDuration = Math.floor(duration.asHours()) + moment_timezone_1.default.utc(diff).format(":mm:ss");
        return auxDuration === '0:00:00' ? '< 1s' : auxDuration;
    }
    renderLoadingStatus() {
        const { isLoading } = this.state;
        if (!isLoading) {
            return;
        }
        else {
            return (react_1.default.createElement(eui_1.EuiFlexGroup, { justifyContent: "center", alignItems: "center" },
                react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                    react_1.default.createElement("div", { style: { display: 'block', textAlign: "center", paddingTop: 100 } },
                        react_1.default.createElement(eui_1.EuiLoadingChart, { size: "xl" })))));
        }
    }
    renderScanDetails() {
        const { isLoading, lastScan } = this.state;
        if (isLoading || lastScan === undefined)
            return;
        return (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(eui_1.EuiFlexGroup, null,
                react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                    react_1.default.createElement(eui_1.EuiTitle, { size: "s" },
                        react_1.default.createElement(eui_1.EuiLink, { onClick: () => {
                                window.location.href = `#/overview?tab=sca&redirectPolicy=${lastScan.policy_id}`;
                                store_1.default.dispatch(appStateActions_1.updateCurrentAgentData(this.props.agent));
                                this.router.reload();
                            } },
                            react_1.default.createElement("h3", null, lastScan.name)))),
                react_1.default.createElement(eui_1.EuiFlexItem, { grow: false, style: { marginTop: 15 } },
                    react_1.default.createElement(eui_1.EuiBadge, { color: "secondary" }, lastScan.policy_id))),
            react_1.default.createElement(eui_1.EuiFlexGroup, null,
                react_1.default.createElement(eui_1.EuiFlexItem, null,
                    react_1.default.createElement(eui_1.EuiText, { size: 's' },
                        react_1.default.createElement("p", null, lastScan.description)))),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "l" }),
            react_1.default.createElement(eui_1.EuiFlexGroup, null,
                react_1.default.createElement(eui_1.EuiFlexItem, null,
                    react_1.default.createElement(eui_1.EuiStat, { title: lastScan.pass, titleSize: "m", textAlign: "center", description: "Pass", titleColor: "secondary" })),
                react_1.default.createElement(eui_1.EuiFlexItem, null,
                    react_1.default.createElement(eui_1.EuiStat, { title: lastScan.fail, titleSize: "m", textAlign: "center", description: "Fail", titleColor: "danger" })),
                react_1.default.createElement(eui_1.EuiFlexItem, null,
                    react_1.default.createElement(eui_1.EuiStat, { title: lastScan.total_checks, titleSize: "m", textAlign: "center", description: "Total checks" })),
                react_1.default.createElement(eui_1.EuiFlexItem, null,
                    react_1.default.createElement(eui_1.EuiStat, { title: `${lastScan.score}%`, titleSize: "m", textAlign: "center", description: "Score" }))),
            react_1.default.createElement(eui_1.EuiSpacer, { size: 'l' }),
            react_1.default.createElement(eui_1.EuiFlexGroup, null,
                react_1.default.createElement(eui_1.EuiFlexItem, { grow: false, style: { marginTop: 15 } },
                    react_1.default.createElement(eui_1.EuiText, null,
                        react_1.default.createElement(eui_1.EuiIcon, { type: "calendar", color: 'primary' }),
                        " Start time: ",
                        lastScan.start_scan)),
                react_1.default.createElement(eui_1.EuiFlexItem, { grow: false, style: { marginTop: 15 } },
                    react_1.default.createElement(eui_1.EuiText, null,
                        react_1.default.createElement(eui_1.EuiIcon, { type: "clock", color: 'primary' }),
                        " Duration: ",
                        this.durationScan())))));
    }
    renderEmptyPrompt() {
        const { isLoading } = this.state;
        if (isLoading)
            return;
        return (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(eui_1.EuiEmptyPrompt, { iconType: "visVega", title: react_1.default.createElement("h4", null, "You dont have SCA scans in this agent."), body: react_1.default.createElement(react_1.Fragment, null,
                    react_1.default.createElement("p", null, "Check your agent settings to generate scans.")) })));
    }
    render() {
        const { lastScan } = this.state;
        const loading = this.renderLoadingStatus();
        const scaScan = this.renderScanDetails();
        const emptyPrompt = this.renderEmptyPrompt();
        return (react_1.default.createElement(eui_1.EuiFlexItem, null,
            react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "m" },
                react_1.default.createElement(eui_1.EuiText, { size: "xs" },
                    react_1.default.createElement(eui_1.EuiFlexGroup, null,
                        react_1.default.createElement(eui_1.EuiFlexItem, null,
                            react_1.default.createElement("h2", null, "SCA: Last scan")),
                        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                            react_1.default.createElement(eui_1.EuiToolTip, { position: "top", content: "Open SCA Scans" },
                                react_1.default.createElement(eui_1.EuiButtonIcon, { iconType: "popout", color: "primary", onClick: () => {
                                        window.location.href = `#/overview?tab=sca`;
                                        store_1.default.dispatch(appStateActions_1.updateCurrentAgentData(this.props.agent));
                                        this.router.reload();
                                    }, "aria-label": "Open SCA Scans" }))))),
                lastScan === undefined && emptyPrompt,
                loading,
                scaScan)));
    }
}
exports.ScaScan = ScaScan;
