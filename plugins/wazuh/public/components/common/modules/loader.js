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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loader = void 0;
const react_1 = __importStar(require("react"));
const kibana_services_1 = require("plugins/kibana/discover/kibana_services");
const eui_1 = require("@elastic/eui");
const app = kibana_services_1.getAngularModule('app/wazuh');
class Loader extends react_1.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.$rootScope = app.$injector.get('$rootScope');
        this.$rootScope.loadingDashboard = true;
        this.$rootScope.$applyAsync();
    }
    componentWillUnmount() {
        this.$rootScope.loadingDashboard = false;
        this.$rootScope.$applyAsync();
    }
    redirect() {
        setTimeout(() => {
            this.props.loadSection(this.props.redirect);
        }, 100);
    }
    render() {
        const redirect = this.redirect();
        return (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(eui_1.EuiSpacer, { size: 'xl' }),
            react_1.default.createElement("div", { style: { margin: '-8px auto', width: 32 } },
                react_1.default.createElement(eui_1.EuiLoadingSpinner, { size: "xl" })),
            redirect));
    }
}
exports.Loader = Loader;
