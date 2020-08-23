"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequirementsHead = void 0;
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
function RequirementsHead({ requirement, setRequirement }) {
    return (react_1.default.createElement(eui_1.EuiFlexGroup, { style: { padding: '12px 12px 0px' }, className: "embPanel__header" },
        react_1.default.createElement("h2", { className: "embPanel__title wz-headline-title" },
            react_1.default.createElement(eui_1.EuiText, { size: "xs" },
                react_1.default.createElement("h2", null, "Compliance"))),
        react_1.default.createElement("div", { style: { width: "auto", paddingTop: 6, paddingRight: 12 } },
            react_1.default.createElement(eui_1.EuiSelect, { compressed: true, id: "requirementSelect", options: requirements, value: requirement, onChange: e => setRequirement(e.target.value), "aria-label": "Select requirement" }))));
}
exports.RequirementsHead = RequirementsHead;
const requirements = [
    { value: 'pci_dss', text: 'PCI DSS' },
    { value: 'gdpr', text: 'GDPR' },
    { value: 'nist_800_53', text: 'NIST 800-53' },
    { value: 'hipaa', text: 'HIPAA' },
    { value: 'gpg13', text: 'GPG13' },
    { value: 'tsc', text: 'TSC' },
];
