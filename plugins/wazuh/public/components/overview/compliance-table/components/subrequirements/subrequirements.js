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
exports.ComplianceSubrequirements = void 0;
/*
 * Wazuh app - Mitre alerts components
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
const kibana_services_1 = require("plugins/kibana/discover/kibana_services");
const app_navigate_1 = require("../../../../../react-services/app-navigate");
const requirement_flyout_1 = require("../requirement-flyout/requirement-flyout");
class ComplianceSubrequirements extends react_1.Component {
    constructor(props) {
        super(props);
        this._isMount = false;
        this.onSearchValueChange = e => {
            this.setState({ searchValue: e.target.value });
        };
        this.onChangeFlyout = (flyoutOn) => {
            this.setState({ flyoutOn });
        };
        this.state = {
            hideAlerts: false,
            searchValue: "",
        };
    }
    hideAlerts() {
        this.setState({ hideAlerts: !this.state.hideAlerts });
    }
    /**
    * Adds a new filter with format { "filter_key" : "filter_value" }, e.g. {"agent.id": "001"}
    * @param filter
    */
    addFilter(filter) {
        const { filterManager } = kibana_services_1.getServices();
        const matchPhrase = {};
        matchPhrase[filter.key] = filter.value;
        const newFilter = {
            "meta": {
                "disabled": false,
                "key": filter.key,
                "params": { "query": filter.value },
                "type": "phrase",
                "negate": filter.negate || false,
                "index": "wazuh-alerts-3.x-*"
            },
            "query": { "match_phrase": matchPhrase },
            "$state": { "store": "appState" }
        };
        filterManager.addFilters([newFilter]);
    }
    getRequirementKey() {
        if (this.props.section === 'pci') {
            return 'rule.pci_dss';
        }
        if (this.props.section === 'gdpr') {
            return 'rule.gdpr';
        }
        if (this.props.section === 'nist') {
            return 'rule.nist_800_53';
        }
        if (this.props.section === 'hipaa') {
            return 'rule.hipaa';
        }
        if (this.props.section === 'tsc') {
            return 'rule.tsc';
        }
        return "pci_dss";
    }
    openDashboardCurrentWindow(requirementId) {
        this.addFilter({ key: this.getRequirementKey(), value: requirementId, negate: false });
        this.props.onSelectedTabChanged('dashboard');
    }
    openDiscoverCurrentWindow(requirementId) {
        this.addFilter({ key: this.getRequirementKey(), value: requirementId, negate: false });
        this.props.onSelectedTabChanged('events');
    }
    openDiscover(e, requirementId) {
        const filters = {};
        filters[this.getRequirementKey()] = requirementId;
        app_navigate_1.AppNavigate.navigateToModule(e, 'overview', { "tab": this.props.section, "tabView": "discover", filters, }, () => this.openDiscoverCurrentWindow(requirementId));
    }
    openDashboard(e, requirementId) {
        const filters = {};
        filters[this.getRequirementKey()] = requirementId;
        app_navigate_1.AppNavigate.navigateToModule(e, 'overview', { "tab": this.props.section, "tabView": "panels", filters }, () => this.openDashboardCurrentWindow(requirementId));
    }
    renderFacet() {
        const { complianceObject } = this.props;
        const { requirementsCount } = this.props;
        const tacticsToRender = [];
        const showTechniques = {};
        Object.keys(complianceObject).forEach((key, inx) => {
            const currentTechniques = complianceObject[key];
            if (this.props.selectedRequirements[key]) {
                currentTechniques.forEach((technique, idx) => {
                    if (!showTechniques[technique] && ((technique.toLowerCase().includes(this.state.searchValue.toLowerCase())) || this.props.descriptions[technique].toLowerCase().includes(this.state.searchValue.toLowerCase()))) {
                        const quantity = (requirementsCount.find(item => item.key === technique) || {}).doc_count || 0;
                        if (!this.state.hideAlerts || (this.state.hideAlerts && quantity > 0)) {
                            showTechniques[technique] = true;
                            tacticsToRender.push({
                                id: technique,
                                label: `${technique} - ${this.props.descriptions[technique]}`,
                                quantity
                            });
                        }
                    }
                });
            }
        });
        const tacticsToRenderOrdered = tacticsToRender.sort((a, b) => b.quantity - a.quantity).map((item, idx) => {
            const tooltipContent = `View details of ${item.id}`;
            const toolTipAnchorClass = "wz-display-inline-grid" + (this.state.hover === item.id ? " wz-mitre-width" : " ");
            return (react_1.default.createElement(eui_1.EuiFlexItem, { onMouseEnter: () => this.setState({ hover: item.id }), onMouseLeave: () => this.setState({ hover: "" }), key: idx, style: { border: "1px solid #8080804a", maxWidth: "calc(25% - 8px)", maxHeight: 41 } },
                react_1.default.createElement(eui_1.EuiPopover, { id: "techniqueActionsContextMenu", anchorClassName: "wz-width-100", button: (react_1.default.createElement(eui_1.EuiFacetButton, { style: { width: "100%", padding: "0 5px 0 5px", lineHeight: "40px" }, quantity: item.quantity, onClick: () => { this.showFlyout(item.id); } },
                        react_1.default.createElement(eui_1.EuiToolTip, { position: "top", content: tooltipContent, anchorClassName: toolTipAnchorClass },
                            react_1.default.createElement("span", { style: {
                                    display: "block",
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis"
                                } },
                                item.id,
                                " - ",
                                this.props.descriptions[item.id])),
                        this.state.hover === item.id &&
                            react_1.default.createElement("span", { style: { float: "right" } },
                                react_1.default.createElement(eui_1.EuiToolTip, { position: "top", content: "Show " + item.id + " in Dashboard" },
                                    react_1.default.createElement(eui_1.EuiIcon, { onMouseDown: (e) => { this.openDashboard(e, item.id); e.stopPropagation(); }, color: "primary", type: "visualizeApp" })),
                                " \u00A0",
                                react_1.default.createElement(eui_1.EuiToolTip, { position: "top", content: "Inspect " + item.id + " in Events" },
                                    react_1.default.createElement(eui_1.EuiIcon, { onMouseDown: (e) => { this.openDiscover(e, item.id); e.stopPropagation(); }, color: "primary", type: "discoverApp" }))))), isOpen: this.state.actionsOpen === item.id, closePopover: () => { }, panelPaddingSize: "none", style: { width: "100%" }, withTitle: true, anchorPosition: "downLeft" }, "xxx")));
        });
        if (tacticsToRender.length) {
            return (react_1.default.createElement(eui_1.EuiFlexGrid, { columns: 4, gutterSize: "s", style: { maxHeight: "calc(100vh - 385px)", overflow: "overlay", overflowX: "hidden", paddingRight: 10 } }, tacticsToRenderOrdered));
        }
        else {
            return react_1.default.createElement(eui_1.EuiCallOut, { title: 'There are no results.', iconType: 'help', color: 'warning' });
        }
    }
    closeFlyout() {
        this.setState({ flyoutOn: false });
    }
    showFlyout(requirement) {
        this.setState({
            selectedRequirement: requirement,
            flyoutOn: true
        });
    }
    render() {
        return (react_1.default.createElement("div", { style: { padding: 10 } },
            react_1.default.createElement(eui_1.EuiFlexGroup, null,
                react_1.default.createElement(eui_1.EuiFlexItem, { grow: true },
                    react_1.default.createElement(eui_1.EuiTitle, { size: "m" },
                        react_1.default.createElement("h1", null, "Requirements"))),
                react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                    react_1.default.createElement(eui_1.EuiFlexGroup, null,
                        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                            react_1.default.createElement(eui_1.EuiText, { grow: false },
                                react_1.default.createElement("span", null, "Hide requirements with no alerts "),
                                " \u00A0",
                                react_1.default.createElement(eui_1.EuiSwitch, { label: "", checked: this.state.hideAlerts, onChange: e => this.hideAlerts() })))))),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "xs" }),
            react_1.default.createElement(eui_1.EuiFieldSearch, { fullWidth: true, placeholder: "Filter requirements", value: this.state.searchValue, onChange: e => this.onSearchValueChange(e), isClearable: true, "aria-label": "Use aria labels when no actual label is in use" }),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
            react_1.default.createElement("div", null, this.props.loadingAlerts
                ? react_1.default.createElement(eui_1.EuiFlexItem, { style: { height: "calc(100vh - 410px)", alignItems: 'center' } },
                    react_1.default.createElement(eui_1.EuiLoadingSpinner, { size: 'xl', style: { margin: 0, position: 'absolute', top: '50%', transform: 'translateY(-50%)' } }))
                : this.props.requirementsCount && this.renderFacet()),
            this.state.flyoutOn &&
                react_1.default.createElement(eui_1.EuiOverlayMask, { onClick: (e) => { e.target.className === 'euiOverlayMask' && this.closeFlyout(); } },
                    react_1.default.createElement(requirement_flyout_1.RequirementFlyout, { currentRequirement: this.state.selectedRequirement, onChangeFlyout: this.onChangeFlyout, description: this.props.descriptions[this.state.selectedRequirement], getRequirementKey: () => { return this.getRequirementKey(); }, openDashboard: (e, itemId) => this.openDashboard(e, itemId), openDiscover: (e, itemId) => this.openDiscover(e, itemId) }))));
    }
}
exports.ComplianceSubrequirements = ComplianceSubrequirements;
