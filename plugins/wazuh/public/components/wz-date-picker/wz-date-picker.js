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
exports.WzDatePicker = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
//@ts-ignore
const kibana_services_1 = require("plugins/kibana/discover/kibana_services");
const components_1 = require("./components");
;
class WzDatePicker extends react_1.Component {
    constructor(props) {
        super(props);
        this.commonDurationRanges = [
            { "start": "now/d", "end": "now/d", "label": "Today" },
            { "start": "now/w", "end": "now/w", "label": "This week" },
            { "start": "now-15m", "end": "now", "label": "Last 15 minutes" },
            { "start": "now-30m", "end": "now", "label": "Last 30 minutes" },
            { "start": "now-1h", "end": "now", "label": "Last 1 hour" },
            { "start": "now-24h", "end": "now", "label": "Last 24 hours" },
            { "start": "now-7d", "end": "now", "label": "Last 7 days" },
            { "start": "now-30d", "end": "now", "label": "Last 30 days" },
            { "start": "now-90d", "end": "now", "label": "Last 90 days" },
            { "start": "now-1y", "end": "now", "label": "Last 1 year" },
        ];
        this.onTimeChange = (datePicker) => {
            const { start: from, end: to } = datePicker;
            this.setState({ datePicker });
            this.timefilter.setTime({ from, to });
            this.props.onTimeChange(datePicker);
        };
        this.timefilter = kibana_services_1.getServices().timefilter;
        const { from, to } = this.timefilter.getTime();
        this.state = {
            datePicker: {
                start: from,
                end: to,
                isQuickSelection: true,
                isInvalid: false,
            },
        };
    }
    componentDidMount() {
    }
    render() {
        const { datePicker } = this.state;
        const recentlyUsedRanges = this.timefilter._history.history.items.map(item => ({ start: item.from, end: item.to }));
        return !this.props.condensed
            ? react_1.default.createElement(eui_1.EuiSuperDatePicker, Object.assign({ commonlyUsedRanges: this.commonDurationRanges, recentlyUsedRanges: recentlyUsedRanges, onTimeChange: this.onTimeChange }, datePicker))
            : react_1.default.createElement(components_1.CondensedPicker, { onTimeChange: this.onTimeChange, ranges: this.commonDurationRanges });
    }
}
exports.WzDatePicker = WzDatePicker;
