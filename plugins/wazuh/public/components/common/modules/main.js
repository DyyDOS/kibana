"use strict";
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
exports.MainModule = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
require("../../common/modules/module.less");
const reporting_1 = require("../../../react-services/reporting");
const modules_defaults_1 = require("./modules-defaults");
const kibana_services_1 = require("plugins/kibana/discover/kibana_services");
const kibana_services_2 = require("plugins/kibana/discover/kibana_services");
const main_agent_1 = require("./main-agent");
const main_overview_1 = require("./main-overview");
const store_1 = __importDefault(require("../../../redux/store"));
const wz_redux_provider_js_1 = __importDefault(require("../../../redux/wz-redux-provider.js"));
class MainModule extends react_1.Component {
    constructor(props) {
        super(props);
        this.reportingService = new reporting_1.ReportingService();
        this.state = {
            selectView: false,
            loadingReport: false,
            switchModule: false,
            showAgentInfo: false
        };
        const app = kibana_services_2.getAngularModule('app/wazuh');
        this.$rootScope = app.$injector.get('$rootScope');
    }
    async componentDidMount() {
        if (!(modules_defaults_1.ModulesDefaults[this.props.section] || {}).notModule) {
            this.tabs = (modules_defaults_1.ModulesDefaults[this.props.section] || {}).tabs || [{ id: 'dashboard', name: 'Dashboard' }, { id: 'events', name: 'Events' }];
            this.buttons = (modules_defaults_1.ModulesDefaults[this.props.section] || {}).buttons || ['reporting', 'settings'];
        }
    }
    componentWillUnmount() {
        const { filterManager } = kibana_services_1.getServices();
        if (filterManager.filters && filterManager.filters.length) {
            filterManager.removeAll();
        }
    }
    canBeInit(tab) {
        let canInit = false;
        this.tabs.forEach(element => {
            if (element.id === tab && (!element.onlyAgent || (element.onlyAgent && this.props.agent))) {
                canInit = true;
            }
        });
        return canInit;
    }
    renderTabs(agent = false) {
        const { selectView } = this.state;
        if (!agent) {
        }
        return (react_1.default.createElement(eui_1.EuiFlexItem, { style: { margin: '0 8px 0 8px' } },
            react_1.default.createElement(eui_1.EuiTabs, null, this.tabs.map((tab, index) => {
                if (!tab.onlyAgent || (tab.onlyAgent && this.props.agent)) {
                    return react_1.default.createElement(eui_1.EuiTab, { onClick: () => this.onSelectedTabChanged(tab.id), isSelected: selectView === tab.id, key: index }, tab.name);
                }
            }))));
    }
    async startReport() {
        this.setState({ loadingReport: true });
        const agent = (this.props.agent || store_1.default.getState().appStateReducers.currentAgentData || {}).id || false;
        await this.reportingService.startVis2Png(this.props.section, agent);
        this.setState({ loadingReport: false });
    }
    renderReportButton() {
        return ((this.props.disabledReport &&
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false, style: { marginRight: 4, marginTop: 6 } },
                react_1.default.createElement(eui_1.EuiToolTip, { position: "top", content: "No results match for this search criteria." },
                    react_1.default.createElement(eui_1.EuiButtonEmpty, { iconType: "document", isLoading: this.state.loadingReport, isDisabled: true, onClick: async () => this.startReport() }, "Generate report")))
            || (react_1.default.createElement(eui_1.EuiFlexItem, { grow: false, style: { marginRight: 4, marginTop: 6 } },
                react_1.default.createElement(eui_1.EuiButtonEmpty, { iconType: "document", isLoading: this.state.loadingReport, onClick: async () => this.startReport() }, "Generate report")))));
    }
    renderDashboardButton() {
        const href = `#/overview?tab=${this.props.section}&agentId=${this.props.agent.id}`;
        return (react_1.default.createElement(eui_1.EuiFlexItem, { grow: false, style: { marginLeft: 0, marginTop: 6, marginBottom: 18 } },
            react_1.default.createElement(eui_1.EuiButton, { fill: this.state.selectView === 'dashboard', iconType: "visLine", onClick: () => this.onSelectedTabChanged('dashboard') }, "Dashboard")));
    }
    renderSettingsButton() {
        return (react_1.default.createElement(eui_1.EuiFlexItem, { grow: false, style: { marginRight: 4, marginTop: 6 } },
            react_1.default.createElement(eui_1.EuiButtonEmpty, { fill: this.state.selectView === 'settings', iconType: "wrench", onClick: () => this.onSelectedTabChanged('settings') }, "Configuration")));
    }
    loadSection(id) {
        this.setState({ selectView: id });
    }
    onSelectedTabChanged(id) {
        if (id !== this.state.selectView) {
            if (id === 'events' || id === 'dashboard' || id === 'inventory') {
                this.$rootScope.moduleDiscoverReady = false;
                if (this.props.switchSubTab)
                    this.props.switchSubTab(id === 'events' ? 'discover' : id === 'inventory' ? 'inventory' : 'panels');
                window.location.href = window.location.href.replace(new RegExp("tabView=" + "[^\&]*"), `tabView=${id === 'events' ? 'discover' : id === 'inventory' ? 'inventory' : 'panels'}`);
                this.afterLoad = id;
                this.loadSection('loader');
            }
            else {
                this.loadSection(id === 'panels' ? 'dashboard' : id === 'discover' ? 'events' : id);
            }
        }
    }
    render() {
        const { agent } = this.props;
        const { selectView } = this.state;
        const mainProps = {
            selectView,
            afterLoad: this.afterLoad,
            buttons: this.buttons,
            tabs: this.tabs,
            renderTabs: () => this.renderTabs(),
            renderReportButton: () => this.renderReportButton(),
            renderDashboardButton: () => this.renderDashboardButton(),
            renderSettingsButton: () => this.renderSettingsButton(),
            loadSection: (id) => this.loadSection(id),
            onSelectedTabChanged: (id) => this.onSelectedTabChanged(id)
        };
        return (react_1.default.createElement(wz_redux_provider_js_1.default, null, agent &&
            react_1.default.createElement(main_agent_1.MainModuleAgent, Object.assign({}, { ...this.props, ...mainProps }))
            || ((this.props.section && this.props.section !== 'welcome') &&
                react_1.default.createElement(main_overview_1.MainModuleOverview, Object.assign({}, { ...this.props, ...mainProps })))));
    }
}
exports.MainModule = MainModule;
