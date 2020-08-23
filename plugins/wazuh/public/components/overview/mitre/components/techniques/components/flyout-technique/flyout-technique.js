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
exports.FlyoutTechnique = void 0;
/*
 * Wazuh app - Mitre flyout components
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
const markdown_it_1 = __importDefault(require("markdown-it"));
const jquery_1 = __importDefault(require("jquery"));
const md = new markdown_it_1.default({
    html: true,
    linkify: true,
    breaks: true,
    typographer: true
});
const eui_1 = require("@elastic/eui");
const wz_request_1 = require("../../../../../../../react-services/wz-request");
const app_state_1 = require("../../../../../../../react-services/app-state");
const discover_1 = require("../../../../../../common/modules/discover");
class FlyoutTechnique extends react_1.Component {
    constructor(props) {
        super(props);
        this._isMount = false;
        this.updateTotalHits = (total) => {
            this.setState({ totalHits: total });
        };
        this.state = {
            techniqueData: {
            // description: ''
            },
            loading: false
        };
    }
    async componentDidMount() {
        this._isMount = true;
        const isCluster = (app_state_1.AppState.getClusterInfo() || {}).status === "enabled";
        const clusterFilter = isCluster
            ? { "cluster.name": app_state_1.AppState.getClusterInfo().cluster }
            : { "manager.name": app_state_1.AppState.getClusterInfo().manager };
        this.clusterFilter = clusterFilter;
        await this.getTechniqueData();
        this.addListenersToCitations();
    }
    async componentDidUpdate(prevProps) {
        const { currentTechnique } = this.props;
        if (prevProps.currentTechnique !== currentTechnique) {
            await this.getTechniqueData();
        }
        this.addListenersToCitations();
    }
    componentWillUnmount() {
        // remove listeners of citations if these exist
        if (this.state.techniqueData && this.state.techniqueData.replaced_external_references && this.state.techniqueData.replaced_external_references.length > 0) {
            this.state.techniqueData.replaced_external_references.forEach(reference => {
                jquery_1.default(`.technique-reference-${reference.index}`).each(function () {
                    jquery_1.default(this).off();
                });
            });
        }
    }
    addListenersToCitations() {
        if (this.state.techniqueData && this.state.techniqueData.replaced_external_references && this.state.techniqueData.replaced_external_references.length > 0) {
            this.state.techniqueData.replaced_external_references.forEach(reference => {
                jquery_1.default(`.technique-reference-citation-${reference.index}`).each(function () {
                    jquery_1.default(this).off();
                    jquery_1.default(this).click(() => {
                        jquery_1.default(`.euiFlyoutBody__overflow`).scrollTop(jquery_1.default(`#technique-reference-${reference.index}`).position().top);
                    });
                });
            });
        }
    }
    async getTechniqueData() {
        try {
            this.setState({ loading: true, techniqueData: {} });
            const { currentTechnique } = this.props;
            const result = await wz_request_1.WzRequest.apiReq('GET', '/mitre', {
                q: `id=${currentTechnique}`
            });
            const rawData = (((result || {}).data || {}).data || {}).items;
            !!rawData && this.formatTechniqueData(rawData[0]);
        }
        catch (err) {
            this.setState({ loading: false });
        }
    }
    formatTechniqueData(rawData) {
        const { platform_name, phase_name } = rawData;
        const { name, description, x_mitre_version: version, x_mitre_data_sources, external_references } = rawData.json;
        const replaced_external_references = [];
        let index_replaced_external_references = 0;
        let last_citation_string = '';
        const descriptionWithCitations = external_references.reduce((accum, reference) => {
            return accum
                .replace(new RegExp(`\\(Citation: ${reference.source_name}\\)`, 'g'), (token) => {
                if (last_citation_string !== token) {
                    index_replaced_external_references++;
                    replaced_external_references.push({ ...reference, index: index_replaced_external_references });
                    last_citation_string = token;
                }
                return `<a style="vertical-align: super;" rel="noreferrer" class="euiLink euiLink--primary technique-reference-citation-${index_replaced_external_references}">[${String(index_replaced_external_references)}]</a>`;
            });
        }, description);
        this.setState({ techniqueData: { name, description: descriptionWithCitations, phase_name, platform_name, version, x_mitre_data_sources, external_references, replaced_external_references }, loading: false });
    }
    getArrayFormatted(arrayText) {
        try {
            const stringText = arrayText.toString();
            const splitString = stringText.split(',');
            const resultString = splitString.join(', ');
            return resultString;
        }
        catch (err) {
            return arrayText;
        }
    }
    renderHeader() {
        const { techniqueData } = this.state;
        return (react_1.default.createElement(eui_1.EuiFlyoutHeader, { hasBorder: true, style: { padding: "12px 16px" } }, (Object.keys(techniqueData).length === 0 && (react_1.default.createElement("div", null,
            react_1.default.createElement(eui_1.EuiLoadingContent, { lines: 1 })))) || (react_1.default.createElement(eui_1.EuiTitle, { size: "m" },
            react_1.default.createElement("h2", { id: "flyoutSmallTitle" }, techniqueData.name)))));
    }
    renderBody() {
        const { currentTechnique } = this.props;
        const { techniqueData } = this.state;
        const implicitFilters = [{ 'rule.mitre.id': currentTechnique }, this.clusterFilter];
        if (this.props.implicitFilters) {
            this.props.implicitFilters.forEach(item => implicitFilters.push(item));
        }
        const link = `https://attack.mitre.org/techniques/${currentTechnique}/`;
        const formattedDescription = techniqueData.description
            ? (react_1.default.createElement("div", { className: "wz-markdown-margin wz-markdown-wapper", dangerouslySetInnerHTML: { __html: md.render(techniqueData.description) } }))
            : techniqueData.description;
        const data = [
            {
                title: 'ID',
                description: (react_1.default.createElement(eui_1.EuiToolTip, { position: "top", content: "Open " + currentTechnique + " details in a new page" },
                    react_1.default.createElement(eui_1.EuiLink, { href: link, external: true, target: "_blank" }, currentTechnique)))
            },
            {
                title: 'Tactic',
                description: this.getArrayFormatted(techniqueData.phase_name)
            },
            {
                title: 'Platform',
                description: this.getArrayFormatted(techniqueData.platform_name)
            },
            {
                title: 'Data sources',
                description: this.getArrayFormatted(techniqueData.x_mitre_data_sources)
            },
            {
                title: 'Version',
                description: techniqueData.version
            },
            {
                title: 'Description',
                description: formattedDescription
            },
        ];
        if (techniqueData && techniqueData.replaced_external_references && techniqueData.replaced_external_references.length > 0) {
            data.push({
                title: 'References',
                description: (react_1.default.createElement(eui_1.EuiFlexGroup, null,
                    react_1.default.createElement(eui_1.EuiFlexItem, null, techniqueData.replaced_external_references.map((external_reference, external_reference_index) => (react_1.default.createElement("div", { key: `external_reference-${external_reference.index}`, id: `technique-reference-${external_reference.index}` },
                        react_1.default.createElement("span", null,
                            external_reference.index,
                            ". "),
                        react_1.default.createElement(eui_1.EuiLink, { href: external_reference.url, target: '_blank' }, external_reference.source_name)))))))
            });
        }
        return (react_1.default.createElement(eui_1.EuiFlyoutBody, { className: "flyout-body" },
            react_1.default.createElement(eui_1.EuiAccordion, { id: "details", buttonContent: react_1.default.createElement(eui_1.EuiTitle, { size: "s" },
                    react_1.default.createElement("h3", null, "Technique details")), paddingSize: "none", initialIsOpen: true },
                react_1.default.createElement("div", { className: 'flyout-row details-row' }, (Object.keys(techniqueData).length === 0 && (react_1.default.createElement("div", null,
                    react_1.default.createElement(eui_1.EuiLoadingContent, { lines: 2 }),
                    react_1.default.createElement(eui_1.EuiLoadingContent, { lines: 3 })))) || (react_1.default.createElement("div", { style: { marginBottom: 30 } },
                    react_1.default.createElement(eui_1.EuiDescriptionList, { listItems: data }),
                    react_1.default.createElement(eui_1.EuiSpacer, null),
                    react_1.default.createElement("p", null,
                        "More info:",
                        ' ',
                        react_1.default.createElement(eui_1.EuiLink, { href: link, target: "_blank" }, `MITRE ATT&CK - ${currentTechnique}`)))))),
            react_1.default.createElement(eui_1.EuiSpacer, { size: 's' }),
            react_1.default.createElement(eui_1.EuiAccordion, { style: { textDecoration: 'none' }, id: "recent_events", className: 'events-accordion', extraAction: react_1.default.createElement("div", { style: { marginBottom: 5 } },
                    react_1.default.createElement("strong", null, this.state.totalHits || 0),
                    " hits"), buttonContent: react_1.default.createElement(eui_1.EuiTitle, { size: "s" },
                    react_1.default.createElement("h3", null,
                        "Recent events",
                        this.props.view !== 'events' && (react_1.default.createElement("span", { style: { marginLeft: 16 } },
                            react_1.default.createElement("span", null,
                                react_1.default.createElement(eui_1.EuiToolTip, { position: "top", content: "Show " + currentTechnique + " in Dashboard" },
                                    react_1.default.createElement(eui_1.EuiIcon, { onMouseDown: (e) => { this.props.openDashboard(e, currentTechnique); e.stopPropagation(); }, color: "primary", type: "visualizeApp", style: { marginRight: '10px' } })),
                                react_1.default.createElement(eui_1.EuiToolTip, { position: "top", content: "Inspect " + currentTechnique + " in Events" },
                                    react_1.default.createElement(eui_1.EuiIcon, { onMouseDown: (e) => { this.props.openDiscover(e, currentTechnique); e.stopPropagation(); }, color: "primary", type: "discoverApp" }))))))), paddingSize: "none", initialIsOpen: true },
                react_1.default.createElement(eui_1.EuiFlexGroup, { className: "flyout-row" },
                    react_1.default.createElement(eui_1.EuiFlexItem, null,
                        react_1.default.createElement(discover_1.Discover, { initialColumns: ["icon", "timestamp", 'rule.mitre.id', 'rule.mitre.tactic', 'rule.level', 'rule.id', 'rule.description'], implicitFilters: implicitFilters, initialFilters: [], updateTotalHits: (total) => this.updateTotalHits(total) }))))));
    }
    renderLoading() {
        return (react_1.default.createElement(eui_1.EuiFlyoutBody, null,
            react_1.default.createElement(eui_1.EuiLoadingContent, { lines: 2 }),
            react_1.default.createElement(eui_1.EuiLoadingContent, { lines: 3 })));
    }
    render() {
        const { techniqueData } = this.state;
        const { onChangeFlyout } = this.props;
        return (react_1.default.createElement(eui_1.EuiFlyout, { onClose: () => onChangeFlyout(false), size: "l", className: "flyout-no-overlap", "aria-labelledby": "flyoutSmallTitle" },
            techniqueData &&
                this.renderHeader(),
            this.renderBody(),
            this.state.loading &&
                this.renderLoading()));
    }
}
exports.FlyoutTechnique = FlyoutTechnique;
