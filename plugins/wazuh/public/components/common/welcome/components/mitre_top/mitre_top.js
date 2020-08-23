"use strict";
/*
 * Wazuh app - React component information about MITRE top tactics.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MitreTopTactics = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
const flyout_technique_1 = require("../../../../../components/overview/mitre/components/techniques/components/flyout-technique");
const lib_1 = require("../../../../../components/overview/mitre/lib");
const kibana_services_1 = require("plugins/kibana/discover/kibana_services");
const lib_2 = require("./lib");
const app_navigate_1 = require("../../../../../react-services/app-navigate");
class MitreTopTactics extends react_1.Component {
    constructor(props) {
        super(props);
        this._isMount = false;
        this.onChangeFlyout = (flyoutOn) => {
            this.setState({ flyoutOn });
        };
        this.KibanaServices = kibana_services_1.getServices();
        this.timefilter = this.KibanaServices.timefilter;
        this.state = {
            alertsCount: [],
            isLoading: true,
            time: this.timefilter.getTime(),
            selectedTactic: undefined,
            flyoutOn: false,
            selectedTechnique: ''
        };
    }
    async componentDidMount() {
        this._isMount = true;
        this.subscription = this.timefilter.getTimeUpdate$().subscribe(() => this._isMount && this.setState({ time: this.timefilter.getTime(), isLoading: true }));
        this.indexPattern = await lib_1.getIndexPattern();
        lib_2.getMitreCount(this.props.agentId, this.timefilter.getTime(), undefined)
            .then(alertsCount => this.setState({ alertsCount, isLoading: false }));
    }
    async componentWillUnmount() {
        this._isMount = false;
        this.subscription.unsubscribe();
    }
    shouldComponentUpdate(nextProp, nextState) {
        const { selectedTactic, isLoading, alertsCount } = this.state;
        if (nextState.selectedTactic !== selectedTactic)
            return true;
        if (!isLoading)
            return true;
        if (JSON.stringify(nextState.alertsCount) !== JSON.stringify(alertsCount))
            return true;
        return false;
    }
    async componentDidUpdate() {
        const { selectedTactic, isLoading } = this.state;
        if (isLoading) {
            lib_2.getMitreCount(this.props.agentId, this.timefilter.getTime(), selectedTactic)
                .then(alertsCount => {
                if (alertsCount.length === 0) {
                    this.setState({ selectedTactic: undefined, isLoading: false });
                }
                this.setState({ alertsCount, isLoading: false });
            });
        }
    }
    renderLoadingStatus() {
        const { isLoading } = this.state;
        if (!isLoading)
            return;
        return (react_1.default.createElement("div", { style: { display: 'block', textAlign: "center", paddingTop: 100 } },
            react_1.default.createElement(eui_1.EuiLoadingChart, { size: "xl" })));
    }
    renderTacticsTop() {
        const { alertsCount, isLoading } = this.state;
        if (isLoading || alertsCount.length === 0)
            return;
        return (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement("div", { className: "wz-agents-mitre" },
                react_1.default.createElement(eui_1.EuiText, { size: "xs" },
                    react_1.default.createElement(eui_1.EuiFlexGroup, null,
                        react_1.default.createElement(eui_1.EuiFlexItem, { style: { margin: 0, padding: '12px 0px 0px 10px' } },
                            react_1.default.createElement("h3", null, "Top Tactics")))),
                react_1.default.createElement(eui_1.EuiFlexGroup, null,
                    react_1.default.createElement(eui_1.EuiFlexItem, null, alertsCount.map((tactic) => (react_1.default.createElement(eui_1.EuiFacetButton, { key: tactic.key, quantity: tactic.doc_count, onClick: () => {
                            this.setState({
                                selectedTactic: tactic.key,
                                isLoading: true,
                            });
                        } }, tactic.key))))))));
    }
    renderTechniques() {
        const { selectedTactic, alertsCount, isLoading } = this.state;
        if (isLoading)
            return;
        return (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(eui_1.EuiText, { size: "xs" },
                react_1.default.createElement(eui_1.EuiFlexGroup, null,
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                        react_1.default.createElement(eui_1.EuiButtonIcon, { size: 's', color: 'primary', onClick: () => {
                                this.setState({
                                    selectedTactic: undefined,
                                    isLoading: true,
                                    flyoutOn: false
                                });
                            }, iconType: "sortLeft", "aria-label": "Back Top Tactics" })),
                    react_1.default.createElement(eui_1.EuiFlexItem, null,
                        react_1.default.createElement("h3", null, selectedTactic)))),
            react_1.default.createElement(eui_1.EuiFlexGroup, null,
                react_1.default.createElement(eui_1.EuiFlexItem, null, alertsCount.map((tactic) => (react_1.default.createElement(eui_1.EuiFacetButton, { key: tactic.key, quantity: tactic.doc_count, onClick: () => this.showFlyout(tactic.key) }, tactic.key)))))));
    }
    renderEmptyPrompt() {
        const { isLoading } = this.state;
        if (isLoading)
            return;
        return (react_1.default.createElement(eui_1.EuiEmptyPrompt, { iconType: "stats", title: react_1.default.createElement("h4", null, "No results"), body: react_1.default.createElement(react_1.Fragment, null,
                react_1.default.createElement("p", null, "No Mitre results were found in the selected time range.")) }));
    }
    closeFlyout() {
        this.setState({ flyoutOn: false });
    }
    showFlyout(tactic) {
        this.setState({
            selectedTechnique: tactic,
            flyoutOn: true
        });
    }
    openDiscover(e, techniqueID) {
        app_navigate_1.AppNavigate.navigateToModule(e, 'overview', { "tab": 'mitre', "tabView": "discover", filters: { 'rule.mitre.id': techniqueID } });
    }
    openDashboard(e, techniqueID) {
        app_navigate_1.AppNavigate.navigateToModule(e, 'overview', { "tab": 'mitre', "tabView": "dashboard", filters: { 'rule.mitre.id': techniqueID } });
    }
    render() {
        const { flyoutOn, selectedTactic, selectedTechnique, alertsCount } = this.state;
        const tacticsTop = this.renderTacticsTop();
        const tecniquesTop = this.renderTechniques();
        const loading = this.renderLoadingStatus();
        const emptyPrompt = this.renderEmptyPrompt();
        return (react_1.default.createElement(react_1.Fragment, null,
            loading,
            !selectedTactic || alertsCount.length === 0 ? tacticsTop : tecniquesTop,
            alertsCount.length === 0 && emptyPrompt,
            flyoutOn &&
                react_1.default.createElement(eui_1.EuiOverlayMask, { onClick: (e) => { e.target.className === 'euiOverlayMask' && this.closeFlyout(); } },
                    react_1.default.createElement(flyout_technique_1.FlyoutTechnique, { openDashboard: (e, itemId) => this.openDashboard(e, itemId), openDiscover: (e, itemId) => this.openDiscover(e, itemId), implicitFilters: [{ "agent.id": this.props.agentId }], agentId: this.props.agentId, onChangeFlyout: this.onChangeFlyout, currentTechnique: selectedTechnique }))));
    }
}
exports.MitreTopTactics = MitreTopTactics;
