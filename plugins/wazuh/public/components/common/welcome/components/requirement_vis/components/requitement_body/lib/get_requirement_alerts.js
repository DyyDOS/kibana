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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequirementAlerts = void 0;
const lib_1 = require("../../../../../../../overview/mitre/lib");
const fim_events_table_1 = require("../../../../fim_events_table");
const common_1 = require("../../../../../../../../../../../src/plugins/data/common");
async function getRequirementAlerts(agentId, time, requirement) {
    const indexPattern = await lib_1.getIndexPattern();
    const filters = [
        ...createFilters(agentId, indexPattern),
        createExistsFilter(requirement, indexPattern),
    ];
    const filterParams = {
        filters,
        query: { query: '', language: 'kuery' },
        time
    };
    const aggs = {
        alerts_count: {
            terms: {
                field: `rule.${requirement}`,
                size: 5,
            }
        }
    };
    const response = await lib_1.getElasticAlerts(indexPattern, filterParams, aggs);
    return {
        alerts_count: ((((response || {}).data || {}).aggregations || {}).alerts_count || {}).buckets,
        total_alerts: (((response || {}).data || {}).hits || {}).total
    };
}
exports.getRequirementAlerts = getRequirementAlerts;
function createFilters(agentId, indexPattern) {
    const filter = filter => {
        return {
            ...common_1.buildPhraseFilter({ name: filter.name, type: 'text' }, filter.value, indexPattern),
            "$state": { "store": "appState" }
        };
    };
    const wazuhFilter = fim_events_table_1.getWazuhFilter();
    const filters = [
        wazuhFilter,
        { name: 'agent.id', value: agentId },
    ];
    return filters.map(filter);
}
function createExistsFilter(requirement, indexPattern) {
    return common_1.buildExistsFilter({ name: `rule.${requirement}`, type: 'nested' }, indexPattern);
}
