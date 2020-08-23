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
exports.Settings = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const badge_1 = __importDefault(require("../../../controllers/management/components/management/configuration/util-components/badge"));
const wz_redux_provider_1 = __importDefault(require("../../../redux/wz-redux-provider"));
const integrity_monitoring_1 = __importDefault(require("../../../controllers/management/components/management/configuration/integrity-monitoring/integrity-monitoring"));
const policy_monitoring_1 = __importDefault(require("../../../controllers/management/components/management/configuration/policy-monitoring/policy-monitoring"));
const open_scap_1 = __importDefault(require("../../../controllers/management/components/management/configuration/open-scap/open-scap"));
const cis_cat_1 = __importDefault(require("../../../controllers/management/components/management/configuration/cis-cat/cis-cat"));
const vulnerabilities_1 = __importDefault(require("../../../controllers/management/components/management/configuration/vulnerabilities/vulnerabilities"));
const osquery_1 = __importDefault(require("../../../controllers/management/components/management/configuration/osquery/osquery"));
const docker_listener_1 = __importDefault(require("../../../controllers/management/components/management/configuration/docker-listener/docker-listener"));
class Settings extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = {
            badge: null
        };
    }
    updateBadge(badge) {
        this.setState({ badge });
    }
    render() {
        const { badge } = this.state;
        const { section } = this.props;
        return (react_1.default.createElement(wz_redux_provider_1.default, null,
            react_1.default.createElement(eui_1.EuiPage, null,
                react_1.default.createElement(eui_1.EuiPanel, null,
                    react_1.default.createElement(eui_1.EuiTitle, null,
                        react_1.default.createElement("span", null,
                            i18n_1.i18n.translate('wazuh.configuration', { defaultMessage: 'Configuration' }),
                            " ",
                            typeof badge === 'boolean' ?
                                react_1.default.createElement(badge_1.default, { enabled: badge }) : null)),
                    react_1.default.createElement(eui_1.EuiSpacer, { size: 'm' }),
                    section === 'fim' && react_1.default.createElement(integrity_monitoring_1.default, Object.assign({}, this.props, { updateBadge: (e) => this.updateBadge(e) })),
                    (section === 'pm' || section === 'sca' || section === 'audit') &&
                        react_1.default.createElement(policy_monitoring_1.default, Object.assign({}, this.props, { updateBadge: (e) => this.updateBadge(e), onlyShowTab: section === 'pm' ? 'Policy Monitoring' : section === 'audit' ? 'System audit' : section === 'sca' ? 'SCA' : undefined })),
                    section === 'oscap' && react_1.default.createElement(open_scap_1.default, Object.assign({}, this.props, { updateBadge: (e) => this.updateBadge(e) })),
                    section === 'ciscat' && react_1.default.createElement(cis_cat_1.default, Object.assign({}, this.props, { updateBadge: (e) => this.updateBadge(e) })),
                    section === 'vuls' && react_1.default.createElement(vulnerabilities_1.default, Object.assign({}, this.props, { updateBadge: (e) => this.updateBadge(e) })),
                    section === 'osquery' && react_1.default.createElement(osquery_1.default, Object.assign({}, this.props, { updateBadge: (e) => this.updateBadge(e) })),
                    section === 'docker' && react_1.default.createElement(docker_listener_1.default, Object.assign({}, this.props, { updateBadge: (e) => this.updateBadge(e) }))))));
    }
}
exports.Settings = Settings;
