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
const eui_1 = require("@elastic/eui");
const globalBreadcrumbActions_1 = require("../../../redux/actions/globalBreadcrumbActions");
const appStateActions_1 = require("../../../redux/actions/appStateActions");
const store_1 = __importDefault(require("../../../redux/store"));
const chrome_1 = __importDefault(require("ui/chrome"));
const react_redux_1 = require("react-redux");
const tab_description_1 = require("../../../../server/reporting/tab-description");
class WzCurrentAgentsSection extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    setGlobalBreadcrumb() {
        if (tab_description_1.TabDescription[this.props.currentTab]) {
            const breadcrumb = [
                { text: '' },
                {
                    text: 'Agents',
                    href: "#/agents-preview"
                },
                {
                    text: `${this.props.agent.name} (${this.props.agent.id})`,
                    onClick: () => {
                        window.location.href = `#/agents?agent=${this.props.agent.id}`;
                        this.router.reload();
                    },
                    className: 'wz-global-breadcrumb-btn euiBreadcrumb--truncate',
                    truncate: false,
                },
                { text: tab_description_1.TabDescription[this.props.currentTab].title },
            ];
            store_1.default.dispatch(globalBreadcrumbActions_1.updateGlobalBreadcrumb(breadcrumb));
        }
    }
    async componentDidMount() {
        this.setGlobalBreadcrumb();
        store_1.default.dispatch(appStateActions_1.updateCurrentTab(this.props.currentTab));
        const $injector = await chrome_1.default.dangerouslyGetActiveInjector();
        this.router = $injector.get('$route');
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
        return (react_1.default.createElement("span", null, this.props.currentTab && tab_description_1.TabDescription[this.props.currentTab] && tab_description_1.TabDescription[this.props.currentTab].title && (react_1.default.createElement(eui_1.EuiTitle, { size: 's' },
            react_1.default.createElement("h2", null, tab_description_1.TabDescription[this.props.currentTab].title)))));
    }
}
const mapStateToProps = state => {
    return {
        state: state.appStateReducers,
    };
};
exports.default = react_redux_1.connect(mapStateToProps, null)(WzCurrentAgentsSection);
