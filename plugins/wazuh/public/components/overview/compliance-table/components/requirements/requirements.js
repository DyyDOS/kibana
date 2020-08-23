"use strict";
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
exports.ComplianceRequirements = void 0;
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
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
const requirement_name_1 = require("../../requirement-name");
class ComplianceRequirements extends react_1.Component {
    constructor(props) {
        super(props);
        this._isMount = false;
        this.state = {
            isPopoverOpen: false,
        };
    }
    facetClicked(id) {
        const { selectedRequirements: oldSelected, onChangeSelectedRequirements } = this.props;
        const selectedRequirements = {
            ...oldSelected,
            [id]: !oldSelected[id]
        };
        onChangeSelectedRequirements(selectedRequirements);
    }
    getRequirementsList() {
        const requirementsCount = this.props.requirementsCount || [];
        const { selectedRequirements } = this.props;
        const requirementIds = Object.keys(this.props.complianceObject);
        const requirementList = requirementIds.map(item => {
            let quantity = 0;
            this.props.complianceObject[item].forEach(subitem => {
                quantity += (requirementsCount.find(requirement => requirement.key === subitem) || {}).doc_count || 0;
            });
            return {
                id: item,
                label: item,
                quantity,
                onClick: (id) => this.facetClicked(id),
            };
        });
        return (react_1.default.createElement(react_1.default.Fragment, null, requirementList.sort((a, b) => b.quantity - a.quantity).map(facet => {
            let iconNode;
            const name = requirement_name_1.requirementsName[facet.label] || `Requirement ${facet.label}`;
            return (react_1.default.createElement(eui_1.EuiFacetButton, { key: "Requirement " + facet.id, id: `Requirement ${facet.id}`, quantity: facet.quantity, isSelected: this.props.selectedRequirements[facet.id], isLoading: this.props.loadingAlerts, icon: iconNode, onClick: facet.onClick ? () => facet.onClick(facet.id) : undefined },
                react_1.default.createElement(eui_1.EuiToolTip, { position: "top", content: name, anchorClassName: "wz-display-inline-grid" },
                    react_1.default.createElement("span", { style: {
                            display: "block",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis"
                        } },
                        "Requirement ",
                        facet.label))));
        })));
    }
    onGearButtonClick() {
        this.setState({ isPopoverOpen: !this.state.isPopoverOpen });
    }
    closePopover() {
        this.setState({ isPopoverOpen: false });
    }
    selectAll(status) {
        const { selectedRequirements, onChangeSelectedRequirements } = this.props;
        Object.keys(selectedRequirements).map(item => {
            selectedRequirements[item] = status;
        });
        onChangeSelectedRequirements(selectedRequirements);
    }
    render() {
        const panels = [
            {
                id: 0,
                title: 'Options',
                items: [
                    {
                        name: 'Select all',
                        icon: react_1.default.createElement(eui_1.EuiIcon, { type: "check", size: "m" }),
                        onClick: () => {
                            this.closePopover();
                            this.selectAll(true);
                        },
                    },
                    {
                        name: 'Unselect all',
                        icon: react_1.default.createElement(eui_1.EuiIcon, { type: "cross", size: "m" }),
                        onClick: () => {
                            this.closePopover();
                            this.selectAll(false);
                        },
                    },
                ]
            }
        ];
        let sectionStyle = {};
        let title = "";
        if (this.props.section === "gdpr") {
            sectionStyle["height"] = 300;
            title = "GDPR";
        }
        if (this.props.section === "pci") {
            title = "PCI DSS";
        }
        if (this.props.section === "hipaa") {
            title = "HIPAA";
        }
        if (this.props.section === "nist") {
            title = "NIST 800-53";
        }
        if (this.props.section === "tsc") {
            title = "TSC";
            sectionStyle["height"] = 350;
        }
        return (react_1.default.createElement("div", { style: { backgroundColor: "#80808014", padding: "10px 10px 0 10px", minHeight: 300, height: "100%" } },
            react_1.default.createElement(eui_1.EuiFlexGroup, null,
                react_1.default.createElement(eui_1.EuiFlexItem, null,
                    react_1.default.createElement(eui_1.EuiTitle, { size: "m" },
                        react_1.default.createElement("h1", null, title))),
                react_1.default.createElement(eui_1.EuiFlexItem, { grow: false, style: { marginTop: '15px', marginRight: 8 } },
                    react_1.default.createElement(eui_1.EuiPopover, { button: (react_1.default.createElement(eui_1.EuiButtonIcon, { iconType: "gear", onClick: () => this.onGearButtonClick() })), isOpen: this.state.isPopoverOpen, panelPaddingSize: "none", withTitle: true, closePopover: () => this.closePopover() },
                        react_1.default.createElement(eui_1.EuiContextMenu, { initialPanelId: 0, panels: panels })))),
            react_1.default.createElement(eui_1.EuiFacetGroup, { style: {} }, this.getRequirementsList())));
    }
}
exports.ComplianceRequirements = ComplianceRequirements;
