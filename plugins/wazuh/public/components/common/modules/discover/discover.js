"use strict";
/*
 * Wazuh app - Integrity monitoring table component
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
exports.Discover = void 0;
const react_1 = __importStar(require("react"));
const react_2 = require("@kbn/i18n/react");
require("./discover.less");
const context_1 = require("../../../../../../../src/plugins/kibana_react/public/context");
const public_1 = require("../../../../../../../src/plugins/data/public/");
const generic_request_1 = require("../../../../react-services/generic-request");
const app_state_1 = require("../../../../react-services/app-state");
const row_details_1 = require("./row-details");
//@ts-ignore
const new_platform_1 = require("ui/new_platform");
//@ts-ignore
const kibana_services_1 = require("plugins/kibana/discover/kibana_services");
const datemath_1 = __importDefault(require("@elastic/datemath"));
const notify_1 = require("ui/notify");
const store_1 = __importDefault(require("../../../../redux/store"));
const wazuh_config_1 = require("../../../../react-services/wazuh-config");
const eui_1 = require("@elastic/eui");
const common_1 = require("../../../../../../../src/plugins/data/common");
require("../../../../components/agents/fim/inventory/inventory.less");
class Discover extends react_1.Component {
    constructor(props) {
        super(props);
        this.showToast = (color, title, time) => {
            notify_1.toastNotifications.add({
                color: color,
                title: title,
                toastLifeTimeMs: time,
            });
        };
        this.hideCreateCustomLabel = () => {
            try {
                const button = document.querySelector(".wz-discover #addFilterPopover > div > button > span > span");
                if (!button)
                    return setTimeout(this.hideCreateCustomLabel, 100);
                const findAndHide = () => {
                    const switcher = document.querySelector("#filterEditorCustomLabelSwitch");
                    if (!switcher)
                        return setTimeout(findAndHide, 100);
                    console.log(switcher.parentElement);
                    switcher.parentElement.style.display = "none";
                };
                button.onclick = findAndHide;
            }
            catch (error) { }
        };
        this.onFiltersChange = (filters) => {
            this.setState({ filters: this.filtersAsArray(filters) });
        };
        this.toggleDetails = item => {
            const itemIdToExpandedRowMap = { ...this.state.itemIdToExpandedRowMap };
            if (itemIdToExpandedRowMap[item._id]) {
                delete itemIdToExpandedRowMap[item._id];
                this.setState({ itemIdToExpandedRowMap });
            }
            else {
                const newItemIdToExpandedRowMap = {};
                newItemIdToExpandedRowMap[item._id] = ((react_1.default.createElement("div", { style: { width: "100%" } },
                    " ",
                    react_1.default.createElement(row_details_1.RowDetails, { item: item, addFilter: (filter) => this.addFilter(filter), addFilterOut: (filter) => this.addFilterOut(filter), toggleColumn: (id) => this.addColumn(id) }))));
                this.setState({ itemIdToExpandedRowMap: newItemIdToExpandedRowMap });
            }
        };
        this.columns = () => {
            const columns = this.state.columns.map((item) => {
                if (item === "icon") {
                    return {
                        width: "25px",
                        isExpander: true,
                        render: item => {
                            return (react_1.default.createElement(eui_1.EuiIcon, { size: "s", type: this.state.itemIdToExpandedRowMap[item._id] ? "arrowDown" : "arrowRight" }));
                        },
                    };
                }
                if (item === "timestamp") {
                    return {
                        field: 'timestamp',
                        name: 'Time',
                        width: '160px',
                        sortable: true,
                        render: time => {
                            const date = time.split('.')[0];
                            return react_1.default.createElement("span", null,
                                date.split('T')[0],
                                " ",
                                date.split('T')[1]);
                        },
                    };
                }
                let width = false;
                const arrayCompilance = ["rule.pci_dss", "rule.gdpr", "rule.nist_800_53", "rule.tsc", "rule.hipaa"];
                if (item === 'rule.level') {
                    width = '75px';
                }
                if (item === 'rule.id') {
                    width = '90px';
                }
                if (item === 'rule.description' && this.state.columns.indexOf('syscheck.event') === -1) {
                    width = '30%';
                }
                if (item === 'syscheck.event') {
                    width = '100px';
                }
                if (arrayCompilance.indexOf(item) !== -1) {
                    width = '150px';
                }
                let column = {
                    field: item,
                    name: (react_1.default.createElement("span", { onMouseEnter: () => { this.setState({ hover: item }); }, onMouseLeave: () => { this.setState({ hover: "" }); }, style: { display: "inline-flex" } },
                        this.nameEquivalences[item] || item,
                        " ",
                        this.state.hover === item &&
                            react_1.default.createElement(eui_1.EuiToolTip, { position: "top", content: `Remove column` },
                                react_1.default.createElement(eui_1.EuiButtonIcon, { style: { paddingBottom: 12, marginBottom: "-10px", paddingTop: 0 }, onClick: (e) => { this.removeColumn(item); e.stopPropagation(); }, iconType: "cross", "aria-label": "Filter", iconSize: "s" })))),
                    sortable: true
                };
                if (width) {
                    column.width = width;
                }
                return column;
            });
            return columns;
        };
        this.onTableChange = ({ page = {}, sort = {} }) => {
            const { index: pageIndex, size: pageSize } = page;
            const { field: sortField, direction: sortDirection } = sort;
            this.setState({
                pageIndex,
                pageSize,
                sortField,
                sortDirection,
            }, async () => this.getAlerts());
        };
        this.onQuerySubmit = (payload) => {
            const { dateRange, query } = payload;
            this.timefilter.setTime(dateRange);
            this.setState({ dateRange, query });
        };
        this.onFiltersUpdated = (filters) => {
            this.filterManager.setFilters(filters);
            this.setState({ searchBarFilters: filters });
        };
        this.KibanaServices = kibana_services_1.getServices();
        this.filterManager = new public_1.FilterManager(new_platform_1.npSetup.core.uiSettings);
        this.timefilter = this.KibanaServices.timefilter;
        this.state = {
            sort: {},
            alerts: [],
            total: 0,
            pageIndex: 0,
            pageSize: 10,
            sortField: 'timestamp',
            sortDirection: 'desc',
            isLoading: false,
            requestFilters: {},
            requestSize: 500,
            requestOffset: 0,
            itemIdToExpandedRowMap: {},
            dateRange: this.timefilter.getTime(),
            query: { language: "kuery", query: "" },
            searchBarFilters: [],
            elasticQuery: {},
            filters: props.initialFilters,
            columns: [],
            hover: ""
        };
        this.wazuhConfig = new wazuh_config_1.WazuhConfig();
        this.nameEquivalences = {
            "syscheck.event": "Action",
            "rule.id": "Rule ID",
            "rule.description": "Description",
            "rule.level": "Level",
            "rule.mitre.id": "Technique(s)",
            "rule.mitre.tactic": "Tactic(s)",
            "rule.pci_dss": "PCI DSS",
            "rule.gdpr": "GDPR",
            "rule.nist_800_53": "NIST 800-53",
            "rule.tsc": "TSC",
            "rule.hipaa": "HIPAA",
        };
        this.hideCreateCustomLabel.bind(this);
        this.onQuerySubmit.bind(this);
        this.onFiltersUpdated.bind(this);
        this.hideCreateCustomLabel();
    }
    async componentDidMount() {
        this._isMount = true;
        try {
            this.setState({ columns: this.props.initialColumns }); //initial columns
            await this.getIndexPattern();
            this.getAlerts();
        }
        catch (err) {
            console.log(err);
        }
    }
    componentWillUnmount() {
        this._isMount = false;
    }
    async componentDidUpdate() {
        if (!this._isMount) {
            return;
        }
        try {
            await this.getAlerts();
        }
        catch (err) {
            console.log(err);
        }
    }
    async getIndexPattern() {
        this.indexPattern = { ...await this.KibanaServices.indexPatterns.get(app_state_1.AppState.getCurrentPattern()) };
        const fields = [];
        Object.keys(this.indexPattern.fields).forEach(item => {
            if (isNaN(item)) {
                fields.push(this.indexPattern.fields[item]);
            }
            else if (this.props.includeFilters && this.indexPattern.fields[item].name.includes(this.props.includeFilters)) {
                fields.unshift(this.indexPattern.fields[item]);
            }
            else {
                fields.push(this.indexPattern.fields[item]);
            }
        });
        this.indexPattern.fields = fields;
    }
    filtersAsArray(filters) {
        const keys = Object.keys(filters);
        const result = [];
        for (var i = 0; i < keys.length; i++) {
            const item = {};
            item[keys[i]] = filters[keys[i]];
            result.push(item);
        }
        return result;
    }
    buildFilter() {
        const dateParse = ds => /\d+-\d+-\d+T\d+:\d+:\d+.\d+Z/.test(ds) ? datemath_1.default.parse(ds).toDate().getTime() : ds;
        const { searchBarFilters, query } = this.state;
        const { hideManagerAlerts } = this.wazuhConfig.getConfig();
        const extraFilters = [];
        if (hideManagerAlerts)
            extraFilters.push({
                meta: {
                    alias: null,
                    disabled: false,
                    key: 'agent.id',
                    negate: true,
                    params: { query: '000' },
                    type: 'phrase',
                    index: this.indexPattern.title
                },
                query: { match_phrase: { 'agent.id': '000' } },
                $state: { store: 'appState' }
            });
        const elasticQuery = common_1.buildEsQuery(undefined, query, [...searchBarFilters, ...extraFilters], common_1.getEsQueryConfig(new_platform_1.npSetup.core.uiSettings));
        const pattern = app_state_1.AppState.getCurrentPattern();
        const { filters, sortField, sortDirection } = this.state;
        const { from: oldFrom, to: oldTo } = this.timefilter.getTime();
        const sort = { ...(sortField && { [sortField]: { "order": sortDirection } }) };
        const offset = Math.floor((this.state.pageIndex * this.state.pageSize) / this.state.requestSize) * this.state.requestSize;
        const from = dateParse(oldFrom);
        const to = dateParse(oldTo);
        return { filters, sort, from, to, offset, pattern, elasticQuery };
    }
    async getAlerts() {
        if (!this.indexPattern)
            return;
        //compare filters so we only make a request into Elasticsearch if needed
        const newFilters = this.buildFilter();
        try {
            if (JSON.stringify(newFilters) !== JSON.stringify(this.state.requestFilters) && !this.state.isLoading) {
                if (newFilters.offset === this.state.requestFilters.offset) // we only reset pageIndex to 0 if the requestFilters has changed but the offset is the same
                    this.setState({ isLoading: true, pageIndex: 0 });
                else
                    this.setState({ isLoading: true });
                let filtersReq = [...newFilters['filters'], ...this.props.implicitFilters];
                if (store_1.default.getState().appStateReducers.currentAgentData.id) {
                    filtersReq.push({ "agent.id": store_1.default.getState().appStateReducers.currentAgentData.id });
                }
                const alerts = await generic_request_1.GenericRequest.request('POST', `/elastic/alerts`, {
                    ...newFilters,
                    filters: filtersReq
                });
                if (this._isMount) {
                    this.setState({ alerts: alerts.data.alerts, total: alerts.data.hits, isLoading: false, requestFilters: newFilters, filters: newFilters.filters });
                    this.props.updateTotalHits(alerts.data.hits);
                }
            }
        }
        catch (err) {
            if (this._isMount) {
                this.setState({ alerts: [], total: 0, isLoading: false, requestFilters: newFilters, filters: newFilters.filters });
                this.props.updateTotalHits(0);
            }
        }
    }
    removeColumn(id) {
        if (this.state.columns.length < 2) {
            this.showToast('warning', "At least one column must be selected", 3000);
            return;
        }
        const columns = this.state.columns;
        columns.splice(columns.findIndex(v => v === id), 1);
        this.setState(columns);
    }
    addColumn(id) {
        if (this.state.columns.length > 11) {
            this.showToast('warning', 'The maximum number of columns is 10', 3000);
            return;
        }
        if (this.state.columns.find(element => element === id)) {
            this.removeColumn(id);
            return;
        }
        const columns = this.state.columns;
        columns.push(id);
        this.setState(columns);
    }
    getpageIndexItems() {
        let items = [];
        const start = (this.state.pageIndex * this.state.pageSize) % this.state.requestSize;
        const end = start + this.state.pageSize;
        for (let i = start; i < end && (this.state.pageIndex * this.state.pageSize) < this.state.total; i++) {
            if (this.state.alerts[i] && this.state.alerts[i]._source) {
                items.push({ ...this.state.alerts[i]._source, _id: this.state.alerts[i]._id });
            }
        }
        return items;
    }
    getFiltersAsObject(filters) {
        var result = {};
        for (var i = 0; i < filters.length; i++) {
            result = { ...result, ...filters[i] };
        }
        return result;
    }
    /**
    * Adds a new negated filter with format { "filter_key" : "filter_value" }, e.g. {"agent.id": "001"}
    * @param filter
    */
    addFilterOut(filter) {
        const key = Object.keys(filter)[0];
        const value = filter[key];
        const valuesArray = Array.isArray(value) ? [...value] : [value];
        const filters = this.state.searchBarFilters;
        valuesArray.map((item) => {
            const formattedFilter = common_1.buildPhraseFilter({ name: key, type: "string" }, item, this.indexPattern);
            formattedFilter.meta.negate = true;
            filters.push(formattedFilter);
        });
        this.filterManager.setFilters(filters);
        this.setState({ searchBarFilters: filters });
    }
    /**
     * Adds a new filter with format { "filter_key" : "filter_value" }, e.g. {"agent.id": "001"}
     * @param filter
     */
    addFilter(filter) {
        const key = Object.keys(filter)[0];
        const value = filter[key];
        const valuesArray = Array.isArray(value) ? [...value] : [value];
        const filters = this.state.searchBarFilters;
        valuesArray.map((item) => {
            const formattedFilter = common_1.buildPhraseFilter({ name: key, type: "string" }, item, this.indexPattern);
            filters.push(formattedFilter);
        });
        this.filterManager.setFilters(filters);
        this.setState({ searchBarFilters: filters });
    }
    getSearchBar() {
        const { filterManager, KibanaServices } = this;
        const storage = {
            ...window.localStorage,
            get: (key) => JSON.parse(window.localStorage.getItem(key) || '{}'),
            set: (key, value) => window.localStorage.setItem(key, JSON.stringify(value)),
            remove: (key) => window.localStorage.removeItem(key)
        };
        const http = {
            ...KibanaServices.indexPatterns.apiClient.http
        };
        const savedObjects = {
            ...KibanaServices.indexPatterns.savedObjectsClient
        };
        const data = {
            ...KibanaServices.data,
            query: {
                ...KibanaServices.data.query,
                filterManager,
            }
        };
        const { dateRange, query, searchBarFilters } = this.state;
        return (react_1.default.createElement(context_1.KibanaContextProvider, { services: {
                ...KibanaServices,
                appName: "wazuhFim",
                data,
                filterManager,
                storage,
                http,
                savedObjects
            } },
            react_1.default.createElement(react_2.I18nProvider, null,
                react_1.default.createElement(public_1.SearchBar, Object.assign({ indexPatterns: [this.indexPattern], filters: searchBarFilters, dateRangeFrom: dateRange.from, dateRangeTo: dateRange.to, onQuerySubmit: this.onQuerySubmit, onFiltersUpdated: this.onFiltersUpdated, query: query, timeHistory: this.timefilter._history }, { appName: 'wazuhFim' })))));
    }
    render() {
        if (this.state.isLoading)
            return (react_1.default.createElement("div", { style: { alignSelf: "center" } },
                react_1.default.createElement(eui_1.EuiLoadingSpinner, { size: "xl" }),
                " "));
        const { total, searchBarFilters, itemIdToExpandedRowMap } = this.state;
        const getRowProps = item => {
            const { _id } = item;
            return {
                'data-test-subj': `row-${_id}`,
                className: 'customRowClass',
                onClick: () => this.toggleDetails(item),
            };
        };
        const pageIndexItems = this.getpageIndexItems();
        const columns = this.columns();
        const sorting = {
            sort: {
                //@ts-ignore
                field: this.state.sortField,
                direction: this.state.sortDirection,
            }
        };
        const pagination = {
            pageIndex: this.state.pageIndex,
            pageSize: this.state.pageSize,
            totalItemCount: this.state.total > 10000 ? 10000 : this.state.total,
            pageSizeOptions: [10, 25, 50],
        };
        const noResultsText = `No results match for this search criteria`;
        return (react_1.default.createElement("div", { className: 'wz-discover hide-filter-control' },
            this.getSearchBar(),
            total
                ? react_1.default.createElement(eui_1.EuiFlexGroup, null,
                    react_1.default.createElement(eui_1.EuiFlexItem, null, pageIndexItems.length && (react_1.default.createElement(eui_1.EuiBasicTable, { items: pageIndexItems, className: "module-discover-table", itemId: "_id", itemIdToExpandedRowMap: itemIdToExpandedRowMap, isExpandable: true, columns: columns, rowProps: getRowProps, pagination: pagination, sorting: sorting, onChange: this.onTableChange }))))
                : react_1.default.createElement(eui_1.EuiFlexGroup, null,
                    react_1.default.createElement(eui_1.EuiFlexItem, null,
                        react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
                        react_1.default.createElement(eui_1.EuiCallOut, { title: noResultsText, color: "warning", iconType: "alert" })))));
    }
}
exports.Discover = Discover;
