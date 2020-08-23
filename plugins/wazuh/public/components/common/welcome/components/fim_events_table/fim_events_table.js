"use strict";
/*
 * Wazuh app - React component building the welcome screen of an agent.
 * version, OS, registration date, last keep alive.
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTimeFilter = exports.FimEventsTable = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
// @ts-ignore
const kibana_services_1 = require("plugins/kibana/discover/kibana_services");
const store_1 = __importDefault(require("../../../../../redux/store"));
const appStateActions_1 = require("../../../../../redux/actions/appStateActions");
const lib_1 = require("./lib");
const time_service_1 = require("../../../../../react-services/time-service");
const flyout_1 = require("../../../../agents/fim/inventory/flyout");
const eui_2 = require("@elastic/eui");
function FimEventsTable({ agent, router }) {
    return (react_1.default.createElement(eui_1.EuiFlexItem, null,
        react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "m" },
            react_1.default.createElement(eui_1.EuiFlexItem, null,
                react_1.default.createElement(eui_1.EuiFlexGroup, null,
                    react_1.default.createElement(eui_1.EuiFlexItem, null,
                        react_1.default.createElement(eui_1.EuiText, { size: "xs" },
                            react_1.default.createElement("h2", null, "FIM: Recent events"))),
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                        react_1.default.createElement(eui_1.EuiToolTip, { position: "top", content: "Open FIM" },
                            react_1.default.createElement(eui_1.EuiButtonIcon, { iconType: "popout", color: "primary", onClick: () => navigateToFim(agent, router), "aria-label": "Open FIM" })))),
                react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
                react_1.default.createElement(FimTable, { agent: agent })))));
}
exports.FimEventsTable = FimEventsTable;
function useTimeFilter() {
    const { timefilter, } = kibana_services_1.getServices();
    const [timeFilter, setTimeFilter] = react_1.useState(timefilter.getTime());
    react_1.useEffect(() => {
        const subscription = timefilter.getTimeUpdate$().subscribe(() => setTimeFilter(timefilter.getTime()));
        return () => { subscription.unsubscribe(); };
    }, []);
    return timeFilter;
}
exports.useTimeFilter = useTimeFilter;
function FimTable({ agent }) {
    const [fimAlerts, setFimAlerts] = react_1.useState([]);
    const [isOpen, setIsOpen] = react_1.useState(false);
    const [file, setFile] = react_1.useState('');
    const [sort, setSort] = react_1.useState({ field: '_source.timestamp', direction: 'desc' });
    const timeFilter = useTimeFilter();
    react_1.useEffect(() => { lib_1.getFimAlerts(agent.id, timeFilter, sort).then(setFimAlerts); }, [timeFilter, sort]);
    return (react_1.default.createElement(react_1.Fragment, null,
        react_1.default.createElement(eui_1.EuiBasicTable, { items: fimAlerts, columns: columns(setFile, setIsOpen), loading: false, sorting: { sort }, onChange: (e) => setSort(e.sort), itemId: "fim-alerts", noItemsMessage: "No recent events" }),
        isOpen && (react_1.default.createElement(eui_1.EuiOverlayMask, { onClick: (e) => e.target.className === 'euiOverlayMask' && setIsOpen(false) },
            react_1.default.createElement(flyout_1.FlyoutDetail, Object.assign({ agentId: agent.id, closeFlyout: () => setIsOpen(false), fileName: file, view: 'extern' }, { agent }))))));
}
function navigateToFim(agent, router) {
    window.location.href = `#/overview/?tab=fim`;
    store_1.default.dispatch(appStateActions_1.updateCurrentAgentData(agent));
    router.reload();
}
const columns = (setFile, setIsOpen) => [
    { field: '_source.timestamp', name: "Time", sortable: true, render: (field) => time_service_1.TimeService.offset(field), width: '150px' },
    { field: '_source.syscheck.path', name: "Path", sortable: true, truncateText: true, render: (path) => renderPath(path, setFile, setIsOpen) },
    { field: '_source.syscheck.event', name: "Action", sortable: true, width: '100px' },
    { field: '_source.rule.description', name: "Rule description", sortable: true, truncateText: true },
    { field: '_source.rule.level', name: "Rule Level", sortable: true, width: '75px' },
    { field: '_source.rule.id', name: "Rule Id", sortable: true, width: '75px' },
];
const renderPath = (path, setFile, setIsOpen) => (react_1.default.createElement(eui_2.EuiLink, { className: "euiTableCellContent__text euiTableCellContent--truncateText", onClick: () => { setFile(path), setIsOpen(true); } }, path));
