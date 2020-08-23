"use strict";
/*
 * Wazuh app - MITRE event component
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
exports.EventsMitre = void 0;
const react_1 = __importStar(require("react"));
const modules_helper_1 = require("../../common/modules/modules-helper");
const eui_1 = require("@elastic/eui");
const flyout_technique_1 = require("../../overview/mitre/components/techniques/components/flyout-technique");
const app_navigate_1 = require("../../../react-services/app-navigate");
class EventsMitre extends react_1.Component {
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
                    if (['rule.mitre.id', 'rule.id'].includes(col.textContent || '')) {
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
                            element.childNodes.forEach(child => {
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
                            element.childNodes.forEach(child => {
                                if (child.nodeName === 'SPAN') {
                                    const formattedText = text.replace(/\s/g, ''); // remove spaces
                                    const splitText = formattedText.split(",");
                                    const divLink = document.createElement('div');
                                    divLink.setAttribute('style', 'min-width: 120px;');
                                    splitText.forEach((item, idx) => {
                                        const link = document.createElement('a');
                                        link.onclick = () => this.showFlyout(item);
                                        if (idx !== splitText.length - 1)
                                            link.textContent = item + ", ";
                                        else
                                            link.textContent = item;
                                        divLink.appendChild(link);
                                    });
                                    child.replaceWith(divLink);
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
        this.onChangeFlyout = (isFlyoutVisible) => {
            this.setState({ isFlyoutVisible });
        };
        this.state = {
            isFlyoutVisible: false,
            currentTechnique: '',
            fetchStatus: 'loading',
            rows: 0,
            rowsLimit: 0
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
                this._isMount && this.setState({ fetchStatus: scope.fetchStatus, rows });
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
    showFlyout(techniqueId) {
        this.setState({ isFlyoutVisible: true, currentTechnique: techniqueId });
    }
    closeFlyout() {
        this.setState({ isFlyoutVisible: false, currentTechnique: false });
    }
    openDiscover(e, techniqueID) {
        app_navigate_1.AppNavigate.navigateToModule(e, 'overview', { "tab": 'mitre', "tabView": "discover", filters: { 'rule.mitre.id': techniqueID } });
    }
    openDashboard(e, techniqueID) {
        app_navigate_1.AppNavigate.navigateToModule(e, 'overview', { "tab": 'mitre', "tabView": "dashboard", filters: { 'rule.mitre.id': techniqueID } });
    }
    render() {
        return (this.state.isFlyoutVisible &&
            react_1.default.createElement(eui_1.EuiOverlayMask
            // @ts-ignore
            , { 
                // @ts-ignore
                onClick: (e) => { e.target.className === 'euiOverlayMask' && this.closeFlyout(); } },
                react_1.default.createElement(flyout_technique_1.FlyoutTechnique, { openDashboard: (e, itemId) => this.openDashboard(e, itemId), openDiscover: (e, itemId) => this.openDiscover(e, itemId), onChangeFlyout: this.onChangeFlyout, currentTechnique: this.state.currentTechnique })));
    }
}
exports.EventsMitre = EventsMitre;
