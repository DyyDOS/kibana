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
exports.MainModuleOverview = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
require("../../common/modules/module.less");
const globalBreadcrumbActions_1 = require("../../../redux/actions/globalBreadcrumbActions");
const store_1 = __importDefault(require("../../../redux/store"));
const chrome_1 = __importDefault(require("ui/chrome"));
const reporting_1 = require("../../../react-services/reporting");
const app_navigate_1 = require("../../../react-services/app-navigate");
const tab_description_1 = require("../../../../server/reporting/tab-description");
const modules_1 = require("../../common/modules");
const overview_actions_1 = __importDefault(require("../../../controllers/overview/components/overview-actions/overview-actions"));
const fim_1 = require("../../agents/fim");
const sca_1 = require("../../agents/sca");
const main_mitre_1 = require("./main-mitre");
const wz_redux_provider_1 = __importDefault(require("../../../redux/wz-redux-provider"));
const compliance_table_1 = require("../../overview/compliance-table");
class MainModuleOverview extends react_1.Component {
    constructor(props) {
        super(props);
        this.reportingService = new reporting_1.ReportingService();
        this.state = {
            selectView: false,
            loadingReport: false,
            isDescPopoverOpen: false,
        };
    }
    getBadgeColor(agentStatus) {
        if (agentStatus.toLowerCase() === 'active') {
            return 'secondary';
        }
        else if (agentStatus.toLowerCase() === 'disconnected') {
            return '#BD271E';
        }
        else if (agentStatus.toLowerCase() === 'never connected') {
            return 'default';
        }
    }
    setGlobalBreadcrumb() {
        const currentAgent = store_1.default.getState().appStateReducers.currentAgentData;
        if (tab_description_1.TabDescription[this.props.currentTab]) {
            let breadcrumb = [
                {
                    text: '',
                },
                {
                    text: currentAgent.id ? (react_1.default.createElement("span", null,
                        "Modules",
                        react_1.default.createElement(eui_1.EuiBadge, { onMouseDown: (ev) => { app_navigate_1.AppNavigate.navigateToModule(ev, 'agents', { "tab": "welcome", "agent": currentAgent.id }); }, color: this.getBadgeColor(currentAgent.status) }, currentAgent.id))) : 'Modules',
                    href: "#/overview"
                },
                {
                    text: tab_description_1.TabDescription[this.props.section].title
                },
            ];
            store_1.default.dispatch(globalBreadcrumbActions_1.updateGlobalBreadcrumb(breadcrumb));
        }
    }
    componentDidUpdate() {
        this.setGlobalBreadcrumb();
    }
    async componentDidMount() {
        const tabView = app_navigate_1.AppNavigate.getUrlParameter('tabView');
        const tab = app_navigate_1.AppNavigate.getUrlParameter('tab');
        if (tabView && tabView !== this.props.selectView) {
            if (tabView === 'panels' && tab === 'sca') { // SCA initial tab is inventory
                this.props.onSelectedTabChanged('inventory');
            }
            else {
                this.props.onSelectedTabChanged(tabView);
            }
        }
        const $injector = await chrome_1.default.dangerouslyGetActiveInjector();
        this.router = $injector.get('$route');
        this.setGlobalBreadcrumb();
    }
    renderTitle() {
        return (react_1.default.createElement(eui_1.EuiFlexGroup, null,
            react_1.default.createElement(eui_1.EuiFlexItem, { className: "wz-module-header-agent-title" },
                react_1.default.createElement(eui_1.EuiFlexGroup, null,
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                        react_1.default.createElement("span", { style: { display: 'inline-flex' } },
                            react_1.default.createElement(eui_1.EuiTitle, { size: "s" },
                                react_1.default.createElement("h1", null,
                                    react_1.default.createElement("span", null,
                                        "\u00A0",
                                        tab_description_1.TabDescription[this.props.section].title,
                                        "\u00A0\u00A0"))),
                            react_1.default.createElement(eui_1.EuiPopover, { button: react_1.default.createElement(eui_1.EuiButtonIcon, { iconType: "iInCircle", style: { marginTop: 3 }, color: 'primary', "aria-label": 'Open/close', onClick: () => { this.setState({ isDescPopoverOpen: !this.state.isDescPopoverOpen }); } }), anchorPosition: "rightUp", isOpen: this.state.isDescPopoverOpen, closePopover: () => { this.setState({ isDescPopoverOpen: false }); } },
                                react_1.default.createElement(eui_1.EuiPopoverTitle, null, "Module description"),
                                react_1.default.createElement("div", { style: { width: '400px' } }, tab_description_1.TabDescription[this.props.section].description)))),
                    react_1.default.createElement(eui_1.EuiFlexItem, null)))));
    }
    render() {
        const { section, selectView } = this.props;
        const title = this.renderTitle();
        return (react_1.default.createElement("div", { className: this.state.showAgentInfo ? 'wz-module wz-module-showing-agent' : 'wz-module' },
            react_1.default.createElement("div", { className: 'wz-module-header-agent-wrapper' },
                react_1.default.createElement("div", { className: 'wz-module-header-agent' }, title)),
            react_1.default.createElement(react_1.Fragment, null,
                react_1.default.createElement("div", { className: 'wz-module-header-nav-wrapper' },
                    react_1.default.createElement("div", { className: this.props.tabs && this.props.tabs.length && 'wz-module-header-nav' }, (this.props.tabs && this.props.tabs.length) &&
                        react_1.default.createElement("div", { className: "wz-welcome-page-agent-tabs" },
                            react_1.default.createElement(eui_1.EuiFlexGroup, null,
                                this.props.renderTabs(),
                                react_1.default.createElement(eui_1.EuiFlexItem, { grow: false, style: { marginTop: 6, marginRight: 5 } },
                                    react_1.default.createElement(wz_redux_provider_1.default, null,
                                        react_1.default.createElement(overview_actions_1.default, Object.assign({}, { ...this.props, ...this.props.agentsSelectionProps })))),
                                (selectView === 'dashboard') &&
                                    this.props.renderReportButton(),
                                (this.props.buttons || []).includes('dashboard') &&
                                    this.props.renderDashboardButton())))),
                react_1.default.createElement("div", { className: 'wz-module-body' },
                    selectView === 'events' &&
                        react_1.default.createElement(modules_1.Events, Object.assign({}, this.props)),
                    selectView === 'loader' &&
                        react_1.default.createElement(modules_1.Loader, Object.assign({}, this.props, { loadSection: (section) => this.props.loadSection(section), redirect: this.props.afterLoad })),
                    selectView === 'dashboard' &&
                        react_1.default.createElement(modules_1.Dashboard, Object.assign({}, this.props)),
                    selectView === 'settings' &&
                        react_1.default.createElement(modules_1.Settings, Object.assign({}, this.props))),
                section === 'fim' && react_1.default.createElement(fim_1.MainFim, Object.assign({}, this.props)),
                section === 'sca' && react_1.default.createElement(sca_1.MainSca, Object.assign({}, this.props)),
                section === 'mitre' && selectView === 'inventory' && react_1.default.createElement(main_mitre_1.MainMitre, Object.assign({}, this.props)),
                (section === 'pci' || section === 'gdpr' || section === 'hipaa' || section === 'nist' || section === 'tsc') && selectView === 'inventory' && react_1.default.createElement(compliance_table_1.ComplianceTable, Object.assign({}, this.props, { goToDiscover: (id) => this.props.onSelectedTabChanged(id) })))));
    }
}
exports.MainModuleOverview = MainModuleOverview;
