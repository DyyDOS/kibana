"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WzSearchBadges = void 0;
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
const react_1 = __importDefault(require("react"));
const eui_1 = require("@elastic/eui");
require("./wz-search-badges.less");
function WzSearchBadges({ filters, onFiltersChange }) {
    const removeFilter = (key) => { const newFilters = [...filters]; newFilters.splice(key, 1); onFiltersChange(newFilters); };
    const badges = filters.map((filter, key) => badge({ filter, key, removeFilter }));
    return badges;
}
exports.WzSearchBadges = WzSearchBadges;
function badge({ filter, key, removeFilter }) {
    return (react_1.default.createElement(eui_1.EuiBadge, { key: key, className: 'wz-search-badge', color: 'hollow', iconType: 'cross', iconSide: 'right', onFocus: e => e.stopPropagation(), iconOnClick: () => removeFilter(key), iconOnClickAriaLabel: 'Remove filter' },
        filter.field !== 'q' ? `${filter.field}:` : '',
        " ",
        filter.value));
}
