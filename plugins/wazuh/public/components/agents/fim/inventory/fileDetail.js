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
exports.FileDetails = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
const discover_1 = require("../../../common/modules/discover");
// @ts-ignore
const kibana_services_1 = require("plugins/kibana/discover/kibana_services");
const modules_helper_1 = require("../../../common/modules/modules-helper");
const common_1 = require("../../../../../../../src/plugins/data/common");
const lib_1 = require("../../../overview/mitre/lib");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const app_navigate_1 = require("../../../../react-services/app-navigate");
class FileDetails extends react_1.Component {
    constructor(props) {
        super(props);
        this.userSvg = react_1.default.createElement("svg", { width: "16", height: "16", viewBox: "0 0 16 16", xmlns: "http://www.w3.org/2000/svg", className: "euiIcon euiIcon--large euiIcon euiIcon--primary euiIcon-isLoaded detail-icon", focusable: "false", role: "img", "aria-hidden": "true" },
            react_1.default.createElement("path", { "fill-rule": "evenodd", d: "M5.482 4.344a2 2 0 10-2.963 0c-.08.042-.156.087-.23.136-.457.305-.75.704-.933 1.073A3.457 3.457 0 001 6.978V9a1 1 0 001 1h2.5a3.69 3.69 0 01.684-.962L5.171 9H2V7s0-2 2-2c1.007 0 1.507.507 1.755 1.01.225-.254.493-.47.793-.636a2.717 2.717 0 00-1.066-1.03zM4 4a1 1 0 100-2 1 1 0 000 2zm10 6h-2.5a3.684 3.684 0 00-.684-.962L10.829 9H14V7s0-2-2-2c-1.007 0-1.507.507-1.755 1.01a3.012 3.012 0 00-.793-.636 2.716 2.716 0 011.066-1.03 2 2 0 112.963 0c.08.042.156.087.23.136.457.305.75.704.933 1.073A3.453 3.453 0 0115 6.944V9a1 1 0 01-1 1zm-2-6a1 1 0 100-2 1 1 0 000 2z" }),
            react_1.default.createElement("path", { "fill-rule": "evenodd", d: "M10 8c0 .517-.196.989-.518 1.344a2.755 2.755 0 011.163 1.21A3.453 3.453 0 0111 11.977V14a1 1 0 01-1 1H6a1 1 0 01-1-1v-2.022a2.005 2.005 0 01.006-.135 3.456 3.456 0 01.35-1.29 2.755 2.755 0 011.162-1.21A2 2 0 1110 8zm-4 4v2h4v-2s0-2-2-2-2 2-2 2zm3-4a1 1 0 11-2 0 1 1 0 012 0z" }));
        this.viewInEvents = (ev) => {
            const { file } = this.props.currentFile;
            if (this.props.view === 'extern') {
                app_navigate_1.AppNavigate.navigateToModule(ev, 'overview', { "tab": "fim", "tabView": "events", filters: { "syscheck.path": file } });
            }
            else {
                app_navigate_1.AppNavigate.navigateToModule(ev, 'overview', { "tab": "fim", "tabView": "events", filters: { "syscheck.path": file } }, () => this.openEventCurrentWindow());
            }
        };
        this.updateTotalHits = (total) => {
            this.setState({ totalHits: total });
        };
        this.state = {
            hoverAddFilter: '',
            totalHits: 0
        };
        this.viewInEvents.bind(this);
    }
    componentDidMount() {
        lib_1.getIndexPattern().then(idxPtn => this.indexPattern = idxPtn);
    }
    details() {
        return [
            {
                field: 'date',
                name: 'Last analysis',
                grow: 2,
                icon: 'clock',
                link: true,
            },
            {
                field: 'mtime',
                name: 'Last modified',
                grow: 2,
                icon: 'clock',
                link: true,
            },
            {
                field: 'uname',
                name: 'User',
                icon: 'user',
                link: true,
            },
            {
                field: 'uid',
                name: 'User ID',
                icon: 'user',
                link: true,
            },
            {
                field: 'gname',
                name: 'Group',
                icon: 'usersRolesApp',
                onlyLinux: true,
                link: true,
            },
            {
                field: 'gid',
                name: 'Group ID',
                onlyLinux: true,
                icon: 'usersRolesApp',
                link: true,
            },
            {
                field: 'perm',
                name: 'Permissions',
                icon: 'lock',
                link: false,
            },
            {
                field: 'size',
                name: 'Size',
                icon: 'nested',
                link: true,
            },
            {
                field: 'inode',
                name: 'Inode',
                icon: 'link',
                onlyLinux: true,
                link: true,
            },
            {
                field: 'md5',
                name: 'MD5',
                checksum: true,
                icon: 'check',
                link: true,
            },
            {
                field: 'sha1',
                name: 'SHA1',
                checksum: true,
                icon: 'check',
                link: true,
            },
            {
                field: 'sha256',
                name: 'SHA256',
                checksum: true,
                icon: 'check',
                link: true,
            }
        ];
    }
    registryDetails() {
        return [
            {
                field: 'date',
                name: 'Last analysis',
                grow: 2,
                icon: 'clock'
            },
            {
                field: 'mtime',
                name: 'Last modified',
                grow: 2,
                icon: 'clock'
            },
            {
                field: 'sha1',
                name: 'SHA1',
                checksum: true,
                icon: 'check'
            }
        ];
    }
    openEventCurrentWindow() {
        const { file } = this.props.currentFile;
        const filters = [{
                ...common_1.buildPhraseFilter({ name: 'syscheck.path', type: 'text' }, file, this.indexPattern),
                "$state": { "store": "appState" }
            }];
        this.props.onSelectedTabChanged('events');
        this.checkFilterManager(filters);
    }
    async checkFilterManager(filters) {
        const { filterManager } = kibana_services_1.getServices();
        if (filterManager.filters && filterManager.filters.length) {
            const syscheckPathFilters = filterManager.filters.filter(x => {
                return x.meta.key === 'syscheck.path';
            });
            syscheckPathFilters.map(x => {
                filterManager.removeFilter(x);
            });
            filterManager.addFilters([filters]);
            const scope = await modules_helper_1.ModulesHelper.getDiscoverScope();
            scope.updateQueryAndFetch({ query: null });
        }
        else {
            setTimeout(() => {
                this.checkFilterManager(filters);
            }, 200);
        }
    }
    formatBytes(a, b = 2) { if (0 === a)
        return "0 Bytes"; const c = 0 > b ? 0 : b, d = Math.floor(Math.log(a) / Math.log(1024)); return parseFloat((a / Math.pow(1024, d)).toFixed(c)) + " " + ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d]; }
    addFilter(field, value) {
        const { filters, onFiltersChange } = this.props;
        const newBadge = { field: 'q', value: '' };
        if (field === 'date' || field === 'mtime') {
            let value_max = moment_timezone_1.default(value).add(1, 'day');
            newBadge.value = `${field}>${moment_timezone_1.default(value).format('YYYY-MM-DD')} AND ${field}<${value_max.format('YYYY-MM-DD')}`;
        }
        else {
            newBadge.value = `${field}=${field === 'size' ? this.props.currentFile[field] : value}`;
        }
        !filters.some(item => (item.field === newBadge.field && item.value === newBadge.value))
            && onFiltersChange([...filters, newBadge]);
        this.props.closeFlyout();
    }
    getDetails() {
        const { view } = this.props;
        const columns = this.props.type === 'file' ? this.details() : this.registryDetails();
        const generalDetails = columns.map((item, idx) => {
            var value = this.props.currentFile[item.field] || '-';
            if (item.field === 'size') {
                value = !isNaN(value) ? this.formatBytes(value) : 0;
            }
            var link = (item.link && !['events', 'extern'].includes(view)) || false;
            const agentPlatform = ((this.props.agent || {}).os || {}).platform;
            if (!item.onlyLinux || (item.onlyLinux && this.props.agent && agentPlatform !== 'windows')) {
                let className = item.checksum ? "detail-value detail-value-checksum" : "detail-value";
                className += item.field === 'perm' ? " detail-value-perm" : "";
                return (react_1.default.createElement(eui_1.EuiFlexItem, { key: idx },
                    react_1.default.createElement(eui_1.EuiStat, { title: !link
                            ? react_1.default.createElement("span", { className: className }, value)
                            : (react_1.default.createElement("span", { className: className, onMouseEnter: () => {
                                    this.setState({ hoverAddFilter: item });
                                }, onMouseLeave: () => {
                                    this.setState({ hoverAddFilter: '' });
                                } },
                                value,
                                _.isEqual(this.state.hoverAddFilter, item) &&
                                    react_1.default.createElement(eui_1.EuiToolTip, { position: "top", anchorClassName: "detail-tooltip", content: `Filter by ${item.field} is ${value} in inventory` },
                                        react_1.default.createElement(eui_1.EuiButtonIcon, { onClick: () => {
                                                this.addFilter(item.field, value);
                                            }, iconType: "magnifyWithPlus", "aria-label": "Next", iconSize: "s", className: "buttonAddFilter" })))), description: react_1.default.createElement("span", null,
                            item.icon !== 'users'
                                ? react_1.default.createElement(eui_1.EuiIcon, { size: "l", type: item.icon, color: 'primary', className: "detail-icon" })
                                : this.userSvg,
                            react_1.default.createElement("span", { className: "detail-title" }, item.name)), textAlign: "left", titleSize: "xs" })));
            }
        });
        return (react_1.default.createElement("div", null,
            react_1.default.createElement(eui_1.EuiFlexGrid, { columns: 3 },
                " ",
                generalDetails,
                " ")));
    }
    render() {
        const { fileName, type, implicitFilters, view } = this.props;
        const inspectButtonText = view === 'extern'
            ? 'Inspect in FIM'
            : 'Inspect in Events';
        return (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(eui_1.EuiAccordion, { id: fileName === undefined ? Math.random().toString() : fileName, buttonContent: react_1.default.createElement(eui_1.EuiTitle, { size: "s" },
                    react_1.default.createElement("h3", null, "Details")), paddingSize: "none", initialIsOpen: true },
                react_1.default.createElement("div", { className: 'flyout-row details-row' }, this.getDetails())),
            react_1.default.createElement(eui_1.EuiSpacer, { size: 's' }),
            react_1.default.createElement(eui_1.EuiAccordion, { id: fileName === undefined ? Math.random().toString() : fileName, className: 'events-accordion', extraAction: react_1.default.createElement("div", { style: { marginBottom: 5 } },
                    react_1.default.createElement("strong", null, this.state.totalHits || 0),
                    " hits"), buttonContent: react_1.default.createElement(eui_1.EuiTitle, { size: "s" },
                    react_1.default.createElement("h3", null,
                        "Recent events",
                        view !== 'events' && (react_1.default.createElement("span", { style: { marginLeft: 16 } },
                            react_1.default.createElement(eui_1.EuiToolTip, { position: "top", content: inspectButtonText },
                                react_1.default.createElement(eui_1.EuiIcon, { className: 'euiButtonIcon euiButtonIcon--primary', onMouseDown: (ev) => this.viewInEvents(ev), type: "popout", "aria-label": inspectButtonText })))))), paddingSize: "none", initialIsOpen: true },
                react_1.default.createElement(eui_1.EuiFlexGroup, { className: "flyout-row" },
                    react_1.default.createElement(eui_1.EuiFlexItem, null,
                        react_1.default.createElement(discover_1.Discover, { initialColumns: ["icon", "timestamp", 'syscheck.event', 'rule.description', 'rule.level', 'rule.id'], includeFilters: "syscheck", implicitFilters: implicitFilters, initialFilters: [], type: type, updateTotalHits: (total) => this.updateTotalHits(total) }))))));
    }
}
exports.FileDetails = FileDetails;
