"use strict";
/*
 * Wazuh app - React component for building the management welcome screen.
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
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
class WzTextWithTooltipIfTruncated extends react_1.Component {
    constructor(props) {
        super(props);
        this.reference = react_1.default.createRef();
        this.state = {
            withTooltip: false
        };
    }
    componentDidMount() {
        this.timer = setTimeout(() => {
            // HTML element reference with text (maybe truncated)
            const reference = this.reference.current;
            // HTML element clone of reference
            const clone = reference.cloneNode(true);
            clone.style.display = "inline";
            clone.style.width = "auto";
            clone.style.visibility = "hidden";
            clone.style.maxWidth = "none";
            // Insert clone in DOM appending as sibling of reference to measure both
            // reference.parentNode.appendChild(clone);
            // Insert clone in DOM as body child
            document.body.appendChild(clone);
            // Compare widths
            if (reference.offsetWidth < clone.offsetWidth) {
                // Set withTooltip to true to render truncated element with a tooltip
                this.setState({ withTooltip: true });
            }
            // Remove clone of DOM
            clone.remove();
        });
    }
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }
    buildContent() {
        return (react_1.default.createElement("span", { ref: this.reference, style: {
                display: "block",
                overflow: "hidden",
                paddingBottom: "3px",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                ...this.props.elementStyle
            } }, this.props.children || this.props.tooltip));
    }
    render() {
        return this.state.withTooltip ? (react_1.default.createElement(eui_1.EuiToolTip, Object.assign({ content: this.props.tooltip || this.props.children }, this.props.tooltipProps), this.buildContent())) : (this.buildContent());
    }
}
exports.default = WzTextWithTooltipIfTruncated;
WzTextWithTooltipIfTruncated.defaultProps = {
    elementStyle: {}
};
;
