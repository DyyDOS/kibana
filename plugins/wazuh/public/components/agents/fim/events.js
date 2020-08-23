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
exports.EventsFim = void 0;
const react_1 = __importStar(require("react"));
const flyout_1 = require("./inventory/flyout");
const modules_helper_1 = require("../../common/modules/modules-helper");
const eui_1 = require("@elastic/eui");
class EventsFim extends react_1.Component {
    constructor(props) {
        super(props);
        this._isMount = false;
        this.getRowsField = async (query = '') => {
            const indices = [];
            const { rows } = this.state;
            if (!rows) {
                this.setState({ elements: [] });
                return;
            }
            if (!document)
                this.getRowsField();
            if (!query) {
                const cols = document.querySelectorAll(`.kbn-table thead th`);
                if (!(cols || []).length) {
                    setTimeout(this.getRowsField, 100);
                }
                cols.forEach((col, idx) => {
                    if (['syscheck.path', 'rule.id'].includes(col.textContent || '')) {
                        indices.push(idx + 1);
                    }
                });
                indices.forEach((position, idx) => {
                    query += `.kbn-table tbody tr td:nth-child(${position}) div`;
                    if (idx !== indices.length - 1) {
                        query += ', ';
                    }
                });
            }
            if (query) {
                var interval = setInterval(() => {
                    const elements = document.querySelectorAll(query);
                    if (!(elements || []).length) {
                        clearInterval(interval);
                        setTimeout(() => { this.getRowsField(query); }, 100);
                    }
                    let isClearable = true;
                    elements.forEach((element, idx) => {
                        const text = element.textContent;
                        if (idx % 2) {
                            element.childNodes.forEach((child) => {
                                if (child.nodeName === 'SPAN') {
                                    const link = document.createElement('a');
                                    link.setAttribute('href', `#/manager/rules?tab=rules&redirectRule=${text}`);
                                    link.setAttribute('target', '_blank');
                                    link.setAttribute('rel', 'noreferrer');
                                    link.setAttribute('style', 'min-width: 75px; display: block;');
                                    link.textContent = text;
                                    child.replaceWith(link);
                                    isClearable = false;
                                }
                            });
                        }
                        else {
                            element.childNodes.forEach((child) => {
                                if (child.nodeName === 'SPAN') {
                                    const link = document.createElement('a');
                                    const agentId = ((((this.state.rowsList || [])[idx / 2] || {})._source || {}).agent || {}).id || 0;
                                    link.onclick = () => this.showFlyout(text, agentId);
                                    link.textContent = text;
                                    child.replaceWith(link);
                                    isClearable = false;
                                }
                            });
                        }
                    });
                    if (isClearable)
                        clearInterval(interval);
                }, 500);
            }
        };
        this.state = {
            isFlyoutVisible: false,
            currentFile: '',
            fetchStatus: 'loading',
            rows: 0,
            rowsLimit: 0,
            rowsList: []
        };
        this.modulesHelper = modules_helper_1.ModulesHelper;
        this.getRowsField.bind(this);
    }
    async componentDidMount() {
        this._isMount = true;
        const scope = await this.modulesHelper.getDiscoverScope();
        this.fetchWatch = scope.$watchCollection('fetchStatus', () => {
            const { fetchStatus } = this.state;
            if (fetchStatus !== scope.fetchStatus) {
                const rows = scope.fetchStatus === 'complete' ? scope.rows.length : 0;
                const rowsList = scope.fetchStatus === 'complete' ? scope.rows : [];
                this._isMount && this.setState({ fetchStatus: scope.fetchStatus, rows, rowsList });
            }
        });
        this.getRowsInterval = setInterval(() => {
            const elements = document.querySelectorAll('.kbnDocTable__row');
            if ((elements || []).length != this.state.rowsLimit) {
                this._isMount && this.setState({ rowsLimit: (elements || []).length });
                this.getRowsField();
            }
        }, 1000);
    }
    shouldComponentUpdate(nextProps, nextState) {
        const { fetchStatus, isFlyoutVisible, rows } = this.state;
        if (nextState.isFlyoutVisible !== isFlyoutVisible) {
            return true;
        }
        if (nextState.fetchStatus !== fetchStatus) {
            return true;
        }
        if (nextState.rows !== rows) {
            return true;
        }
        return false;
    }
    componentDidUpdate() {
        const { fetchStatus, rows } = this.state;
        if (fetchStatus === 'complete' && rows) {
            this.getRowsField();
        }
    }
    componentWillUnmount() {
        this._isMount = false;
        clearInterval(this.getRowsInterval);
        if (this.fetchWatch)
            this.fetchWatch();
    }
    showFlyout(file, agentId) {
        if (file !== " - " && !window.location.href.includes('&file=')) {
            window.location.href = window.location.href += `&file=${file}`;
            //if a flyout is opened, we close it and open a new one, so the components are correctly updated on start.
            this.setState({ isFlyoutVisible: true, currentFile: file, currentAgent: agentId });
        }
    }
    closeFlyout() {
        this.setState({ isFlyoutVisible: false, currentFile: false });
    }
    render() {
        return (this.state.isFlyoutVisible &&
            react_1.default.createElement(eui_1.EuiOverlayMask
            // @ts-ignore
            , { 
                // @ts-ignore
                onClick: (e) => { e.target.className === 'euiOverlayMask' && this.closeFlyout(); } },
                react_1.default.createElement(flyout_1.FlyoutDetail, Object.assign({ fileName: this.state.currentFile, agentId: this.state.currentAgent, closeFlyout: () => this.closeFlyout(), type: 'file', view: 'events' }, this.props))));
    }
}
exports.EventsFim = EventsFim;
