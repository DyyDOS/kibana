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
exports.Tactics = void 0;
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
const lib_1 = require("../../lib");
const notify_1 = require("ui/notify");
class Tactics extends react_1.Component {
    constructor(props) {
        super(props);
        this._isMount = false;
        this.showToast = (color, title, text, time) => {
            notify_1.toastNotifications.add({
                color: color,
                title: title,
                text: text,
                toastLifeTimeMs: time
            });
        };
        this.state = {
            tacticsList: [],
            tacticsCount: [],
            allSelected: false,
            loadingAlerts: true,
            isPopoverOpen: false,
            firstTime: true
        };
    }
    async componentDidMount() {
        this._isMount = true;
    }
    initTactics() {
        const tacticsIds = Object.keys(this.props.tacticsObject);
        const selectedTactics = {};
        /*let isMax = {};
         tacticsIds.forEach( (item,id) => {
           if(buckets.length){
             const max_doc = buckets[0].doc_count;
             if(!Object.keys(isMax).length){
               buckets.forEach( bucket => {
                if(bucket.doc_count === max_doc){
                  isMax[bucket.key] = true;
                }
               })
             }
            selectedTactics[item] =  isMax[item] ? true : false; //if results are found, only the first tactic is selected
           }else{
            selectedTactics[item] = true;
           }
        });*/
        tacticsIds.forEach((item, id) => {
            selectedTactics[item] = true;
        });
        this.props.onChangeSelectedTactics(selectedTactics);
    }
    shouldComponentUpdate(nextProps, nextState) {
        const { filterParams, indexPattern, selectedTactics, isLoading } = this.props;
        const { tacticsCount, loadingAlerts } = this.state;
        if (nextState.loadingAlerts !== loadingAlerts)
            return true;
        if (nextProps.isLoading !== isLoading)
            return true;
        if (JSON.stringify(nextProps.filterParams) !== JSON.stringify(filterParams))
            return true;
        if (JSON.stringify(nextProps.indexPattern) !== JSON.stringify(indexPattern))
            return true;
        if (JSON.stringify(nextState.tacticsCount) !== JSON.stringify(tacticsCount))
            return true;
        if (JSON.stringify(nextState.selectedTactics) !== JSON.stringify(selectedTactics))
            return true;
        return false;
    }
    async componentDidUpdate(prevProps) {
        const { isLoading, tacticsObject } = this.props;
        if (JSON.stringify(prevProps.tacticsObject) !== JSON.stringify(tacticsObject) || isLoading !== prevProps.isLoading) {
            this.getTacticsCount(this.state.firstTime);
        }
    }
    async getTacticsCount() {
        this.setState({ loadingAlerts: true });
        const { firstTime } = this.state;
        try {
            const { indexPattern, filterParams } = this.props;
            if (!indexPattern) {
                return;
            }
            const aggs = {
                tactics: {
                    terms: {
                        field: "rule.mitre.tactic",
                        size: 1000,
                    }
                }
            };
            // TODO: use `status` and `statusText`  to show errors
            // @ts-ignore
            const { data } = await lib_1.getElasticAlerts(indexPattern, filterParams, aggs);
            const { buckets } = data.aggregations.tactics;
            if (firstTime) {
                this.initTactics(buckets); // top tactics are checked on component mount
            }
            this._isMount && this.setState({ tacticsCount: buckets, loadingAlerts: false, firstTime: false });
        }
        catch (err) {
            this.showToast('danger', 'Error', `Mitre alerts could not be fetched: ${err}`, 3000);
            this.setState({ loadingAlerts: false });
        }
    }
    componentWillUnmount() {
        this._isMount = false;
    }
    facetClicked(id) {
        const { selectedTactics: oldSelected, onChangeSelectedTactics } = this.props;
        const selectedTactics = {
            ...oldSelected,
            [id]: !oldSelected[id]
        };
        onChangeSelectedTactics(selectedTactics);
    }
    getTacticsList() {
        const { tacticsCount } = this.state;
        const { selectedTactics } = this.props;
        const tacticsIds = Object.keys(this.props.tacticsObject);
        const tacticsList = tacticsIds.map(item => {
            const quantity = (tacticsCount.find(tactic => tactic.key === item) || {}).doc_count || 0;
            return {
                id: item,
                label: item,
                quantity,
                onClick: (id) => this.facetClicked(id),
            };
        });
        return (react_1.default.createElement(react_1.default.Fragment, null, tacticsList.sort((a, b) => b.quantity - a.quantity).map(facet => {
            let iconNode;
            return (react_1.default.createElement(eui_1.EuiFacetButton, { key: facet.id, id: `${facet.id}`, quantity: facet.quantity, isSelected: selectedTactics[facet.id], isLoading: this.state.loadingAlerts, icon: iconNode, onClick: facet.onClick ? () => facet.onClick(facet.id) : undefined }, facet.label));
        })));
    }
    checkAllChecked(tacticList) {
        const { selectedTactics } = this.props;
        let allSelected = true;
        tacticList.forEach(item => {
            if (!selectedTactics[item.id])
                allSelected = false;
        });
        if (allSelected !== this.state.allSelected) {
            this.setState({ allSelected });
        }
    }
    onCheckAllClick() {
        const allSelected = !this.state.allSelected;
        const { selectedTactics, onChangeSelectedTactics } = this.props;
        Object.keys(selectedTactics).map(item => {
            selectedTactics[item] = allSelected;
        });
        this.setState({ allSelected });
        onChangeSelectedTactics(selectedTactics);
    }
    onGearButtonClick() {
        this.setState({ isPopoverOpen: !this.state.isPopoverOpen });
    }
    closePopover() {
        this.setState({ isPopoverOpen: false });
    }
    selectAll(status) {
        const { selectedTactics, onChangeSelectedTactics } = this.props;
        Object.keys(selectedTactics).map(item => {
            selectedTactics[item] = status;
        });
        onChangeSelectedTactics(selectedTactics);
    }
    render() {
        const panels = [
            {
                id: 0,
                title: 'Options',
                items: [
                    {
                        name: 'Select all',
                        icon: react_1.default.createElement(eui_1.EuiIcon, { type: "check", size: "m" }),
                        onClick: () => {
                            this.closePopover();
                            this.selectAll(true);
                        },
                    },
                    {
                        name: 'Unselect all',
                        icon: react_1.default.createElement(eui_1.EuiIcon, { type: "cross", size: "m" }),
                        onClick: () => {
                            this.closePopover();
                            this.selectAll(false);
                        },
                    },
                ]
            }
        ];
        return (react_1.default.createElement("div", { style: { backgroundColor: "#80808014", padding: "10px 10px 0 10px", height: "100%" } },
            react_1.default.createElement(eui_1.EuiFlexGroup, null,
                react_1.default.createElement(eui_1.EuiFlexItem, null,
                    react_1.default.createElement(eui_1.EuiTitle, { size: "m" },
                        react_1.default.createElement("h1", null, "Tactics"))),
                react_1.default.createElement(eui_1.EuiFlexItem, { grow: false, style: { marginTop: '15px', marginRight: 8 } },
                    react_1.default.createElement(eui_1.EuiPopover, { button: (react_1.default.createElement(eui_1.EuiButtonIcon, { iconType: "gear", onClick: () => this.onGearButtonClick(), "aria-label": 'tactics options' })), isOpen: this.state.isPopoverOpen, panelPaddingSize: "none", withTitle: true, closePopover: () => this.closePopover() },
                        react_1.default.createElement(eui_1.EuiContextMenu, { initialPanelId: 0, panels: panels })))),
            this.props.isLoading
                ? react_1.default.createElement(eui_1.EuiFlexItem, { style: { alignItems: 'center', marginTop: 50 } },
                    react_1.default.createElement(eui_1.EuiLoadingSpinner, { size: "xl" }))
                : react_1.default.createElement(eui_1.EuiFacetGroup, { style: {} }, this.getTacticsList())));
    }
}
exports.Tactics = Tactics;
