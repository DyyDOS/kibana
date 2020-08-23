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
exports.Inventory = void 0;
const react_1 = __importStar(require("react"));
const pie_1 = require("../../d3/pie");
const eui_1 = require("@elastic/eui");
const wz_request_1 = require("../../../react-services/wz-request");
const time_service_1 = __importDefault(require("../../../react-services/time-service"));
const wz_csv_1 = __importDefault(require("../../../react-services/wz-csv"));
const notify_1 = require("ui/notify");
const wz_search_bar_1 = require("../../../components/wz-search-bar");
class Inventory extends react_1.Component {
    constructor(props) {
        super(props);
        this._isMount = false;
        this.toggleDetails = item => {
            const itemIdToExpandedRowMap = { ...this.state.itemIdToExpandedRowMap };
            item.complianceText = '';
            if (item.compliance && item.compliance.length) {
                item.compliance.forEach(x => {
                    item.complianceText += `${x.key}: ${x.value}\n`;
                });
            }
            if (item.rules.length) {
                item.rulesText = '';
                item.rules.forEach(x => {
                    item.rulesText += `${x.rule}\n`;
                });
            }
            if (itemIdToExpandedRowMap[item.id]) {
                delete itemIdToExpandedRowMap[item.id];
            }
            else {
                let checks = '';
                checks += (item.rules || []).length > 1 ? 'Checks' : 'Check';
                checks += item.condition ? ` (Condition: ${item.condition})` : '';
                const listItems = [
                    {
                        title: 'Check not applicable due to:',
                        description: item.reason
                    },
                    {
                        title: 'Rationale',
                        description: item.rationale || '-'
                    },
                    {
                        title: 'Remediation',
                        description: item.remediation || '-'
                    },
                    {
                        title: 'Description',
                        description: item.description || '-'
                    },
                    {
                        title: (item.directory || '').includes(',') ? 'Paths' : 'Path',
                        description: item.directory
                    },
                    {
                        title: checks,
                        description: item.rulesText,
                    },
                    {
                        title: 'Compliance',
                        description: item.complianceText
                    }
                ];
                const itemsToShow = listItems.filter(x => {
                    return x.description;
                });
                itemIdToExpandedRowMap[item.id] = (react_1.default.createElement(eui_1.EuiDescriptionList, { listItems: itemsToShow }));
            }
            this.setState({ itemIdToExpandedRowMap });
        };
        this.showToast = (color, title, time) => {
            notify_1.toastNotifications.add({
                color: color,
                title: title,
                toastLifeTimeMs: time,
            });
        };
        const { agent } = this.props;
        this.state = { agent, itemIdToExpandedRowMap: {}, showMoreInfo: false, loading: false, filters: [] };
        this.policies = [];
        this.wzReq = wz_request_1.WzRequest;
        this.suggestions = {};
        this.timeService = time_service_1.default;
        this.columnsPolicies = [
            {
                field: 'name',
                name: 'Policy'
            },
            {
                field: 'description',
                name: 'Description',
                truncateText: true
            },
            {
                field: 'end_scan',
                name: 'End scan',
                dataType: 'date',
                render: value => this.offsetTimestamp('', value)
            },
            {
                field: 'pass',
                name: 'Pass',
                width: "100px"
            },
            {
                field: 'fail',
                name: 'Fail',
                width: "100px"
            },
            {
                field: 'invalid',
                name: 'Not applicable',
                width: "100px"
            },
            {
                field: 'score',
                name: 'Score',
                render: score => {
                    return `${score}%`;
                },
                width: "100px"
            },
        ];
        this.columnsChecks = [
            {
                field: 'id',
                name: 'ID',
                sortable: true,
                width: "100px"
            },
            {
                field: 'title',
                name: 'Title',
                sortable: true,
                truncateText: true
            },
            {
                name: 'Target',
                truncateText: true,
                render: item => (react_1.default.createElement("div", null, item.file ? (react_1.default.createElement("span", null,
                    react_1.default.createElement("b", null, "File:"),
                    " ",
                    item.file)) : item.directory ? (react_1.default.createElement("span", null,
                    react_1.default.createElement("b", null, "Directory:"),
                    " ",
                    item.directory)) : item.process ? (react_1.default.createElement("span", null,
                    react_1.default.createElement("b", null, "Process: "),
                    " ",
                    item.process)) : item.command ? (react_1.default.createElement("span", null,
                    react_1.default.createElement("b", null, "Command: "),
                    " ",
                    item.command)) : item.registry ? (react_1.default.createElement("span", null,
                    react_1.default.createElement("b", null, "Registry: "),
                    " ",
                    item.registry)) : ('-')))
            },
            {
                field: 'result',
                name: 'Result',
                truncateText: true,
                sortable: true,
                width: "150px",
                render: this.addHealthResultRender,
            },
            {
                align: 'right',
                width: "40px",
                isExpander: true,
                render: item => (react_1.default.createElement(eui_1.EuiButtonIcon, { onClick: () => this.toggleDetails(item), "aria-label": this.state.itemIdToExpandedRowMap[item.id] ? 'Collapse' : 'Expand', iconType: this.state.itemIdToExpandedRowMap[item.id]
                        ? 'arrowUp'
                        : 'arrowDown' }))
            }
        ];
    }
    async componentDidMount() {
        this._isMount = true;
        await this.initialize();
        const regex = new RegExp('redirectPolicy=' + '[^&]*');
        const match = window.location.href.match(regex);
        if (match && match[0]) {
            this.setState({ loading: true });
            const id = match[0].split('=')[1];
            const policy = await this.wzReq.apiReq('GET', `/sca/${this.props.agent.id}`, { "q": "policy_id=" + id });
            await this.loadScaPolicy(((((policy || {}).data || {}).data || {}).items || [])[0]);
            window.location.href = window.location.href.replace(new RegExp('redirectPolicy=' + '[^&]*'), '');
            this.setState({ loading: false });
        }
    }
    async componentDidUpdate(prevProps) {
        if (JSON.stringify(this.props.agent) !== JSON.stringify(prevProps.agent)) {
            await this.initialize();
        }
    }
    componentWillUnmount() {
        this._isMount = false;
    }
    offsetTimestamp(text, time) {
        try {
            return text + this.timeService.offset(time);
        }
        catch (error) {
            return time !== '-' ? `${text}${time} (UTC)` : time;
        }
    }
    addHealthResultRender(result) {
        const color = result => {
            if (result.toLowerCase() === 'passed') {
                return 'success';
            }
            else if (result.toLowerCase() === 'failed') {
                return 'danger';
            }
            else {
                return 'subdued';
            }
        };
        return (react_1.default.createElement(eui_1.EuiHealth, { color: color(result), style: { textTransform: 'capitalize' } }, result || 'Not applicable'));
    }
    buildSuggestionSearchBar(policy, checks) {
        if (this.suggestions[policy])
            return;
        const distinctFields = {};
        checks.forEach(item => {
            Object.keys(item).forEach(field => {
                if (typeof item[field] === 'string') {
                    if (!distinctFields[field]) {
                        distinctFields[field] = {};
                    }
                    if (!distinctFields[field][item[field]]) {
                        distinctFields[field][item[field]] = true;
                    }
                }
            });
        });
        // TODO: pending API
        // { type: 'params', label: 'command', description: 'Filter by check command', operators: ['=', '!=',], values: (value) => {return Object.keys(distinctFields["command"]).filter(item => item.toLowerCase().includes(value.toLowerCase())) } },
        // { type: 'params', label: 'title', description: 'Filter by check title', operators: ['=', '!=',], values: (value) => {return Object.keys(distinctFields["title"]).filter(item => item.toLowerCase().includes(value.toLowerCase())) } },
        // { type: 'params', label: 'result', description: 'Filter by check result', operators: ['=', '!=',], values: (value) => {return Object.keys(distinctFields["result"]).filter(item => item.toLowerCase().includes(value.toLowerCase())) } },
        // { type: 'params', label: 'status', description: 'Filter by check status', operators: ['=', '!=',], values: (value) => {return Object.keys(distinctFields["status"]).filter(item => item.toLowerCase().includes(value.toLowerCase())) } },
        // { type: 'params', label: 'rationale', description: 'Filter by check rationale', operators: ['=', '!=',], values: (value) => {return Object.keys(distinctFields["rationale"]).filter(item => item.toLowerCase().includes(value.toLowerCase())) } },
        // { type: 'params', label: 'registry', description: 'Filter by check registry', operators: ['=', '!=',], values: (value) => {return Object.keys(distinctFields["registry"]).filter(item => item.toLowerCase().includes(value.toLowerCase())) } },
        // { type: 'params', label: 'description', description: 'Filter by check description', operators: ['=', '!=',], values: (value) => {return Object.keys(distinctFields["description"]).filter(item => item.toLowerCase().includes(value.toLowerCase())) } },
        // { type: 'params', label: 'remediation', description: 'Filter by check remediation', operators: ['=', '!=',], values: (value) => {return Object.keys(distinctFields["remediation"]).filter(item => item.toLowerCase().includes(value.toLowerCase())) } },
        // { type: 'params', label: 'reason', description: 'Filter by check reason', operators: ['=', '!=',], values: (value) => {return Object.keys(distinctFields["reason"]).filter(item => item.toLowerCase().includes(value.toLowerCase())) } },
        this.suggestions[policy] = [
            { type: 'params', label: 'condition', description: 'Filter by check condition', operators: ['=', '!=',], values: (value) => { return Object.keys(distinctFields["condition"]).filter(item => item.toLowerCase().includes(value.toLowerCase())); } },
            { type: 'params', label: 'file', description: 'Filter by check file', operators: ['=', '!=',], values: (value) => { return Object.keys(distinctFields["file"]).filter(item => item.toLowerCase().includes(value.toLowerCase())); } },
            { type: 'params', label: 'references', description: 'Filter by check references', operators: ['=', '!=',], values: (value) => { return Object.keys(distinctFields["references"]).filter(item => item.toLowerCase().includes(value.toLowerCase())); } },
        ];
    }
    async initialize() {
        try {
            this._isMount && this.setState({ loading: true });
            this.lookingPolicy = false;
            const policies = await this.wzReq.apiReq('GET', `/sca/${this.props.agent.id}`, {});
            this.policies = (((policies || {}).data || {}).data || {}).items || [];
            const models = [];
            for (let i = 0; i < this.policies.length; i++) {
                models.push({
                    name: this.policies[i].name,
                    status: [
                        { id: 'pass', label: 'Pass', value: this.policies[i].pass },
                        { id: 'fail', label: 'Fail', value: this.policies[i].fail },
                        {
                            id: 'invalid',
                            label: 'Not applicable',
                            value: this.policies[i].invalid
                        }
                    ]
                });
            }
            this._isMount && this.setState({ data: models, loading: false });
        }
        catch (error) {
            this.policies = [];
        }
    }
    async loadScaPolicy(policy) {
        const filtersObject = wz_search_bar_1.filtersToObject(this.state.filters);
        this._isMount && this.setState({ loadingPolicy: true, itemIdToExpandedRowMap: {}, pageIndex: 0 });
        if (policy) {
            const checks = await this.wzReq.apiReq('GET', `/sca/${this.props.agent.id}/checks/${policy.policy_id}`, { ...filtersObject });
            this.checks = (((checks || {}).data || {}).data || {}).items || [];
            this.buildSuggestionSearchBar(policy.policy_id, this.checks);
        }
        this._isMount && this.setState({ lookingPolicy: policy, loadingPolicy: false });
    }
    async downloadCsv() {
        try {
            this.showToast('success', 'Your download should begin automatically...', 3000);
            await wz_csv_1.default('/sca/' + this.props.agent.id + '/checks/' + this.state.lookingPolicy.policy_id, [], this.state.lookingPolicy.policy_id + '.csv');
        }
        catch (error) {
            this.showToast('danger', error, 3000);
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.lookingPolicy && JSON.stringify(prevState.filters) !== JSON.stringify(this.state.filters)) {
            this.loadScaPolicy(this.state.lookingPolicy);
        }
    }
    render() {
        const getPoliciesRowProps = (item, idx) => {
            return {
                'data-test-subj': `sca-row-${idx}`,
                className: 'customRowClass',
                onClick: () => this.loadScaPolicy(item)
            };
        };
        const getChecksRowProps = (item, idx) => {
            return {
                'data-test-subj': `sca-check-row-${idx}`,
                className: 'customRowClass',
                onClick: () => this.toggleDetails(item)
            };
        };
        const pagination = {
            pageIndex: this.state.pageIndex,
            pageSize: 10,
            totalItemCount: (this.checks || []).length,
            pageSizeOptions: [10, 25, 50, 100]
        };
        const search = {
            box: {
                incremental: this.state.incremental,
                schema: true
            }
        };
        const sorting = {
            sort: {
                field: 'id',
                direction: 'asc'
            }
        };
        const buttonPopover = (react_1.default.createElement(eui_1.EuiButtonEmpty, { iconType: "iInCircle", "aria-label": "Help", onClick: () => this.setState({ showMoreInfo: !this.state.showMoreInfo }) }));
        return (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement("div", null, (this.state.loading &&
                react_1.default.createElement("div", { style: { margin: 16 } },
                    react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
                    react_1.default.createElement(eui_1.EuiProgress, { size: "xs", color: "primary" })))),
            react_1.default.createElement(eui_1.EuiPage, null,
                ((this.props.agent && (this.props.agent || {}).status !== 'Never connected' && !(this.policies || []).length && !this.state.loading) &&
                    react_1.default.createElement(eui_1.EuiCallOut, { title: "No scans available", iconType: "iInCircle" },
                        react_1.default.createElement(eui_1.EuiButton, { color: "primary", onClick: () => this.initialize() }, "Refresh"))),
                ((this.props.agent && (this.props.agent || {}).status === 'Never connected' && !this.state.loading) &&
                    react_1.default.createElement(eui_1.EuiCallOut, { title: "Agent has never connected", style: { width: "100%" }, iconType: "iInCircle" },
                        react_1.default.createElement(eui_1.EuiButton, { color: "primary", onClick: () => this.initialize() }, "Refresh"))),
                ((this.props.agent && (this.props.agent || {}).os && !this.state.lookingPolicy && (this.policies || []).length > 0 && !this.state.loading) &&
                    react_1.default.createElement("div", null,
                        ((this.state.data || []).length &&
                            react_1.default.createElement(eui_1.EuiFlexGroup, { style: { 'marginTop': 0 } }, (this.state.data || []).map((pie, idx) => (react_1.default.createElement(eui_1.EuiFlexItem, { key: idx, grow: false },
                                react_1.default.createElement(eui_1.EuiPanel, { betaBadgeLabel: pie.name, style: { paddingBottom: 0 } },
                                    react_1.default.createElement(pie_1.Pie, { width: 325, height: 130, data: pie.status, colors: ['#00a69b', '#ff645c', '#5c6773'] }))))))),
                        react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
                        react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "l" },
                            react_1.default.createElement(eui_1.EuiFlexGroup, null,
                                react_1.default.createElement(eui_1.EuiFlexItem, null,
                                    react_1.default.createElement(eui_1.EuiBasicTable, { items: this.policies, columns: this.columnsPolicies, rowProps: getPoliciesRowProps })))))),
                ((this.props.agent && (this.props.agent || {}).os && this.state.lookingPolicy && !this.state.loading) &&
                    react_1.default.createElement("div", null,
                        react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "l" },
                            react_1.default.createElement(eui_1.EuiFlexGroup, null,
                                react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                                    react_1.default.createElement(eui_1.EuiButtonIcon, Object.assign({ color: 'primary', style: { padding: '6px 0px' }, onClick: () => this.loadScaPolicy(false), iconType: "arrowLeft", "aria-label": "Back to policies" }, { iconSize: 'l' }))),
                                react_1.default.createElement(eui_1.EuiFlexItem, null,
                                    react_1.default.createElement(eui_1.EuiTitle, { size: "s" },
                                        react_1.default.createElement("h2", null,
                                            this.state.lookingPolicy.name,
                                            "\u00A0",
                                            react_1.default.createElement(eui_1.EuiToolTip, { position: "right", content: "Show policy checksum" },
                                                react_1.default.createElement(eui_1.EuiPopover, { button: buttonPopover, isOpen: this.state.showMoreInfo, closePopover: () => this.setState({ showMoreInfo: false }) },
                                                    react_1.default.createElement(eui_1.EuiFlexItem, { style: { width: 700 } },
                                                        react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
                                                        react_1.default.createElement(eui_1.EuiText, null,
                                                            react_1.default.createElement("b", null, "Policy description:"),
                                                            " ",
                                                            this.state.lookingPolicy.description,
                                                            react_1.default.createElement("br", null),
                                                            react_1.default.createElement("b", null, "Policy checksum:"),
                                                            " ",
                                                            this.state.lookingPolicy.hash_file))))))),
                                react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                                    react_1.default.createElement(eui_1.EuiButtonEmpty, { iconType: "importAction", onClick: async () => await this.downloadCsv() }, "Export formatted")),
                                react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                                    react_1.default.createElement(eui_1.EuiButtonEmpty, { iconType: "refresh", onClick: () => this.loadScaPolicy(this.state.lookingPolicy) }, "Refresh"))),
                            react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
                            react_1.default.createElement(eui_1.EuiFlexGroup, null,
                                react_1.default.createElement(eui_1.EuiFlexItem, null,
                                    react_1.default.createElement(eui_1.EuiStat, { title: this.state.lookingPolicy.pass, description: "Pass", titleColor: "secondary", titleSize: "m", textAlign: "center" })),
                                react_1.default.createElement(eui_1.EuiFlexItem, null,
                                    react_1.default.createElement(eui_1.EuiStat, { title: this.state.lookingPolicy.fail, description: "Fail", titleColor: "danger", titleSize: "m", textAlign: "center" })),
                                react_1.default.createElement(eui_1.EuiFlexItem, null,
                                    react_1.default.createElement(eui_1.EuiStat, { title: this.state.lookingPolicy.invalid, description: "Not applicable", titleColor: "subdued", titleSize: "m", textAlign: "center" })),
                                react_1.default.createElement(eui_1.EuiFlexItem, null,
                                    react_1.default.createElement(eui_1.EuiStat, { title: `${this.state.lookingPolicy.score}%`, description: "Score", titleColor: "accent", titleSize: "m", textAlign: "center" })),
                                react_1.default.createElement(eui_1.EuiFlexItem, null,
                                    react_1.default.createElement(eui_1.EuiStat, { title: this.state.lookingPolicy.end_scan, description: "End scan", titleColor: "primary", titleSize: "s", textAlign: "center", style: { padding: 5 } }))),
                            react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
                            react_1.default.createElement(eui_1.EuiFlexGroup, null,
                                react_1.default.createElement(eui_1.EuiFlexItem, null,
                                    react_1.default.createElement(wz_search_bar_1.WzSearchBar, { filters: this.state.filters, suggestions: this.suggestions[this.state.lookingPolicy.policy_id], placeholder: 'Add filter or search', onFiltersChange: filters => this.setState({ filters }) }))),
                            react_1.default.createElement(eui_1.EuiFlexGroup, null,
                                react_1.default.createElement(eui_1.EuiFlexItem, null,
                                    react_1.default.createElement(eui_1.EuiInMemoryTable, { items: this.checks, columns: this.columnsChecks, rowProps: getChecksRowProps, itemId: "id", itemIdToExpandedRowMap: this.state.itemIdToExpandedRowMap, isExpandable: true, sorting: sorting, pagination: pagination, loading: this.state.loadingPolicy })))))))));
    }
}
exports.Inventory = Inventory;
