"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMitreCount = void 0;
/*
 * Wazuh app - React component information about MITRE top tactics.
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
function createFilters(indexPattern, agentId, tactic) {
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
        ...(tactic ? [{ name: 'rule.mitre.tactic', value: tactic }] : []),
    ];
    return filters.map(filter);
}
function createExistsFilter(indexPattern) {
    return common_1.buildExistsFilter({ name: `rule.mitre.id`, type: 'nested' }, indexPattern);
}
function getWazuhFilter() {
    const clusterInfo = app_state_1.AppState.getClusterInfo();
    const wazuhFilter = {
        name: clusterInfo.status === 'enabled' ? 'cluster.name' : 'manager.name',
        value: clusterInfo.status === 'enabled' ? clusterInfo.cluster : clusterInfo.manager
    };
    return wazuhFilter;
}
async function getMitreCount(agentId, time, tactic) {
    const indexPattern = await lib_1.getIndexPattern();
    const filterParams = {
        filters: [
            ...createFilters(indexPattern, agentId, tactic),
            createExistsFilter(indexPattern),
        ],
        query: { query: '', language: 'kuery' },
        time
    };
    const args = {
        tactics: {
            terms: {
                field: `rule.mitre.${tactic ? 'id' : 'tactic'}`,
                size: 5,
            }
        }
    };
    const response = await lib_1.getElasticAlerts(indexPattern, filterParams, args, { size: 0 });
    return ((((response || {}).data || {}).aggregations || {}).tactics || {}).buckets || [];
}
exports.getMitreCount = getMitreCount;
