"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getElasticAlerts = exports.getIndexPattern = void 0;
/*
 * Wazuh app - Mitre alerts components
 * Copyright (C) 2015-2020 Wazuh, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
// @ts-ignore
const kibana_services_1 = require("plugins/kibana/discover/kibana_services");
// @ts-ignore
const new_platform_1 = require("ui/new_platform");
const app_state_1 = require("../../../../react-services/app-state");
const generic_request_1 = require("../../../../react-services/generic-request");
const common_1 = require("../../../../../../../src/plugins/data/common");
const wazuh_config_1 = require("../../../../react-services/wazuh-config");
async function getIndexPattern() {
    const idIndexPattern = app_state_1.AppState.getCurrentPattern();
    const indexPattern = await kibana_services_1.getServices().indexPatterns.get(idIndexPattern);
    return indexPattern;
}
exports.getIndexPattern = getIndexPattern;
async function getElasticAlerts(indexPattern, filterParams, aggs = null, kargs = {}) {
    const wazuhConfig = new wazuh_config_1.WazuhConfig();
    const extraFilters = [];
    const { hideManagerAlerts } = wazuhConfig.getConfig();
    if (hideManagerAlerts)
        extraFilters.push({
            meta: {
                alias: null,
                disabled: false,
                key: 'agent.id',
                negate: true,
                params: { query: '000' },
                type: 'phrase',
                index: indexPattern.title
            },
            query: { match_phrase: { 'agent.id': '000' } },
            $state: { store: 'appState' }
        });
    const queryFilters = {};
    queryFilters["query"] = filterParams.query;
    queryFilters["time"] = filterParams.time;
    queryFilters["filters"] = [...filterParams.filters, ...extraFilters];
    const query = buildQuery(indexPattern, queryFilters);
    const filters = ((query || {}).bool || {}).filter;
    if (filters && Array.isArray(filters)) {
        filters.forEach(item => {
            if (item.range && item.range.timestamp && item.range.timestamp.mode) { //range filters can contain a "mode" field that causes an error in an Elasticsearch request
                delete item.range.timestamp["mode"];
            }
        });
    }
    const search = {
        index: indexPattern['title'],
        body: {
            query,
            ...(aggs ? { aggs } : {}),
            ...kargs
        }
    };
    const searchResponse = await generic_request_1.GenericRequest.request('POST', '/elastic/esAlerts', search);
    return searchResponse;
}
exports.getElasticAlerts = getElasticAlerts;
function buildQuery(indexPattern, filterParams) {
    const { filters, query, time } = filterParams;
    const timeFilter = common_1.buildRangeFilter({ name: 'timestamp', type: 'date' }, time, indexPattern);
    return common_1.buildEsQuery(undefined, query, [...filters, timeFilter], common_1.getEsQueryConfig(new_platform_1.npSetup.core.uiSettings));
}
