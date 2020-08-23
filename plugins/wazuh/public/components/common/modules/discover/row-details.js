"use strict";
/*
 * Wazuh app - Integrity monitoring table component
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RowDetails = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
require("./discover.less");
const eui_2 = require("@elastic/eui");
const api_request_1 = require("../../../../react-services/api-request");
const wz_text_with_tooltip_if_truncated_1 = __importDefault(require("../../../../components/common/wz-text-with-tooltip-if-truncated"));
const capitalize = str => str[0].toUpperCase() + str.slice(1);
class RowDetails extends react_1.Component {
    constructor(props) {
        super(props);
        this._isMount = false;
        this.getFilterLink = (key, value) => {
            const filter = {};
            filter[key] = value;
            return (react_1.default.createElement(eui_1.EuiToolTip, { position: "top", content: `Filter by ${key}:${value}` },
                react_1.default.createElement(eui_1.EuiLink, { onClick: async () => this.props.addFilter(filter) },
                    "\u00A0",
                    value)));
        };
        this.onSelectedTabChanged = id => {
            this.setState({
                selectedTabId: id,
            });
        };
        this.state = {
            selectedTabId: "table",
            ruleData: {
                items: [],
                totalItems: 0,
            },
            hover: ''
        };
        this.complianceEquivalences = {
            pci: 'PCI DSS',
            gdpr: 'GDPR',
            gpg13: 'GPG 13',
            hipaa: 'HIPAA',
            mitre: 'MITRE',
            'nist-800-53': 'NIST-800-53'
        };
    }
    propertiesToArray(obj) {
        const isObject = val => typeof val === 'object' && !Array.isArray(val);
        const addDelimiter = (a, b) => a ? `${a}.${b}` : b;
        const paths = (obj = {}, head = '') => {
            return Object.entries(obj)
                .reduce((product, [key, value]) => {
                let fullPath = addDelimiter(head, key);
                return isObject(value) ?
                    product.concat(paths(value, fullPath))
                    : product.concat(fullPath);
            }, []);
        };
        return paths(obj);
    }
    async componentDidMount() {
        this._isMount = true;
        const rulesDataResponse = await api_request_1.ApiRequest.request('GET', `/rules`, { q: `id=${this.props.item.rule.id}` });
        const ruleData = (rulesDataResponse.data || {}).data || {};
        if (this._isMount) {
            this.setState({ ruleData });
        }
    }
    componentWillUnmount() {
        this._isMount = false;
    }
    getChildFromPath(object, path) {
        const pathArray = path.split('.');
        var child = object[pathArray[0]];
        for (var i = 1; i < pathArray.length; i++) {
            child = child[pathArray[i]];
        }
        if (!Array.isArray(child)) {
            child.toString();
        }
        return child;
    }
    renderRows() {
        const fieldsToShow = ['agent', 'cluster', 'manager', 'rule', 'decoder', 'syscheck'];
        var rows = [];
        for (var i = 0; i < fieldsToShow.length; i++) {
            if (this.props.item[fieldsToShow[i]]) {
                const itemPaths = this.propertiesToArray(this.props.item[fieldsToShow[i]]);
                const tmpRows = itemPaths.map((item, idx) => {
                    const key = fieldsToShow[i] + "." + item; // = agent + . + id = agent.id
                    const value = this.getChildFromPath(this.props.item[fieldsToShow[i]], item);
                    const filter = {};
                    filter[key] = value;
                    const cells = [];
                    const actionsCell = react_1.default.createElement(eui_1.EuiTableRowCell, { className: this.state.hover === key ? "hover-row" : " ", style: { width: 80, borderTop: 0, borderBottom: 0 }, key: key + "0" }, (this.state.hover === key &&
                        react_1.default.createElement(eui_1.EuiFlexGroup, { style: { height: 35 } },
                            react_1.default.createElement(eui_2.EuiFlexItem, { grow: false, style: { marginRight: 0, marginTop: 8 } },
                                react_1.default.createElement(eui_1.EuiToolTip, { position: "top", content: `Filter for value` },
                                    react_1.default.createElement(eui_1.EuiButtonIcon, { onClick: () => this.props.addFilter(filter), iconType: "magnifyWithPlus", "aria-label": "Filter", iconSize: "s" }))),
                            react_1.default.createElement(eui_2.EuiFlexItem, { grow: false, style: { marginRight: 0, marginLeft: 0, marginTop: 8 } },
                                react_1.default.createElement(eui_1.EuiToolTip, { position: "top", content: `Filter out value` },
                                    react_1.default.createElement(eui_1.EuiButtonIcon, { onClick: () => this.props.addFilterOut(filter), iconType: "magnifyWithMinus", "aria-label": "Filter", iconSize: "s" }))),
                            react_1.default.createElement(eui_2.EuiFlexItem, { grow: false, style: { marginRight: 0, marginLeft: 0, marginTop: 8 } },
                                react_1.default.createElement(eui_1.EuiToolTip, { position: "top", content: `Toggle column` },
                                    react_1.default.createElement(eui_1.EuiButtonIcon, { onClick: () => this.props.toggleColumn(key), iconType: "tableOfContents", "aria-label": "Filter", iconSize: "s" }))))));
                    cells.push(actionsCell);
                    const keyCell = react_1.default.createElement(eui_1.EuiTableRowCell, { className: this.state.hover === key ? "hover-row" : " ", style: { width: "20%", borderTop: 0, borderBottom: 0 }, key: key + "1" }, react_1.default.createElement("div", null, key));
                    cells.push(keyCell);
                    const formattedValue = Array.isArray(value) ? value.join(', ') : value.toString();
                    const valueCell = react_1.default.createElement(eui_1.EuiTableRowCell, { className: this.state.hover === key ? "hover-row" : " ", style: { borderTop: 0, borderBottom: 0, padding: 0, margin: 0 }, key: key + "2" }, react_1.default.createElement("div", null, formattedValue));
                    cells.push(valueCell);
                    return (react_1.default.createElement(eui_1.EuiTableRow, { onMouseEnter: () => this.setState({ hover: key }), onMouseLeave: () => this.setState({ hover: "" }), key: key }, cells));
                }); //map
                rows = [...rows, ...tmpRows];
            } //if
        } //for 
        return rows;
    }
    getTable() {
        return (react_1.default.createElement("div", null,
            react_1.default.createElement("div", null,
                react_1.default.createElement(eui_1.EuiTable, { style: { marginTop: 0 } },
                    react_1.default.createElement(eui_1.EuiTableBody, { style: { marginTop: 0 } }, this.renderRows())))));
    }
    getJSON() {
        const str = JSON.stringify(this.props.item, null, 2);
        return (react_1.default.createElement("div", null,
            react_1.default.createElement(eui_1.EuiCodeBlock, { language: "json", fontSize: "s", paddingSize: "m", color: "dark", isCopyable: true }, str)));
    }
    /**
     * Build an object with the compliance info about a rule
     * @param {Object} ruleInfo
     */
    buildCompliance(ruleInfo) {
        const compliance = {};
        const complianceKeys = ['gdpr', 'gpg13', 'hipaa', 'nist-800-53', 'pci', 'mitre'];
        Object.keys(ruleInfo).forEach(key => {
            if (complianceKeys.includes(key) && ruleInfo[key].length)
                compliance[key] = ruleInfo[key];
        });
        return compliance || {};
    }
    getComplianceKey(key) {
        if (key === 'pci') {
            return 'rule.pci_dss';
        }
        if (key === 'gdpr') {
            return 'rule.gdpr';
        }
        if (key === 'gpg13') {
            return 'rule.gpg13';
        }
        if (key === 'hipaa') {
            return 'rule.hipaa';
        }
        if (key === 'nist-800-53') {
            return 'rule.nist_800_53';
        }
        if (key === 'mitre') {
            return 'rule.mitre.id';
        }
        return "";
    }
    renderInfo(id, level, file, path, groups) {
        return (react_1.default.createElement(eui_1.EuiFlexGrid, { columns: 4 },
            react_1.default.createElement(eui_2.EuiFlexItem, { key: "id", grow: 1 },
                react_1.default.createElement("b", { style: { paddingBottom: 6 } }, "ID"),
                react_1.default.createElement(eui_1.EuiToolTip, { position: "top", content: `Filter by this rule ID: ${id}` },
                    react_1.default.createElement(eui_1.EuiLink, { onClick: async () => this.props.addFilter({ 'rule.id': id }) }, id))),
            react_1.default.createElement(eui_2.EuiFlexItem, { key: "level", grow: 1 },
                react_1.default.createElement("b", { style: { paddingBottom: 6 } }, "Level"),
                react_1.default.createElement(eui_1.EuiToolTip, { position: "top", content: `Filter by this level: ${level}` },
                    react_1.default.createElement(eui_1.EuiLink, { onClick: async () => this.props.addFilter({ "rule.level": level }) }, level))),
            react_1.default.createElement(eui_2.EuiFlexItem, { key: "file", grow: 1 },
                react_1.default.createElement("b", { style: { paddingBottom: 6 } }, "File"),
                file),
            react_1.default.createElement(eui_2.EuiFlexItem, { key: "path", grow: 1 },
                react_1.default.createElement("b", { style: { paddingBottom: 6 } }, "Path"),
                path),
            react_1.default.createElement(eui_2.EuiFlexItem, { key: "Groups", grow: 1 },
                react_1.default.createElement("b", { style: { paddingBottom: 6 } }, "Groups"),
                this.renderGroups(groups)),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "s" })));
    }
    renderGroups(groups) {
        const listGroups = [];
        groups.forEach((group, index) => {
            listGroups.push(react_1.default.createElement("span", { key: group },
                react_1.default.createElement(eui_1.EuiLink, { onClick: async () => this.props.addFilter({ 'rule.groups': group }) },
                    react_1.default.createElement(eui_1.EuiToolTip, { position: "top", content: `Filter by this group: ${group}` },
                        react_1.default.createElement("span", null, group))),
                index < groups.length - 1 && ', '));
        });
        return (react_1.default.createElement("ul", null,
            react_1.default.createElement("li", null, listGroups)));
    }
    getFormattedDetails(value) {
        if (Array.isArray(value) && value[0].type) {
            let link = "";
            let name = "";
            value.forEach(item => {
                if (item.type === 'cve')
                    name = item.name;
                if (item.type === 'link')
                    link = react_1.default.createElement("a", { href: item.name, target: "_blank" }, item.name);
            });
            return react_1.default.createElement("span", null,
                name,
                ": ",
                link);
        }
        else {
            return (react_1.default.createElement(wz_text_with_tooltip_if_truncated_1.default, { position: 'top' }, value));
        }
    }
    renderDetails(details) {
        const detailsToRender = [];
        const capitalize = str => str[0].toUpperCase() + str.slice(1);
        // Exclude group key of details
        Object.keys(details).filter(key => key !== 'group').forEach((key) => {
            detailsToRender.push(react_1.default.createElement(eui_2.EuiFlexItem, { key: key, grow: 1, style: { maxWidth: 'calc(25% - 24px)', maxHeight: 41 } },
                react_1.default.createElement("b", { style: { paddingBottom: 6 } }, capitalize(key)),
                details[key] === '' ? 'true' : this.getFormattedDetails(details[key])));
        });
        return (react_1.default.createElement(eui_1.EuiFlexGrid, { columns: 4 }, detailsToRender));
    }
    renderCompliance(compliance) {
        const styleTitle = { fontSize: "14px", fontWeight: 500 };
        return (react_1.default.createElement(eui_1.EuiFlexGrid, { columns: 4 }, Object.keys(compliance).sort().map((complianceCategory, index) => {
            return (react_1.default.createElement(eui_2.EuiFlexItem, { key: `rule-compliance-${complianceCategory}-${index}` },
                react_1.default.createElement("div", { style: styleTitle }, this.complianceEquivalences[complianceCategory]),
                react_1.default.createElement("div", null, compliance[complianceCategory].map(comp => {
                    const filter = {
                        [this.getComplianceKey(complianceCategory)]: comp
                    };
                    return (react_1.default.createElement(eui_1.EuiToolTip, { key: `rule-compliance-tooltip-${complianceCategory}-${(Math.random() * (index - 0)) + index}`, position: "top", content: `Filter by this compliance` },
                        react_1.default.createElement(eui_1.EuiBadge, { color: "hollow", onClick: () => this.props.addFilter(filter), onClickAriaLabel: comp, title: null }, comp)));
                }).reduce((prev, cur) => [prev, ' ', cur]))));
        })));
    }
    getRule() {
        const item = this.state.ruleData.items[0];
        const { id, level, file, path, groups, details } = item;
        const compliance = this.buildCompliance(item);
        return (react_1.default.createElement("div", { className: "rule_reset_display_anchor" },
            react_1.default.createElement(eui_1.EuiSpacer, { size: 's' }),
            react_1.default.createElement(eui_1.EuiFlexGroup, { justifyContent: 'spaceAround' },
                react_1.default.createElement(eui_2.EuiFlexItem, { style: { marginBottom: '8' } },
                    react_1.default.createElement(eui_1.EuiAccordion, { id: "Info", buttonContent: react_1.default.createElement(eui_1.EuiTitle, { size: "s", style: { fontWeight: 400 } },
                            react_1.default.createElement("h3", null, "Information")), extraAction: react_1.default.createElement("a", { href: `#/manager/rules?tab=rules&redirectRule=${id}`, target: "_blank", style: { paddingTop: 5 } },
                            react_1.default.createElement(eui_1.EuiIcon, { type: "popout", color: 'primary' }),
                            "\u00A0 View in Rules"), paddingSize: "none", initialIsOpen: true },
                        react_1.default.createElement("div", { className: 'flyout-row details-row' }, this.renderInfo(id, level, file, path, groups))))),
            react_1.default.createElement(eui_1.EuiSpacer, { size: 'm' }),
            react_1.default.createElement(eui_1.EuiFlexGroup, null,
                react_1.default.createElement(eui_2.EuiFlexItem, { style: { marginTop: 8 } },
                    react_1.default.createElement(eui_1.EuiAccordion, { id: "Details", buttonContent: react_1.default.createElement(eui_1.EuiTitle, { size: "s" },
                            react_1.default.createElement("h3", null, "Details")), paddingSize: "none", initialIsOpen: true },
                        react_1.default.createElement("div", { className: 'flyout-row details-row' }, this.renderDetails(details))))),
            react_1.default.createElement(eui_1.EuiSpacer, { size: 'm' }),
            react_1.default.createElement(eui_1.EuiFlexGroup, null,
                react_1.default.createElement(eui_2.EuiFlexItem, { style: { marginTop: 8 } },
                    react_1.default.createElement(eui_1.EuiAccordion, { id: "Compliance", buttonContent: react_1.default.createElement(eui_1.EuiTitle, { size: "s" },
                            react_1.default.createElement("h3", null, "Compliance")), paddingSize: "none", initialIsOpen: true },
                        react_1.default.createElement("div", { className: 'flyout-row details-row' }, this.renderCompliance(compliance))))),
            react_1.default.createElement(eui_1.EuiSpacer, { size: 's' })));
    }
    getTabs() {
        const tabs = [
            {
                id: 'table',
                name: 'Table',
                disabled: false,
            },
            {
                id: 'json',
                name: 'JSON',
                disabled: false,
            },
            {
                id: 'rule',
                name: 'Rule',
                disabled: false,
            }
        ];
        return (react_1.default.createElement(eui_1.EuiTabs, null, tabs.map((tab, index) => (react_1.default.createElement(eui_1.EuiTab, { onClick: () => this.onSelectedTabChanged(tab.id), isSelected: tab.id === this.state.selectedTabId, disabled: tab.disabled, key: index }, tab.name)))));
    }
    render() {
        return (react_1.default.createElement("div", null,
            this.getTabs(),
            react_1.default.createElement(eui_1.EuiFlexGroup, null,
                react_1.default.createElement(eui_2.EuiFlexItem, { style: { padding: 16 } },
                    this.state.selectedTabId === 'table' && (this.getTable()),
                    this.state.selectedTabId === 'json' && (this.getJSON()),
                    this.state.selectedTabId === 'rule' && this.state.ruleData.totalItems === 1 && (this.getRule()) || this.state.selectedTabId === 'rule' &&
                        (react_1.default.createElement("span", null,
                            "There was an error loading rule ID: ",
                            this.props.item.rule.id))))));
    }
}
exports.RowDetails = RowDetails;
