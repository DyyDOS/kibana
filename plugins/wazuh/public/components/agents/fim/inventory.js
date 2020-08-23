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
exports.Inventory = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
const inventory_1 = require("./inventory/");
const wz_request_1 = require("../../../react-services/wz-request");
const wz_csv_1 = __importDefault(require("../../../react-services/wz-csv"));
const notify_1 = require("ui/notify");
const wz_search_bar_1 = require("../../wz-search-bar");
class Inventory extends react_1.Component {
    constructor(props) {
        super(props);
        this._isMount = false;
        this.onFiltersChange = (filters) => {
            // this.setStoreFilters(filters);
            this.setState({ filters });
        };
        this.onTotalItemsChange = (totalItems) => {
            this.setState({ totalItemsFile: totalItems });
        };
        this.onSelectedTabChanged = id => {
            this.setState({ selectedTabId: id });
        };
        this.showToast = (color, title, time) => {
            notify_1.toastNotifications.add({
                color: color,
                title: title,
                toastLifeTimeMs: time,
            });
        };
        this.state = {
            filters: [],
            syscheck: [],
            selectedTabId: 'files',
            totalItemsFile: 0,
            totalItemsRegistry: 0,
            isLoading: true,
            customBadges: [],
            isConfigured: false
        };
        this.onFiltersChange.bind(this);
    }
    async componentDidMount() {
        this._isMount = true;
        await this.loadAgent();
    }
    componentDidUpdate(prevProps) {
        if (JSON.stringify(this.props.agent) !== JSON.stringify(prevProps.agent)) {
            this.setState({ isLoading: true }, this.loadAgent);
        }
    }
    componentWillUnmount() {
        this._isMount = false;
    }
    async loadAgent() {
        const agentPlatform = ((this.props.agent || {}).os || {}).platform;
        const { totalItemsFile, syscheck } = await this.getItemNumber('file');
        const totalItemsRegistry = agentPlatform === 'windows' ? await this.getItemNumber('registry') : 0;
        const isConfigured = await this.isConfigured();
        if (this._isMount) {
            this.setState({ totalItemsFile, totalItemsRegistry, syscheck, isLoading: false, isConfigured });
        }
    }
    // Do not load the localStorage filters when changing tabs
    // componentDidUpdate(prevProps, prevState) {
    //   const { selectedTabId } = this.state;
    //   if (selectedTabId !== prevState.selectedTabId) {
    //     const filters = this.getStoreFilters(this.props);
    //     this.setState({ filters });
    //   }
    // }
    tabs() {
        let auxTabs = [
            {
                id: 'files',
                name: `Files ${this.state.isLoading === true ? '' : '(' + this.state.totalItemsFile + ')'}`,
                disabled: false,
            },
        ];
        const platform = (this.props.agent.os || {}).platform || "other";
        platform === 'windows' ? auxTabs.push({
            id: 'registry',
            name: `Windows Registry ${this.state.isLoading === true ? '' : '(' + this.state.totalItemsRegistry + ')'}`,
            disabled: false,
        }) : null;
        return (auxTabs);
    }
    getStoreFilters(props) {
        const { section, selectView, agent } = props;
        const filters = JSON.parse(window.localStorage.getItem(`wazuh-${section}-${selectView}-${((this.state || {}).selectedTabId || 'files')}-${agent['id']}`) || '{}');
        return filters;
    }
    setStoreFilters(filters) {
        const { section, selectView, agent } = this.props;
        window.localStorage.setItem(`wazuh-${section}-${selectView}-${(this.state || {}).selectedTabId || 'files'}-${agent['id']}`, JSON.stringify(filters));
    }
    buildFilter(type) {
        const filters = wz_search_bar_1.filtersToObject(this.state.filters);
        const filter = {
            ...filters,
            limit: type === 'file' ? '15' : '1',
            type,
            ...(type === 'file' && { sort: '+file' })
        };
        return filter;
    }
    async getItemNumber(type) {
        const agentID = this.props.agent.id;
        const response = await wz_request_1.WzRequest.apiReq('GET', `/syscheck/${agentID}`, this.buildFilter(type));
        if (type === 'file') {
            return {
                totalItemsFile: ((response.data || {}).data || {}).totalItems || 0,
                syscheck: ((response.data || {}).data || {}).items || [],
            };
        }
        return ((response.data || {}).data || {}).totalItems || 0;
    }
    renderTabs() {
        const tabs = this.tabs();
        const { isLoading } = this.state;
        if (tabs.length > 1) {
            return (react_1.default.createElement("div", null,
                react_1.default.createElement(eui_1.EuiTabs, null, tabs.map((tab, index) => (react_1.default.createElement(eui_1.EuiTab, { onClick: () => this.onSelectedTabChanged(tab.id), isSelected: tab.id === this.state.selectedTabId, disabled: tab.disabled, key: index },
                    tab.name,
                    "\u00A0",
                    isLoading === true && react_1.default.createElement(eui_1.EuiLoadingSpinner, { size: "s" }))))),
                react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
                react_1.default.createElement(eui_1.EuiFlexGroup, null,
                    react_1.default.createElement(eui_1.EuiFlexItem, null),
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                        react_1.default.createElement(eui_1.EuiButtonEmpty, { iconType: "importAction", onClick: () => this.downloadCsv() }, "Export formatted")))));
        }
        else {
            return (react_1.default.createElement(eui_1.EuiFlexGroup, null,
                react_1.default.createElement(eui_1.EuiFlexItem, null,
                    react_1.default.createElement(eui_1.EuiTitle, { size: "s" },
                        react_1.default.createElement("h1", null,
                            " ",
                            tabs[0].name,
                            "\u00A0",
                            isLoading === true && react_1.default.createElement(eui_1.EuiLoadingSpinner, { size: "s" })))),
                react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                    react_1.default.createElement(eui_1.EuiButtonEmpty, { iconType: "importAction", onClick: () => this.downloadCsv() }, "Export formatted"))));
        }
    }
    async downloadCsv() {
        const { filters } = this.state;
        try {
            const filtersObject = wz_search_bar_1.filtersToObject(filters);
            const formatedFilters = Object.keys(filtersObject).map(key => ({ name: key, value: filtersObject[key] }));
            this.showToast('success', 'Your download should begin automatically...', 3000);
            await wz_csv_1.default('/syscheck/' + this.props.agent.id, [
                { name: 'type', value: this.state.selectedTabId === 'files' ? 'file' : this.state.selectedTabId },
                ...formatedFilters
            ], `fim-${this.state.selectedTabId}`);
        }
        catch (error) {
            this.showToast('danger', error, 3000);
        }
    }
    renderTable() {
        const { filters, syscheck, selectedTabId, customBadges, totalItemsRegistry, totalItemsFile } = this.state;
        return (react_1.default.createElement("div", null,
            react_1.default.createElement(inventory_1.FilterBar, { filters: filters, onFiltersChange: this.onFiltersChange, selectView: selectedTabId, agent: this.props.agent }),
            selectedTabId === 'files' &&
                react_1.default.createElement(inventory_1.InventoryTable, Object.assign({}, this.props, { filters: filters, items: syscheck, totalItems: totalItemsFile, onFiltersChange: this.onFiltersChange, onTotalItemsChange: this.onTotalItemsChange })),
            selectedTabId === 'registry' &&
                react_1.default.createElement(inventory_1.RegistryTable, Object.assign({}, this.props, { filters: filters, totalItems: totalItemsRegistry, onFiltersChange: this.onFiltersChange }))));
    }
    noConfiguredMonitoring() {
        return (react_1.default.createElement(eui_1.EuiPage, null,
            react_1.default.createElement(eui_1.EuiPageBody, { component: "div" },
                react_1.default.createElement(eui_1.EuiPageContent, { verticalPosition: "center", horizontalPosition: "center" },
                    react_1.default.createElement(eui_1.EuiEmptyPrompt, { iconType: "filebeatApp", title: react_1.default.createElement("h2", null, "Integrity monitoring is not configured for this agent"), body: react_1.default.createElement(react_1.Fragment, null,
                            react_1.default.createElement(eui_1.EuiHorizontalRule, { margin: 's' }),
                            react_1.default.createElement(eui_1.EuiLink, { href: 'https://documentation.wazuh.com/current/user-manual/capabilities/file-integrity/index.html', target: "_blank", style: { textAlign: "center" } }, "https://documentation.wazuh.com/current/user-manual/capabilities/file-integrity/index.html"),
                            react_1.default.createElement(eui_1.EuiHorizontalRule, { margin: 's' })), actions: react_1.default.createElement(eui_1.EuiButton, { href: '#/manager/configuration?_g=()&tab=configuration', target: "_blank", color: "primary", iconType: "gear", fill: true }, "Configure it") })))));
    }
    loadingInventory() {
        return react_1.default.createElement(eui_1.EuiPage, null,
            react_1.default.createElement(eui_1.EuiFlexGroup, null,
                react_1.default.createElement(eui_1.EuiFlexItem, null,
                    react_1.default.createElement(eui_1.EuiProgress, { size: "xs", color: "primary" }))));
    }
    async isConfigured() {
        try {
            const response = await wz_request_1.WzRequest.apiReq('GET', `/agents/${this.props.agent.id}/config/syscheck/syscheck`, {});
            return (((response.data || {}).data).syscheck || {}).disabled === 'no';
        }
        catch (error) {
            return false;
        }
    }
    render() {
        const { isLoading, isConfigured } = this.state;
        if (isLoading) {
            return this.loadingInventory();
        }
        const table = this.renderTable();
        const tabs = this.renderTabs();
        return isConfigured
            ? (react_1.default.createElement(eui_1.EuiPage, null,
                react_1.default.createElement(eui_1.EuiPanel, null,
                    tabs,
                    react_1.default.createElement(eui_1.EuiSpacer, { size: (((this.props.agent || {}).os || {}).platform || false) === 'windows' ? 's' : 'm' }),
                    table)))
            : this.noConfiguredMonitoring();
    }
}
exports.Inventory = Inventory;
