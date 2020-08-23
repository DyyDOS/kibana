"use strict";
/*
 * Wazuh app - React component for show search and filter
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
exports.WzSearchButtons = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
const combine = (...args) => (input) => args.reduceRight((acc, arg) => acc = arg(acc), input);
class WzSearchButtons extends react_1.Component {
    constructor(props) {
        super(props);
        this.buildOptions = () => this.props.options.map((item) => ({
            id: item.label,
            label: item.label,
            name: "options",
            ...(item.iconType && { iconType: item.iconType }),
        }));
        this.onChange = optionId => combine(this.props.onChange, this.updateFilters, this.toggleIcon)(optionId);
        this.toggleIcon = (optionId) => {
            const { IconSelectedMap } = this.state;
            return { ...IconSelectedMap, [optionId]: !IconSelectedMap[optionId] };
        };
        this.updateFilters = (IconSelectedMap) => {
            const { options } = this.state;
            const { filters } = this.props;
            return Object.keys(IconSelectedMap).reduce((acc, label) => {
                const { field, value } = options[label];
                const filter = filters.find(filter => filter.field === field);
                ((filter && IconSelectedMap[label]) || IconSelectedMap[label]) && acc.push({ field, value });
                return acc;
            }, []);
        };
        this.state = {
            IconSelectedMap: {},
            options: {}
        };
        this.onChange.bind(this);
        this.toggleIcon.bind(this);
        this.updateFilters.bind(this);
    }
    componentDidMount() {
        const options = this.props.options
            .reduce((acc, option) => ({ ...acc, [option.label]: option }), {});
        this.setState({ options });
    }
    shouldComponentUpdate(nextProps) {
        const currenttFilters = JSON.stringify(this.props.filters);
        const nextFilters = JSON.stringify(nextProps.filters);
        return (currenttFilters === nextFilters);
    }
    componentDidUpdate() {
        this.checkFilters();
    }
    checkFilters() {
        const { filters, options } = this.props;
        const { IconSelectedMap } = this.state;
        for (const button of options) {
            const filterExist = filters.find(filter => filter.field === button.field && filter.value === button.value);
            IconSelectedMap[button.label] = !!filterExist;
        }
    }
    render() {
        const { IconSelectedMap } = this.state;
        const options = this.buildOptions();
        return (react_1.default.createElement(eui_1.EuiButtonGroup, { legend: "Text align", name: "textAlign", buttonSize: "m", options: options, idToSelectedMap: IconSelectedMap, type: "multi", onChange: this.onChange.bind(this) }));
    }
}
exports.WzSearchButtons = WzSearchButtons;
