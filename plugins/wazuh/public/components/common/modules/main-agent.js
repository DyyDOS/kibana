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
exports.MainModuleAgent = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
require("../../common/modules/module.less");
const globalBreadcrumbActions_1 = require("../../../redux/actions/globalBreadcrumbActions");
const store_1 = __importDefault(require("../../../redux/store"));
const chrome_1 = __importDefault(require("ui/chrome"));
const filter_handler_1 = require("../../../utils/filter-handler");
const app_state_1 = require("../../../react-services/app-state");
const reporting_1 = require("../../../react-services/reporting");
const tab_description_1 = require("../../../../server/reporting/tab-description");
const modules_1 = require("../../common/modules");
const agents_info_1 = require("../../common/welcome/agents-info");
const fim_1 = require("../../agents/fim");
const sca_1 = require("../../agents/sca");
const main_mitre_1 = require("../modules/main-mitre");
class MainModuleAgent extends react_1.Component {
    constructor(props) {
        super(props);
        this.color = (status, hex = false) => {
            if (status.toLowerCase() === 'active') {
                return hex ? '#017D73' : 'success';
            }
            else if (status.toLowerCase() === 'disconnected') {
                return hex ? '#BD271E' : 'danger';
            }
            else if (status.toLowerCase() === 'never connected') {
                return hex ? '#98A2B3' : 'subdued';
            }
        };
        this.reportingService = new reporting_1.ReportingService();
        this.filterHandler = new filter_handler_1.FilterHandler(app_state_1.AppState.getCurrentPattern());
        this.state = {
            selectView: false,
            loadingReport: false,
            switchModule: false,
            showAgentInfo: false
        };
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.section !== this.props.section) {
            this.setGlobalBreadcrumb();
        }
    }
    setGlobalBreadcrumb() {
        let breadcrumb;
        if (this.props.section === 'welcome') {
            breadcrumb = [
                { text: '' },
                { text: 'Agents', href: '#/agents-preview' },
                { text: this.props.agent.id }
            ];
        }
        else {
            breadcrumb = [
                {
                    text: '',
                },
                {
                    text: 'Agents',
                    href: "#/agents-preview"
                },
                { agent: this.props.agent },
                {
                    text: tab_description_1.TabDescription[this.props.section].title,
                    className: 'wz-global-breadcrumb-popover'
                },
            ];
        }
        store_1.default.dispatch(globalBreadcrumbActions_1.updateGlobalBreadcrumb(breadcrumb));
        $('#breadcrumbNoTitle').attr("title", "");
    }
    async componentDidMount() {
        const $injector = await chrome_1.default.dangerouslyGetActiveInjector();
        this.router = $injector.get('$route');
        this.setGlobalBreadcrumb();
    }
    showAgentInfo() {
        const elem = document.getElementsByClassName('wz-module-body-main')[0];
        if (elem) {
            if (!this.state.showAgentInfo) {
                elem.classList.add("wz-module-body-main-double");
            }
            else {
                elem.classList.remove("wz-module-body-main-double");
            }
        }
        this.setState({ showAgentInfo: !this.state.showAgentInfo });
    }
    async startReport() {
        this.setState({ loadingReport: true });
        const syscollectorFilters = [];
        const agent = (this.props.agent || store_1.default.getState().appStateReducers.currentAgentData || {}).id || false;
        if (this.props.section === 'syscollector' && agent) {
            syscollectorFilters.push(this.filterHandler.managerQuery(agent, true));
            syscollectorFilters.push(this.filterHandler.agentQuery(agent));
        }
        await this.reportingService.startVis2Png(this.props.section, agent, syscollectorFilters.length ? syscollectorFilters : null);
        this.setState({ loadingReport: false });
    }
    renderReportButton() {
        return ((this.props.section === 'syscollector' &&
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false, style: { marginRight: 4, marginTop: 6 } },
                react_1.default.createElement(eui_1.EuiButtonEmpty, { iconType: "document", isLoading: this.state.loadingReport, onClick: async () => this.startReport() }, "Generate report"))));
    }
    renderTitle() {
        return (react_1.default.createElement(eui_1.EuiFlexGroup, null,
            react_1.default.createElement(eui_1.EuiFlexItem, { className: "wz-module-header-agent-title" },
                react_1.default.createElement(eui_1.EuiFlexGroup, null,
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                        react_1.default.createElement("span", { style: { display: 'inline-flex' } },
                            react_1.default.createElement(eui_1.EuiTitle, { size: "s", className: "wz-module-header-agent-title-btn" },
                                react_1.default.createElement("h1", null,
                                    react_1.default.createElement("span", { onClick: () => {
                                            window.location.href = `#/agents?agent=${this.props.agent.id}`;
                                            this.router.reload();
                                        } },
                                        react_1.default.createElement("span", null,
                                            "\u00A0",
                                            this.props.agent.name,
                                            "\u00A0\u00A0\u00A0")))))),
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: false, style: { marginLeft: 0, marginTop: 7 } }),
                    react_1.default.createElement(eui_1.EuiFlexItem, null),
                    this.renderReportButton()))));
    }
    renderSettingsButton() {
        return (react_1.default.createElement(eui_1.EuiFlexItem, { grow: false, style: { marginRight: 4, marginTop: 6 } },
            react_1.default.createElement(eui_1.EuiButtonEmpty, { fill: this.state.selectView === 'settings' || undefined, iconType: "wrench", onClick: () => this.onSelectedTabChanged('settings') }, "Configuration")));
    }
    render() {
        const { agent, section, selectView } = this.props;
        const title = this.renderTitle();
        return (react_1.default.createElement("div", { className: this.state.showAgentInfo ? 'wz-module wz-module-showing-agent' : 'wz-module' },
            react_1.default.createElement("div", { className: 'wz-module-header-agent-wrapper' },
                react_1.default.createElement("div", { className: 'wz-module-header-agent' }, title)),
            (agent && agent.os) &&
                react_1.default.createElement(react_1.Fragment, null,
                    react_1.default.createElement("div", { className: 'wz-module-header-nav-wrapper' },
                        react_1.default.createElement("div", { className: this.props.tabs && this.props.tabs.length && 'wz-module-header-nav' },
                            this.state.showAgentInfo &&
                                react_1.default.createElement("div", { className: !this.props.tabs || !this.props.tabs.length ?
                                        "wz-welcome-page-agent-info" :
                                        "wz-welcome-page-agent-info wz-welcome-page-agent-info-gray" },
                                    react_1.default.createElement(agents_info_1.AgentInfo, Object.assign({ agent: this.props.agent, isCondensed: false, hideActions: true }, this.props))),
                            (this.props.tabs && this.props.tabs.length) &&
                                react_1.default.createElement("div", { className: "wz-welcome-page-agent-tabs" },
                                    react_1.default.createElement(eui_1.EuiFlexGroup, null,
                                        this.props.renderTabs(),
                                        (selectView === 'dashboard') &&
                                            this.props.renderReportButton(),
                                        (this.props.buttons || []).includes('dashboard') &&
                                            this.props.renderDashboardButton(),
                                        (this.props.buttons || []).includes('settings') &&
                                            this.renderSettingsButton())))),
                    !['syscollector', 'configuration'].includes(this.props.section) &&
                        react_1.default.createElement("div", { className: 'wz-module-body' },
                            selectView === 'events' &&
                                react_1.default.createElement(modules_1.Events, Object.assign({}, this.props)),
                            selectView === 'loader' &&
                                react_1.default.createElement(modules_1.Loader, Object.assign({}, this.props, { loadSection: (section) => this.props.loadSection(section), redirect: this.props.afterLoad })),
                            selectView === 'dashboard' &&
                                react_1.default.createElement(modules_1.Dashboard, Object.assign({}, this.props)),
                            selectView === 'settings' &&
                                react_1.default.createElement(modules_1.Settings, Object.assign({}, this.props)),
                            section === 'fim' && react_1.default.createElement(fim_1.MainFim, Object.assign({}, this.props)),
                            section === 'sca' && react_1.default.createElement(sca_1.MainSca, Object.assign({}, this.props)),
                            section === 'mitre' && selectView === 'inventory' && react_1.default.createElement(main_mitre_1.MainMitre, Object.assign({}, this.props, { goToDiscover: (id) => this.props.onSelectedTabChanged(id) })))),
            (!agent || !agent.os) &&
                react_1.default.createElement(eui_1.EuiCallOut, { style: { margin: '66px 16px 0 16px' }, title: " This agent has never connected", color: "warning", iconType: "alert" })));
    }
}
exports.MainModuleAgent = MainModuleAgent;
