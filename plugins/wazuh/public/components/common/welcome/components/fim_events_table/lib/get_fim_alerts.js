"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFimAlerts = exports.getWazuhFilter = void 0;
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
const lib_1 = require("../../../../../overview/mitre/lib");
const common_1 = require("../../../../../../../../../src/plugins/data/common");
const app_state_1 = require("../../../../../../react-services/app-state");
function createFilters(agentId, indexPattern) {
    const filter = filter => {
        return {
            ...common_1.buildPhraseFilter({ name: filter.name, type: 'text' }, filter.value, indexPattern),
            "$state": { "store": "appState" }
        };
    };
    const wazuhFilter = getWazuhFilter();
    const filters = [
        wazuhFilter,
        { name: 'agent.id', value: agentId },
        { name: 'rule.groups', value: 'syscheck' },
    ];
    return filters.map(filter);
}
function getWazuhFilter() {
    const clusterInfo = app_state_1.AppState.getClusterInfo();
    const wazuhFilter = {
        name: clusterInfo.status === 'enabled' ? 'cluster.name' : 'manager.name',
        value: clusterInfo.status === 'enabled' ? clusterInfo.cluster : clusterInfo.manager
    };
    return wazuhFilter;
}
exports.getWazuhFilter = getWazuhFilter;
async function getFimAlerts(agentId, time, sortObj) {
    const indexPattern = await lib_1.getIndexPattern();
    const sort = [{ [sortObj.field.substring(8)]: sortObj.direction }];
    const filterParams = {
        filters: createFilters(agentId, indexPattern),
        query: { query: '', language: 'kuery' },
        time
    };
    const response = await lib_1.getElasticAlerts(indexPattern, filterParams, {}, { size: 5, sort });
    return (((response || {}).data || {}).hits || {}).hits;
}
exports.getFimAlerts = getFimAlerts;
