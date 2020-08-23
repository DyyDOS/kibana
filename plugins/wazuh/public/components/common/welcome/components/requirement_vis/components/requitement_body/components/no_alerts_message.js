"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoAlertsMessage = void 0;
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
const react_1 = __importDefault(require("react"));
const eui_1 = require("@elastic/eui");
function NoAlertsMessage({ requirement }) {
    const formatedRequirement = requirements[requirement];
    return (react_1.default.createElement(eui_1.EuiEmptyPrompt, { iconType: "stats", title: react_1.default.createElement("h4", null, "No results"), body: react_1.default.createElement("p", null,
            "No ",
            formatedRequirement,
            " results were found in the selected time range.") }));
}
exports.NoAlertsMessage = NoAlertsMessage;
const requirements = {
    'pci_dss': 'PCI DSS',
    'gdpr': 'GDPR',
    'nist_800_53': 'NIST 800-53',
    'hipaa': 'HIPAA',
    'gpg13': 'GPG13',
    'tsc': 'TSC',
};
