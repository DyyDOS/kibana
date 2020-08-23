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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Requirements_leggend = void 0;
// @ts-ignore
const chrome_1 = __importDefault(require("ui/chrome"));
const react_1 = __importDefault(require("react"));
const eui_1 = require("@elastic/eui");
const eui_2 = require("@elastic/eui");
require("./requirements_leggend.less");
const rison_node_1 = __importDefault(require("rison-node"));
const common_1 = require("../../../../../../../../../../../../src/plugins/data/common");
const lib_1 = require("../../../../../../../../overview/mitre/lib");
const store_1 = __importDefault(require("../../../../../../../../../redux/store"));
const appStateActions_1 = require("../../../../../../../../../redux/actions/appStateActions");
function Requirements_leggend({ data, colors, requirement, agent }) {
    const list = data.map((item, idx) => ({
        label: `${item.key} (${item.doc_count})`,
        icon: react_1.default.createElement(eui_1.EuiIcon, { type: "dot", size: 'l', color: colors[idx] }),
        onClick: () => (requirement === 'gpg13' ? undefined : goToDashboardWithFilter(requirement, item, agent)),
        size: 'xs',
        color: 'text',
    }));
    return (react_1.default.createElement(eui_2.EuiListGroup, { className: "wz-list-group", listItems: list, color: 'text', flush: true }));
}
exports.Requirements_leggend = Requirements_leggend;
const goToDashboardWithFilter = (requirement, item, agent) => {
    store_1.default.dispatch(appStateActions_1.updateCurrentAgentData(agent));
    chrome_1.default.dangerouslyGetActiveInjector().then(injector => {
        const route = injector.get('$route');
        lib_1.getIndexPattern().then(indexPattern => {
            const filters = [{
                    ...common_1.buildPhraseFilter({ name: `rule.${requirement}`, type: 'text' }, item.key, indexPattern),
                    "$state": { "isImplicit": false, "store": "appState" },
                }];
            const _w = { filters };
            const params = {
                tab: tabEquivalence[requirement],
                _w: rison_node_1.default.encode(_w)
            };
            const url = Object.entries(params).map(e => e.join('=')).join('&');
            window.location.href = `#/overview?${url}`;
            route.reload();
        });
    });
};
const tabEquivalence = {
    'pci_dss': 'pci',
    'gdpr': 'gdpr',
    'nist_800_53': 'nist',
    'hipaa': 'hipaa',
    'gpg13': '',
    'tsc': 'tsc',
};
