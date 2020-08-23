"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChartDimensions = void 0;
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
const react_1 = require("react");
const combineChartDimensions = dimensions => {
    let parsedDimensions = {
        marginTop: 40,
        marginRight: 30,
        marginBottom: 40,
        marginLeft: 75,
        ...dimensions,
    };
    return {
        ...parsedDimensions,
        boundedHeight: Math.max(parsedDimensions.height - parsedDimensions.marginTop - parsedDimensions.marginBottom, 0),
        boundedWidth: Math.max(parsedDimensions.width - parsedDimensions.marginLeft - parsedDimensions.marginRight, 0),
    };
};
exports.useChartDimensions = (passedSettings, ref) => {
    const dimensions = combineChartDimensions(passedSettings);
    const [width, changeWidth] = react_1.useState(0);
    const [height, changeHeight] = react_1.useState(0);
    react_1.useEffect(() => {
        if (dimensions.width && dimensions.height)
            return;
        const element = ref.current.parentNode.parentNode.parentNode;
        const resizeObserver = new ResizeObserver(entries => {
            if (!Array.isArray(entries))
                return;
            if (!entries.length)
                return;
            const entry = entries[0];
            if (width != entry.contentRect.width)
                changeWidth(entry.contentRect.width / 2);
            if (height != entry.contentRect.height)
                changeHeight(entry.contentRect.height / 2);
        });
        resizeObserver.observe(element);
        return () => resizeObserver.unobserve(element);
    }, []);
    const newSettings = combineChartDimensions({
        ...dimensions,
        width: dimensions.width || width,
        height: dimensions.height || height,
    });
    return [ref, newSettings];
};
