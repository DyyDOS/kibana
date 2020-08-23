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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlyoutDetail = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
const wz_request_1 = require("../../../../react-services/wz-request");
const fileDetail_1 = require("./fileDetail");
const app_state_1 = require("../../../../react-services/app-state");
class FlyoutDetail extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentFile: false,
            clusterFilter: {},
            isLoading: true,
            error: false,
            type: 'file'
        };
    }
    async componentDidMount() {
        try {
            const isCluster = (app_state_1.AppState.getClusterInfo() || {}).status === "enabled";
            const clusterFilter = isCluster
                ? { "cluster.name": app_state_1.AppState.getClusterInfo().cluster }
                : { "manager.name": app_state_1.AppState.getClusterInfo().manager };
            this.setState({ clusterFilter });
            let currentFile;
            if (typeof this.props.item === "boolean" && typeof this.props.fileName !== undefined) {
                const regex = new RegExp('file=' + '[^&]*');
                const match = window.location.href.match(regex);
                if (match && match[0]) {
                    const file = decodeURIComponent(match[0].split('=')[1]);
                    const data = await wz_request_1.WzRequest.apiReq('GET', `/syscheck/${this.props.agentId}`, { q: `file=${file}` });
                    currentFile = ((((data || {}).data || {}).data || {}).items || [])[0];
                }
            }
            else if (this.props.item) {
                currentFile = this.props.item;
            }
            else {
                const data = await wz_request_1.WzRequest.apiReq('GET', `/syscheck/${this.props.agentId}`, { q: `file=${this.props.fileName}` });
                currentFile = ((((data || {}).data || {}).data || {}).items || [])[0];
            }
            if (!currentFile) {
                throw (false);
            }
            this.setState({ currentFile, type: currentFile.type, isLoading: false });
        }
        catch (err) {
            this.setState({ error: `Data could not be fetched for ${this.props.fileName}`, currentFile: { file: this.props.fileName } });
        }
    }
    componentWillUnmount() {
        window.location.href = window.location.href.replace(new RegExp("&file=" + "[^\&]*", 'g'), "");
    }
    render() {
        const { type } = this.state;
        return (react_1.default.createElement(eui_1.EuiFlyout, { onClose: () => this.props.closeFlyout(), size: "l", "aria-labelledby": this.state.currentFile.file, maxWidth: "70%" },
            react_1.default.createElement(eui_1.EuiFlyoutHeader, { hasBorder: true, className: "flyout-header" },
                react_1.default.createElement(eui_1.EuiTitle, { size: "s" },
                    react_1.default.createElement("h2", { id: this.state.currentFile.file }, this.state.currentFile.file))),
            this.state.isLoading && (react_1.default.createElement(eui_1.EuiFlyoutBody, { className: "flyout-body" }, this.state.error && (react_1.default.createElement(eui_1.EuiCallOut, { title: this.state.error, color: "warning", iconType: "alert" })) || (react_1.default.createElement(eui_1.EuiLoadingContent, { style: { margin: 16 } })))),
            this.state.currentFile && !this.state.isLoading &&
                react_1.default.createElement(eui_1.EuiFlyoutBody, { className: "flyout-body" },
                    react_1.default.createElement(fileDetail_1.FileDetails, Object.assign({ currentFile: this.state.currentFile, type: type }, this.props, { implicitFilters: [{ 'rule.groups': "syscheck" },
                            { 'syscheck.path': this.state.currentFile.file },
                            { 'agent.id': this.props.agentId },
                            this.state.clusterFilter] })))));
    }
}
exports.FlyoutDetail = FlyoutDetail;
