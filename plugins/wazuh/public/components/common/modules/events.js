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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = void 0;
const react_1 = __importStar(require("react"));
const kibana_services_1 = require("plugins/kibana/discover/kibana_services");
const events_selected_fields_1 = require("./events-selected-fields");
const events_1 = require("../../agents/fim/events");
const mitre_events_1 = require("./mitre-events");
const modules_helper_1 = require("./modules-helper");
const store_1 = __importDefault(require("../../../redux/store"));
class Events extends react_1.Component {
    constructor(props) {
        super(props);
        this.modulesHelper = modules_helper_1.ModulesHelper;
        this.isMount = true;
    }
    async componentDidMount() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        const app = kibana_services_1.getAngularModule('app/wazuh');
        this.$rootScope = app.$injector.get('$rootScope');
        this.$rootScope.showModuleEvents = this.props.section;
        const scope = await this.modulesHelper.getDiscoverScope();
        if (this.isMount) {
            this.$rootScope.moduleDiscoverReady = true;
            this.$rootScope.$applyAsync();
            const fields = events_selected_fields_1.EventsSelectedFiles[this.props.section];
            const index = fields.indexOf('agent.name');
            if (index > -1 && store_1.default.getState().appStateReducers.currentAgentData.id) { //if an agent is pinned we don't show the agent.name column
                fields.splice(index, 1);
            }
            if (fields) {
                scope.state.columns = fields;
                scope.addColumn(false);
                scope.removeColumn(false);
            }
            this.fetchWatch = scope.$watchCollection('fetchStatus', () => {
                if (scope.fetchStatus === 'complete') {
                    setTimeout(() => { this.modulesHelper.cleanAvailableFields(); }, 1000);
                }
            });
        }
    }
    componentWillUnmount() {
        this.isMount = false;
        if (this.fetchWatch)
            this.fetchWatch();
        this.$rootScope.showModuleEvents = false;
        this.$rootScope.moduleDiscoverReady = false;
        this.$rootScope.$applyAsync();
    }
    render() {
        return (react_1.default.createElement(react_1.Fragment, null,
            this.props.section === 'fim' && react_1.default.createElement(events_1.EventsFim, Object.assign({}, this.props)),
            this.props.section === 'mitre' && react_1.default.createElement(mitre_events_1.EventsMitre, Object.assign({}, this.props))));
    }
}
exports.Events = Events;
