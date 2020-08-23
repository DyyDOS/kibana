"use strict";
/*
 * Wazuh app - React component for add sample data
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
const react_1 = __importStar(require("react"));
const wz_fetch_1 = require("../../controllers/management/components/management/configuration/utils/wz-fetch");
const appStateActions_1 = require("../../redux/actions/appStateActions");
const eui_1 = require("@elastic/eui");
const notify_1 = require("ui/notify");
const wz_request_1 = require("../../react-services/wz-request");
const react_redux_1 = require("react-redux");
;
class WzSampleData extends react_1.Component {
    constructor(props) {
        super(props);
        this.generateAlertsParams = {}; // extra params to add to generateAlerts function in server
        this.categories = [
            {
                title: 'Sample security information',
                description: 'Sample data, visualizations and dashboards for security information (integrity monitoring, Amazon AWS services, Google Cloud Platform, authorization, ssh, web).',
                image: '',
                categorySampleAlertsIndex: 'security'
            },
            {
                title: 'Sample auditing and policy monitoring',
                description: 'Sample data, visualizations and dashboards for events of auditing and policy monitoring (policy monitoring, system auditing, OpenSCAP, CIS-CAT).',
                image: '',
                categorySampleAlertsIndex: 'auditing-policy-monitoring'
            },
            {
                title: 'Sample threat detection and response',
                description: 'Sample data, visualizations and dashboards for threat events of detection and response (vulnerabilities, VirustTotal, Osquery, Docker listener, MITRE).',
                image: '',
                categorySampleAlertsIndex: 'threat-detection'
            }
        ];
        this.state = {};
        this.categories.forEach(category => {
            this.state[category.categorySampleAlertsIndex] = {
                exists: false,
                addDataLoading: false,
                removeDataLoading: false
            };
        });
    }
    async componentDidMount() {
        // Check adminMode
        try {
            const adminMode = await wz_fetch_1.checkAdminMode();
            if (this.props.adminMode !== adminMode) {
                this.props.updateAdminMode(adminMode);
            }
            ;
            if (!adminMode) { // redirect to root path of the application
                window.location.href = `#/`;
            }
            ;
        }
        catch (error) { }
        // Check if sample data for each category was added
        try {
            const results = await PromiseAllRecusiveObject(this.categories.reduce((accum, cur) => {
                accum[cur.categorySampleAlertsIndex] = wz_request_1.WzRequest.genericReq('GET', `/elastic/samplealerts/${cur.categorySampleAlertsIndex}`);
                return accum;
            }, {}));
            this.setState(Object.keys(results).reduce((accum, cur) => {
                accum[cur] = {
                    ...this.state[cur],
                    exists: results[cur].data.exists
                };
                return accum;
            }, { ...this.state }));
        }
        catch (error) { }
        // Get information about cluster/manager
        try {
            const managerInfo = await wz_request_1.WzRequest.apiReq('GET', '/manager/info', {});
            this.generateAlertsParams.manager = {
                name: managerInfo.data.data.name
            };
            if (managerInfo.data.data.cluster) {
                this.generateAlertsParams.cluster = {
                    name: managerInfo.data.data.cluster.name,
                    node: managerInfo.data.data.cluster.node_name
                };
            }
            ;
        }
        catch (error) { }
    }
    showToast(color, title = '', text = '', time = 3000) {
        notify_1.toastNotifications.add({
            color: color,
            title: title,
            text: text,
            toastLifeTimeMs: time,
        });
    }
    ;
    async addSampleData(category) {
        try {
            this.setState({ [category.categorySampleAlertsIndex]: {
                    ...this.state[category.categorySampleAlertsIndex],
                    addDataLoading: true
                } });
            await wz_request_1.WzRequest.genericReq('POST', `/elastic/samplealerts/${category.categorySampleAlertsIndex}`, { params: this.generateAlertsParams });
            this.showToast('success', `${category.title} alerts installed`, 'Date range for sample data is now-7 days ago', 5000);
            this.setState({ [category.categorySampleAlertsIndex]: {
                    ...this.state[category.categorySampleAlertsIndex],
                    exists: true,
                    addDataLoading: false
                } });
        }
        catch (error) {
            this.showToast('danger', 'Error', error.message || error);
            this.setState({ [category.categorySampleAlertsIndex]: {
                    ...this.state[category.categorySampleAlertsIndex],
                    addDataLoading: false
                } });
        }
    }
    async removeSampleData(category) {
        try {
            this.setState({ [category.categorySampleAlertsIndex]: {
                    ...this.state[category.categorySampleAlertsIndex],
                    removeDataLoading: true
                } });
            await wz_request_1.WzRequest.genericReq('DELETE', `/elastic/samplealerts/${category.categorySampleAlertsIndex}`);
            this.setState({ [category.categorySampleAlertsIndex]: {
                    ...this.state[category.categorySampleAlertsIndex],
                    exists: false,
                    removeDataLoading: false
                } });
            this.showToast('success', `${category.title} alerts uninstalled`);
        }
        catch (error) {
            this.setState({ [category.categorySampleAlertsIndex]: {
                    ...this.state[category.categorySampleAlertsIndex],
                    removeDataLoading: false
                } });
            this.showToast('danger', 'Error', error.message || error);
        }
    }
    renderCard(category) {
        const { addDataLoading, exists, removeDataLoading } = this.state[category.categorySampleAlertsIndex];
        const { adminMode } = this.props;
        return (react_1.default.createElement(eui_1.EuiFlexItem, { key: `sample-data-${category.title}` },
            react_1.default.createElement(eui_1.EuiCard, { textAlign: 'left', title: category.title, description: category.description, image: category.image, betaBadgeLabel: exists ? 'Installed' : undefined, footer: (react_1.default.createElement(eui_1.EuiFlexGroup, { justifyContent: "flexEnd" },
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: false }, exists && (react_1.default.createElement(eui_1.EuiButton, { isLoading: removeDataLoading, isDisabled: !adminMode, color: 'danger', onClick: () => this.removeSampleData(category) }, removeDataLoading && 'Removing data' || 'Remove data')) || (react_1.default.createElement(eui_1.EuiButton, { isLoading: addDataLoading, isDisabled: !adminMode, onClick: () => this.addSampleData(category) }, addDataLoading && 'Adding data' || 'Add data'))))) })));
    }
    render() {
        return (react_1.default.createElement(eui_1.EuiFlexGrid, { columns: 3 }, this.categories.map(category => this.renderCard(category))));
    }
}
const zipObject = (keys = [], values = []) => {
    return keys.reduce((accumulator, key, index) => {
        accumulator[key] = values[index];
        return accumulator;
    }, {});
};
const PromiseAllRecusiveObject = function (obj) {
    const keys = Object.keys(obj);
    return Promise.all(keys.map(key => {
        const value = obj[key];
        // Promise.resolve(value) !== value should work, but !value.then always works
        if (typeof value === 'object' && !value.then) {
            return PromiseAllRecusiveObject(value);
        }
        return value;
    }))
        .then(result => zipObject(keys, result));
};
const mapStateToProps = state => {
    return {
        adminMode: state.appStateReducers.adminMode
    };
};
const mapDispatchToProps = dispatch => {
    return {
        updateAdminMode: adminMode => dispatch(appStateActions_1.updateAdminMode(adminMode))
    };
};
exports.default = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(WzSampleData);
