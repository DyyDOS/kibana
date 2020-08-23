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
exports.RequirementFlyout = void 0;
/*
 * Wazuh app - Compliance flyout component
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
const eui_1 = require("@elastic/eui");
const discover_1 = require("../../../../common/modules/discover");
const app_state_1 = require("../../../../../react-services/app-state");
const requirement_goal_1 = require("../../requirement-goal");
class RequirementFlyout extends react_1.Component {
    constructor(props) {
        super(props);
        this._isMount = false;
        this.updateTotalHits = (total) => {
            this.setState({ totalHits: total });
        };
        this.state = {};
    }
    componentDidMount() {
        this._isMount = true;
    }
    renderHeader() {
        const { currentRequirement } = this.props;
        return (react_1.default.createElement(eui_1.EuiFlyoutHeader, { hasBorder: true, style: { padding: "12px 16px" } }, (!currentRequirement && (react_1.default.createElement("div", null,
            react_1.default.createElement(eui_1.EuiLoadingContent, { lines: 1 })))) || (react_1.default.createElement(eui_1.EuiTitle, { size: "m" },
            react_1.default.createElement("h2", { id: "flyoutSmallTitle" },
                "Requirement  ",
                currentRequirement)))));
    }
    renderBody() {
        const { currentRequirement } = this.props;
        const requirementImplicitFilter = {};
        const isCluster = (app_state_1.AppState.getClusterInfo() || {}).status === "enabled";
        const clusterFilter = isCluster
            ? { "cluster.name": app_state_1.AppState.getClusterInfo().cluster }
            : { "manager.name": app_state_1.AppState.getClusterInfo().manager };
        this.clusterFilter = clusterFilter;
        requirementImplicitFilter[this.props.getRequirementKey()] = currentRequirement;
        const implicitFilters = [requirementImplicitFilter, this.clusterFilter];
        if (this.props.implicitFilters) {
            this.props.implicitFilters.forEach(item => implicitFilters.push(item));
        }
        //Goal for PCI
        const currentReq = this.props.currentRequirement.split(".")[0];
        return (react_1.default.createElement(eui_1.EuiFlyoutBody, { className: "flyout-body" },
            react_1.default.createElement(eui_1.EuiAccordion, { id: "details", buttonContent: react_1.default.createElement(eui_1.EuiTitle, { size: "s" },
                    react_1.default.createElement("h3", null, "Details")), paddingSize: "xs", initialIsOpen: true },
                react_1.default.createElement("div", { className: 'flyout-row details-row' },
                    react_1.default.createElement(eui_1.EuiSpacer, { size: "xs" }),
                    requirement_goal_1.requirementGoal[currentReq] && react_1.default.createElement(eui_1.EuiFlexGroup, { style: { marginBottom: 10 } },
                        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                            react_1.default.createElement(eui_1.EuiIcon, { size: "l", type: "bullseye", color: 'primary', style: { marginTop: 8 } })),
                        react_1.default.createElement(eui_1.EuiFlexItem, { style: { marginLeft: 2 }, grow: true },
                            react_1.default.createElement(eui_1.EuiText, { style: { marginLeft: 8, fontSize: 14 } },
                                react_1.default.createElement("p", { style: { fontWeight: 500, marginBottom: 2 } }, "Goals"),
                                react_1.default.createElement("p", null, requirement_goal_1.requirementGoal[currentReq])))),
                    react_1.default.createElement(eui_1.EuiFlexGroup, null,
                        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                            react_1.default.createElement(eui_1.EuiIcon, { size: "l", type: "filebeatApp", color: 'primary', style: { marginTop: 8 } })),
                        react_1.default.createElement(eui_1.EuiFlexItem, { style: { marginLeft: 2 }, grow: true },
                            react_1.default.createElement(eui_1.EuiText, { style: { marginLeft: 8, fontSize: 14 } },
                                react_1.default.createElement("p", { style: { fontWeight: 500, marginBottom: 2 } }, "Requirement description"),
                                react_1.default.createElement("p", null, this.props.description)))),
                    react_1.default.createElement(eui_1.EuiSpacer, { size: "xs" }))),
            react_1.default.createElement(eui_1.EuiSpacer, { size: 's' }),
            react_1.default.createElement(eui_1.EuiAccordion, { style: { textDecoration: 'none' }, id: "recent_events", className: 'events-accordion', extraAction: react_1.default.createElement("div", { style: { marginBottom: 5 } },
                    react_1.default.createElement("strong", null, this.state.totalHits || 0),
                    " hits"), buttonContent: react_1.default.createElement(eui_1.EuiTitle, { size: "s" },
                    react_1.default.createElement("h3", null,
                        "Recent events",
                        this.props.view !== 'events' && (react_1.default.createElement("span", { style: { marginLeft: 16 } },
                            react_1.default.createElement("span", null,
                                react_1.default.createElement(eui_1.EuiToolTip, { position: "top", content: "Show " + currentRequirement + " in Dashboard" },
                                    react_1.default.createElement(eui_1.EuiIcon, { onMouseDown: (e) => { this.props.openDashboard(e, currentRequirement); e.stopPropagation(); }, color: "primary", type: "visualizeApp", style: { marginRight: '10px' } })),
                                react_1.default.createElement(eui_1.EuiToolTip, { position: "top", content: "Inspect " + currentRequirement + " in Events" },
                                    react_1.default.createElement(eui_1.EuiIcon, { onMouseDown: (e) => { this.props.openDiscover(e, currentRequirement); e.stopPropagation(); }, color: "primary", type: "discoverApp" }))))))), paddingSize: "none", initialIsOpen: true },
                react_1.default.createElement(eui_1.EuiFlexGroup, { className: "flyout-row" },
                    react_1.default.createElement(eui_1.EuiFlexItem, null,
                        react_1.default.createElement(discover_1.Discover, { initialColumns: ["icon", "timestamp", this.props.getRequirementKey(), 'rule.level', 'rule.id', 'rule.description'], implicitFilters: implicitFilters, initialFilters: [], updateTotalHits: (total) => this.updateTotalHits(total) }))))));
    }
    renderLoading() {
        return (react_1.default.createElement(eui_1.EuiFlyoutBody, null,
            react_1.default.createElement(eui_1.EuiLoadingContent, { lines: 2 }),
            react_1.default.createElement(eui_1.EuiLoadingContent, { lines: 3 })));
    }
    render() {
        const { currentRequirement } = this.props;
        const { onChangeFlyout } = this.props;
        return (react_1.default.createElement(eui_1.EuiFlyout, { onClose: () => onChangeFlyout(false), maxWidth: "60%", size: "l", className: "flyout-no-overlap", "aria-labelledby": "flyoutSmallTitle" },
            currentRequirement &&
                this.renderHeader(),
            this.renderBody(),
            this.state.loading &&
                this.renderLoading()));
    }
}
exports.RequirementFlyout = RequirementFlyout;
