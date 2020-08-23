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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dashboard = void 0;
const react_1 = require("react");
const kibana_services_1 = require("plugins/kibana/discover/kibana_services");
const modules_helper_1 = require("./modules-helper");
class Dashboard extends react_1.Component {
    constructor(props) {
        super(props);
        this._isMount = false;
        this.modulesHelper = modules_helper_1.ModulesHelper;
    }
    async componentDidMount() {
        this._isMount = true;
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        const app = kibana_services_1.getAngularModule('app/wazuh');
        this.$rootScope = app.$injector.get('$rootScope');
        this.$rootScope.showModuleDashboard = this.props.section;
        await this.modulesHelper.getDiscoverScope();
        if (this._isMount) {
            this.$rootScope.moduleDiscoverReady = true;
            this.$rootScope.$applyAsync();
        }
    }
    componentWillUnmount() {
        this._isMount = false;
        this.$rootScope.showModuleDashboard = false;
        this.$rootScope.moduleDiscoverReady = false;
        this.$rootScope.$applyAsync();
    }
    render() {
        return false;
    }
}
exports.Dashboard = Dashboard;
