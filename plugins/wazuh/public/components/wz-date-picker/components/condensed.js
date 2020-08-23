"use strict";
/*
 * Wazuh app - React component for select time and sync with kibana discover
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
exports.CondensedPicker = void 0;
const react_1 = __importStar(require("react"));
const components_1 = require("../../common/welcome/components");
const eui_1 = require("@elastic/eui");
const pretty_duration_1 = require("../../../../../../node_modules/@elastic/eui/lib/components/date_picker/super_date_picker/pretty_duration");
const time_service_1 = require("../../../react-services/time-service");
function CondensedPicker({ ranges, onTimeChange }) {
    const [isOpen, setIsOpen] = react_1.useState(false);
    const [selectedRange, setSelectedRange] = react_1.useState(6);
    const [customRange, setCustomRange] = react_1.useState();
    const timeFilter = components_1.useTimeFilter();
    react_1.useEffect(() => {
        const rangeSelected = ranges.findIndex(range => (range.start === timeFilter.from && range.end === timeFilter.to));
        if (rangeSelected === -1) {
            setCustomRange(pretty_duration_1.prettyDuration(timeFilter.from, timeFilter.to));
        }
        else {
            setCustomRange(undefined);
            if (selectedRange !== rangeSelected) {
                setSelectedRange(rangeSelected);
            }
        }
    }, [timeFilter]);
    const dateFormat = () => {
        const result = customRange.replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}/gi, (e) => time_service_1.TimeService.offset(e));
        return result;
    };
    const button = (react_1.default.createElement(eui_1.EuiButtonEmpty, { onClick: () => setIsOpen(true), iconType: "arrowDown", iconSide: "right" }, !!customRange
        ? dateFormat()
        : ranges[selectedRange].label));
    return (react_1.default.createElement(eui_1.EuiPopover, { button: button, isOpen: isOpen, closePopover: () => setIsOpen(false) },
        react_1.default.createElement("div", { style: { width: '200px' } }, ranges.map((range, idx) => (react_1.default.createElement(eui_1.EuiFlexGroup, { key: idx, gutterSize: "s", alignItems: "center" },
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiButtonEmpty, { size: "s", onClick: () => { setIsOpen(false); onTimeChange(range); setSelectedRange(idx); } }, range.label))))))));
}
exports.CondensedPicker = CondensedPicker;
