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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Wazuh app - React component for building the Overview welcome screen.
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
const react_1 = __importStar(require("react"));
const globalBreadcrumbActions_1 = require("../../../redux/actions/globalBreadcrumbActions");
const appStateActions_1 = require("../../../redux/actions/appStateActions");
const store_1 = __importDefault(require("../../../redux/store"));
const react_redux_1 = require("react-redux");
const tab_description_1 = require("../../../../server/reporting/tab-description");
class WzCurrentOverviewSection extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = {};
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
            const breadcrumb = currentAgent.id ? [
                { text: '' },
                { text: 'Modules', href: '/app/wazuh#/overview' },
                { agent: currentAgent },
                { text: tab_description_1.TabDescription[this.props.currentTab].title },
            ] :
                [
                    { text: '' },
                    { text: 'Modules', href: '/app/wazuh#/overview' },
                    { text: tab_description_1.TabDescription[this.props.currentTab].title },
                ];
            store_1.default.dispatch(globalBreadcrumbActions_1.updateGlobalBreadcrumb(breadcrumb));
            $('#breadcrumbNoTitle').attr("title", "");
        }
    }
    componentDidMount() {
        this.setGlobalBreadcrumb();
        store_1.default.dispatch(appStateActions_1.updateCurrentTab(this.props.currentTab));
    }
    async componentDidUpdate() {
        if (this.props.state.currentTab !== this.props.currentTab) {
            const forceUpdate = this.props.tabView === 'discover';
            if (this.props.state.currentTab)
                this.props.switchTab(this.props.state.currentTab, forceUpdate);
        }
        this.setGlobalBreadcrumb();
    }
    componentWillUnmount() {
        store_1.default.dispatch(appStateActions_1.updateCurrentTab(""));
    }
    render() {
        return (react_1.default.createElement("span", null));
    }
}
const mapStateToProps = state => {
    return {
        state: state.appStateReducers,
    };
};
exports.default = react_redux_1.connect(mapStateToProps, null)(WzCurrentOverviewSection);
