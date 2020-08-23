"use strict";
/*
 * Wazuh app - React component for registering agents.
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
// Eui components
const eui_1 = require("@elastic/eui");
const notify_1 = require("ui/notify");
const appStateActions_1 = require("../../redux/actions/appStateActions");
const wz_fetch_1 = require("../../controllers/management/components/management/configuration/utils/wz-fetch");
const react_redux_1 = require("react-redux");
;
;
class WzRestartClusterManagerCallout extends react_1.Component {
    constructor(props) {
        super(props);
        this.restartClusterOrManager = async () => {
            try {
                this.setState({ warningRestarting: true, warningRestartModalVisible: false });
                const data = await wz_fetch_1.restartClusterOrManager(this.props.updateWazuhNotReadyYet);
                // this.setState({ warningRestarting: false });
                this.props.onRestarted();
                this.showToast('success', `${data.restarted === 'cluster' ? 'Restarting cluster, it will take up to 30 seconds.' : 'Manager was restarted'}`);
            }
            catch (error) {
                this.setState({ warningRestarting: false });
                this.props.onRestartedError();
                this.showToast('danger', 'Error', error.message || error);
            }
        };
        this.state = {
            warningRestarting: false,
            warningRestartModalVisible: false,
            isCluster: false
        };
    }
    toggleWarningRestartModalVisible() {
        this.setState({ warningRestartModalVisible: !this.state.warningRestartModalVisible });
    }
    showToast(color, title, text = '', time = 3000) {
        notify_1.toastNotifications.add({
            color,
            title,
            text,
            toastLifeTimeMs: time
        });
    }
    async componentDidMount() {
        try {
            const clusterStatus = await wz_fetch_1.clusterReq();
            this.setState({ isCluster: clusterStatus.data.data.enabled === 'yes' && clusterStatus.data.data.running === 'yes' });
        }
        catch (error) { }
    }
    render() {
        const { warningRestarting, warningRestartModalVisible } = this.state;
        return (react_1.default.createElement(react_1.Fragment, null,
            !warningRestarting && (react_1.default.createElement(eui_1.EuiCallOut, null,
                react_1.default.createElement(eui_1.EuiFlexGroup, { justifyContent: 'spaceBetween', alignItems: 'center' },
                    react_1.default.createElement(eui_1.EuiFlexItem, { style: { marginTop: '0', marginBottom: '0' } },
                        react_1.default.createElement(eui_1.EuiText, { style: { color: 'rgb(0, 107, 180)' } },
                            react_1.default.createElement(eui_1.EuiIcon, { type: 'iInCircle', color: 'primary', style: { marginBottom: '7px', marginRight: '6px' } }),
                            react_1.default.createElement("span", null, "Changes will not take effect until a restart is performed."))),
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: false, style: { marginTop: '0', marginBottom: '0' } },
                        react_1.default.createElement(eui_1.EuiButton, { iconType: "refresh", onClick: () => this.toggleWarningRestartModalVisible() }, 'Restart'))))),
            warningRestartModalVisible && (react_1.default.createElement(eui_1.EuiOverlayMask, null,
                react_1.default.createElement(eui_1.EuiConfirmModal, { title: `${this.state.isCluster ? 'Cluster' : 'Manager'} will be restarted`, onCancel: () => this.toggleWarningRestartModalVisible(), onConfirm: () => this.restartClusterOrManager(), cancelButtonText: "Cancel", confirmButtonText: "Confirm", defaultFocusedButton: "cancel" })))));
    }
}
const mapDispatchToProps = dispatch => {
    return {
        updateWazuhNotReadyYet: wazuhNotReadyYet => dispatch(appStateActions_1.updateWazuhNotReadyYet(wazuhNotReadyYet))
    };
};
exports.default = react_redux_1.connect(null, mapDispatchToProps)(WzRestartClusterManagerCallout);
