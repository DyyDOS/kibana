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
exports.Techniques = void 0;
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
const flyout_technique_1 = require("./components/flyout-technique/");
const lib_1 = require("../../lib");
const kibana_services_1 = require("plugins/kibana/discover/kibana_services");
const withWindowSize_1 = require("../../../../../components/common/hocs/withWindowSize");
const wz_request_1 = require("../../../../../react-services/wz-request");
exports.Techniques = withWindowSize_1.withWindowSize(class Techniques extends react_1.Component {
    constructor(props) {
        super(props);
        this._isMount = false;
        this.delaySearchTime = 400; // delay time in search bar techniques to do the request. This prevents you from making a request with every change in the search term and wait this time instead after last change
        this.onSearchValueChange = async (e) => {
            const searchValue = e.target.value;
            if (this.timerDelaySearch) {
                clearTimeout(this.timerDelaySearch);
            }
            ;
            if (searchValue) {
                this.setState({ searchValue });
            }
            else {
                this._isMount && this.setState({ searchValue, filteredTechniques: false, isSearching: false });
                return;
            }
            this.timerDelaySearch = setTimeout(async () => {
                try {
                    if (searchValue) {
                        this._isMount && this.setState({ isSearching: true });
                        const response = await wz_request_1.WzRequest.apiReq('GET', '/mitre', {
                            select: "id",
                            search: searchValue,
                            limit: 500
                        });
                        const filteredTechniques = ((((response || {}).data || {}).data).items || []).map(item => item.id);
                        this._isMount && this.setState({ filteredTechniques, isSearching: false });
                    }
                    else {
                        this._isMount && this.setState({ filteredTechniques: false, isSearching: false });
                    }
                }
                catch (error) {
                    this._isMount && this.setState({ filteredTechniques: false, isSearching: false });
                }
            }, this.delaySearchTime); // delay time in search bar techniques to do the request. This prevents you from making a request with every change in the search term and wait this time instead after last change
        };
        this.onChangeFlyout = (isFlyoutVisible) => {
            this.setState({ isFlyoutVisible });
        };
        this.state = {
            searchValue: "",
            isFlyoutVisible: false,
            currentTechniqueData: {},
            techniquesCount: [],
            currentTechnique: '',
            hideAlerts: false,
            actionsOpen: "",
            filteredTechniques: false,
            isSearching: false
        };
        this.onChangeFlyout.bind(this);
    }
    async componentDidMount() {
        this._isMount = true;
    }
    shouldComponentUpdate(nextProps, nextState) {
        const { filterParams, indexPattern, selectedTactics, isLoading } = this.props;
        if (nextProps.isLoading !== isLoading)
            return true;
        if (JSON.stringify(nextProps.filterParams) !== JSON.stringify(filterParams))
            return true;
        if (JSON.stringify(nextProps.indexPattern) !== JSON.stringify(indexPattern))
            return true;
        if (JSON.stringify(nextState.selectedTactics) !== JSON.stringify(selectedTactics))
            return true;
        return false;
    }
    componentDidUpdate(prevProps) {
        const { isLoading, tacticsObject, filters } = this.props;
        if (JSON.stringify(prevProps.tacticsObject) !== JSON.stringify(tacticsObject) || (isLoading !== prevProps.isLoading))
            this.getTechniquesCount();
    }
    componentWillUnmount() {
        this._isMount = false;
        if (this.timerDelaySearch) {
            clearTimeout(this.timerDelaySearch);
        }
        ;
    }
    async getTechniquesCount() {
        try {
            const { indexPattern, filters } = this.props;
            if (!indexPattern) {
                return;
            }
            const aggs = {
                techniques: {
                    terms: {
                        field: "rule.mitre.id",
                        size: 1000,
                    }
                }
            };
            this._isMount && this.setState({ loadingAlerts: true });
            // TODO: use `status` and `statusText`  to show errors
            // @ts-ignore
            const { data, status, statusText, } = await lib_1.getElasticAlerts(indexPattern, filters, aggs);
            const { buckets } = data.aggregations.techniques;
            this._isMount && this.setState({ techniquesCount: buckets, loadingAlerts: false });
        }
        catch (err) {
            // this.showToast(
            //   'danger',
            //   'Error',
            //   `Mitre alerts could not be fetched: ${err}`,
            //   3000
            // );
            this._isMount && this.setState({ loadingAlerts: false });
        }
    }
    buildPanel(techniqueID) {
        return [
            {
                id: 0,
                title: 'Actions',
                items: [
                    {
                        name: 'Filter for value',
                        icon: react_1.default.createElement(eui_1.EuiIcon, { type: "magnifyWithPlus", size: "m" }),
                        onClick: () => {
                            this.closeActionsMenu();
                            this.addFilter({ key: 'rule.mitre.id', value: techniqueID, negate: false });
                        },
                    },
                    {
                        name: 'Filter out value',
                        icon: react_1.default.createElement(eui_1.EuiIcon, { type: "magnifyWithMinus", size: "m" }),
                        onClick: () => {
                            this.closeActionsMenu();
                            this.addFilter({ key: 'rule.mitre.id', value: techniqueID, negate: true });
                        },
                    },
                    {
                        name: 'View technique details',
                        icon: react_1.default.createElement(eui_1.EuiIcon, { type: "filebeatApp", size: "m" }),
                        onClick: () => {
                            this.closeActionsMenu();
                            this.showFlyout(techniqueID);
                        },
                    }
                ],
            }
        ];
    }
    techniqueColumnsResponsive() {
        if (this.props && this.props.windowSize) {
            return this.props.windowSize.width < 930 ? 2
                : this.props.windowSize.width < 1200 ? 3
                    : 4;
        }
        else {
            return 4;
        }
    }
    renderFacet() {
        const { tacticsObject } = this.props;
        const { techniquesCount } = this.state;
        let tacticsToRender = [];
        const currentTechniques = Object.keys(tacticsObject).map(tacticsKey => ({ tactic: tacticsKey, techniques: tacticsObject[tacticsKey] }))
            .filter(tactic => this.props.selectedTactics[tactic.tactic])
            .map(tactic => tactic.techniques)
            .flat()
            .filter((techniqueID, index, array) => array.indexOf(techniqueID) === index);
        tacticsToRender = currentTechniques
            .filter(techniqueID => this.state.filteredTechniques ? this.state.filteredTechniques.includes(techniqueID) : techniqueID)
            .map(techniqueID => {
            return {
                id: techniqueID,
                label: `${techniqueID} - ${lib_1.mitreTechniques[techniqueID].name}`,
                quantity: (techniquesCount.find(item => item.key === techniqueID) || {}).doc_count || 0
            };
        })
            .filter(technique => this.state.hideAlerts ? technique.quantity !== 0 : true);
        const tacticsToRenderOrdered = tacticsToRender.sort((a, b) => b.quantity - a.quantity).map((item, idx) => {
            const tooltipContent = `View details of ${lib_1.mitreTechniques[item.id].name} (${item.id})`;
            const toolTipAnchorClass = "wz-display-inline-grid" + (this.state.hover === item.id ? " wz-mitre-width" : " ");
            return (react_1.default.createElement(eui_1.EuiFlexItem, { onMouseEnter: () => this.setState({ hover: item.id }), onMouseLeave: () => this.setState({ hover: "" }), key: idx, style: { border: "1px solid #8080804a", maxHeight: 41 } },
                react_1.default.createElement(eui_1.EuiPopover, { id: "techniqueActionsContextMenu", anchorClassName: "wz-width-100", button: (react_1.default.createElement(eui_1.EuiFacetButton, { style: { width: "100%", padding: "0 5px 0 5px", lineHeight: "40px" }, quantity: item.quantity, onClick: () => this.showFlyout(item.id) },
                        react_1.default.createElement(eui_1.EuiToolTip, { position: "top", content: tooltipContent, anchorClassName: toolTipAnchorClass },
                            react_1.default.createElement("span", { style: {
                                    display: "block",
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis"
                                } },
                                item.id,
                                " - ",
                                lib_1.mitreTechniques[item.id].name)),
                        this.state.hover === item.id &&
                            react_1.default.createElement("span", { style: { float: "right" } },
                                react_1.default.createElement(eui_1.EuiToolTip, { position: "top", content: "Show " + item.id + " in Dashboard" },
                                    react_1.default.createElement(eui_1.EuiIcon, { onClick: (e) => { this.openDashboard(e, item.id); e.stopPropagation(); }, color: "primary", type: "visualizeApp" })),
                                " \u00A0",
                                react_1.default.createElement(eui_1.EuiToolTip, { position: "top", content: "Inspect " + item.id + " in Events" },
                                    react_1.default.createElement(eui_1.EuiIcon, { onClick: (e) => { this.openDiscover(e, item.id); e.stopPropagation(); }, color: "primary", type: "discoverApp" }))))), isOpen: this.state.actionsOpen === item.id, closePopover: () => this.closeActionsMenu(), panelPaddingSize: "none", style: { width: "100%" }, withTitle: true, anchorPosition: "downLeft" },
                    react_1.default.createElement(eui_1.EuiContextMenu, { initialPanelId: 0, panels: this.buildPanel(item.id) }))));
        });
        if (this.state.isSearching || this.state.loadingAlerts || this.props.isLoading) {
            return (react_1.default.createElement(eui_1.EuiFlexItem, { style: { height: "calc(100vh - 410px)", alignItems: 'center' } },
                react_1.default.createElement(eui_1.EuiLoadingSpinner, { size: 'xl' })));
        }
        if (tacticsToRender.length) {
            return (react_1.default.createElement(eui_1.EuiFlexGrid, { columns: this.techniqueColumnsResponsive(), gutterSize: "s", style: { maxHeight: "calc(100vh - 385px)", overflow: "overlay", overflowX: "hidden", paddingRight: 10 } }, tacticsToRenderOrdered));
        }
        else {
            return react_1.default.createElement(eui_1.EuiCallOut, { title: 'There are no results.', iconType: 'help', color: 'warning' });
        }
    }
    openDiscover(e, techniqueID) {
        this.addFilter({ key: 'rule.mitre.id', value: techniqueID, negate: false });
        this.props.onSelectedTabChanged('events');
    }
    openDashboard(e, techniqueID) {
        this.addFilter({ key: 'rule.mitre.id', value: techniqueID, negate: false });
        this.props.onSelectedTabChanged('dashboard');
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
    async closeActionsMenu() {
        this.setState({ actionsOpen: false });
    }
    async showActionsMenu(techniqueData) {
        this.setState({ actionsOpen: techniqueData });
    }
    async showFlyout(techniqueData) {
        this.setState({ isFlyoutVisible: true, currentTechnique: techniqueData });
    }
    closeFlyout() {
        this.setState({ isFlyoutVisible: false, currentTechniqueData: {}, });
    }
    hideAlerts() {
        this.setState({ hideAlerts: !this.state.hideAlerts });
    }
    render() {
        const { isFlyoutVisible, currentTechnique } = this.state;
        return (react_1.default.createElement("div", { style: { padding: 10 } },
            react_1.default.createElement(eui_1.EuiFlexGroup, null,
                react_1.default.createElement(eui_1.EuiFlexItem, { grow: true },
                    react_1.default.createElement(eui_1.EuiTitle, { size: "m" },
                        react_1.default.createElement("h1", null, "Techniques"))),
                react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                    react_1.default.createElement(eui_1.EuiFlexGroup, null,
                        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                            react_1.default.createElement(eui_1.EuiText, { grow: false },
                                react_1.default.createElement("span", null, "Hide techniques with no alerts "),
                                " \u00A0",
                                react_1.default.createElement(eui_1.EuiSwitch, { label: "", checked: this.state.hideAlerts, onChange: e => this.hideAlerts() })))))),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "xs" }),
            react_1.default.createElement(eui_1.EuiFieldSearch, { fullWidth: true, placeholder: "Filter techniques of selected tactic/s", value: this.state.searchValue, onChange: e => this.onSearchValueChange(e), isClearable: true, isLoading: this.state.isSearching, "aria-label": "Use aria labels when no actual label is in use" }),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
            react_1.default.createElement("div", null, this.renderFacet()),
            isFlyoutVisible &&
                react_1.default.createElement(eui_1.EuiOverlayMask
                // @ts-ignore
                , { 
                    // @ts-ignore
                    onClick: (e) => { e.target.className === 'euiOverlayMask' && this.onChangeFlyout(false); } },
                    react_1.default.createElement(flyout_technique_1.FlyoutTechnique, { openDashboard: (e, itemId) => this.openDashboard(e, itemId), openDiscover: (e, itemId) => this.openDiscover(e, itemId), onChangeFlyout: this.onChangeFlyout, currentTechniqueData: this.state.currentTechniqueData, currentTechnique: currentTechnique }))));
    }
});
