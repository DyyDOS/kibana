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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Wazuh app - React component for render add modules data
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
const sample_data_1 = __importDefault(require("./sample-data"));
const guides_1 = __importDefault(require("./guides"));
const globalBreadcrumbActions_1 = require("../../redux/actions/globalBreadcrumbActions");
const store_1 = __importDefault(require("../../redux/store"));
const guides = Object.keys(guides_1.default).map(key => guides_1.default[key]).sort((a, b) => {
    if (a.name < b.name) {
        return -1;
    }
    else if (a.name > b.name) {
        return 1;
    }
    return 0;
});
;
;
class WzAddModulesData extends react_1.Component {
    constructor(props) {
        super(props);
        this.changeGuide = (guide = '') => {
            this.setState({ guide });
        };
        this.changeSelectedGuideCategory = (selectedGuideCategory = '') => {
            this.setState({ selectedGuideCategory });
        };
        // DON'T DELETE THE BELOW CODE. IT'S FOR MODULE GUIDES.
        // const categories = Object.keys(modeGuides).map(key => modeGuides[key].category).filter((value,key,array) => array.indexOf(value) === key);
        // this.tabs = [
        // 	...categories.map(category => ({
        // 		id: category,
        // 		name: category,
        // 		content: (
        // 			<Fragment>
        // 				<EuiSpacer size='m' />
        // 				<EuiFlexGrid columns={4}>
        // 					{this.getModulesFromCategory(category).map(extension => (
        // 						<EuiFlexItem key={`add-modules-data--${extension.id}`}>
        // 							<EuiCard
        // 								layout='horizontal'
        // 								icon={(<EuiIcon size='xl' type={extension.icon} />) }
        // 								title={extension.name}
        // 								description={(TabDescription[extension.id] && TabDescription[extension.id].description) || extension.description}
        // 								onClick={() => this.changeGuide(extension.id) }
        // 							/>
        // 						</EuiFlexItem>
        // 					))}
        // 				</EuiFlexGrid>
        // 			</Fragment>
        // 		)
        // 	})),
        // 	{
        // 		id: 'sample_data',
        // 		name: 'Sample data',
        // 		content: (
        // 			<Fragment>
        // 				<EuiSpacer size='m' />
        // 				<WzSampleData/>
        // 			</Fragment>
        // 		)
        // 	}
        // ];
        // this.state = {
        // 	guide: '',
        // 	selectedGuideCategory: window.location.href.includes('redirect=sample_data') ? this.tabs.find(tab => tab.id === 'sample_data') : this.tabs[0]
        // }
        // "redirect=sample_data" is injected into the href of the "here" button in the callout notifying of installed sample alerts
    }
    setGlobalBreadcrumb() {
        const breadcrumb = [
            { text: '' },
            { text: 'Management', href: '/app/wazuh#/manager' },
            { text: 'Sample data' }
        ];
        store_1.default.dispatch(globalBreadcrumbActions_1.updateGlobalBreadcrumb(breadcrumb));
    }
    componentDidMount() {
        this.setGlobalBreadcrumb();
    }
    getModulesFromCategory(category = '') {
        return category !== '' ? guides.filter(guide => guide.category === category) : guides;
    }
    render() {
        // const { guide, selectedGuideCategory } = this.state; // DON'T DELETE. IT'S FOR MODULE GUIDES. 
        return (react_1.default.createElement(eui_1.EuiPage, { restrictWidth: '1200px' },
            react_1.default.createElement(eui_1.EuiPageBody, null,
                react_1.default.createElement(eui_1.EuiFlexGroup, null,
                    react_1.default.createElement(eui_1.EuiFlexItem, null,
                        react_1.default.createElement(eui_1.EuiTitle, { size: 'l' },
                            react_1.default.createElement("span", null, "Sample data")),
                        react_1.default.createElement(eui_1.EuiText, { color: 'subdued' }, "Add sample data to modules."))),
                react_1.default.createElement(eui_1.EuiSpacer, { size: 'm' }),
                react_1.default.createElement(eui_1.EuiFlexGroup, null,
                    react_1.default.createElement(eui_1.EuiFlexItem, null,
                        react_1.default.createElement(sample_data_1.default, null))))));
    }
}
exports.default = WzAddModulesData;
