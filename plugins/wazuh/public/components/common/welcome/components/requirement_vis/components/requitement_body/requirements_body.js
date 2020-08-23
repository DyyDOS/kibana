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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequirementsBody = void 0;
const react_1 = __importStar(require("react"));
const __1 = require("../../../");
const lib_1 = require("./lib");
const eui_1 = require("@elastic/eui");
const components_1 = require("./components");
function RequirementsBody(props) {
    const { requirement, agent } = props;
    const colors = eui_1.euiPaletteColorBlind();
    const [loading, setLoading] = react_1.useState(true);
    const [data, setData] = react_1.useState([]);
    const timeFilter = __1.useTimeFilter();
    react_1.useEffect(() => {
        const { id } = agent;
        setLoading(true);
        lib_1.getRequirementAlerts(id, timeFilter, requirement).then(e => {
            setData(e.alerts_count);
            setTimeout(() => setLoading(false), 700);
        });
    }, [requirement, timeFilter]);
    if (loading)
        return (react_1.default.createElement("div", { style: { textAlign: "center", paddingTop: 100, height: 238 } },
            react_1.default.createElement(eui_1.EuiLoadingChart, { size: "xl" })));
    if (!data.length)
        return (react_1.default.createElement(components_1.NoAlertsMessage, { requirement: requirement }));
    return (react_1.default.createElement(react_1.Fragment, null,
        react_1.default.createElement(eui_1.EuiFlexItem, null,
            react_1.default.createElement(eui_1.EuiSpacer, { size: "m" })),
        react_1.default.createElement(eui_1.EuiFlexGroup, null,
            react_1.default.createElement(eui_1.EuiFlexItem, null,
                react_1.default.createElement(components_1.RequirementsDonnut, Object.assign({ data: data, colors: colors }, props))),
            react_1.default.createElement(eui_1.EuiFlexItem, null,
                react_1.default.createElement(components_1.Requirements_leggend, { data: data, colors: colors, requirement: requirement, agent: agent })))));
}
exports.RequirementsBody = RequirementsBody;
