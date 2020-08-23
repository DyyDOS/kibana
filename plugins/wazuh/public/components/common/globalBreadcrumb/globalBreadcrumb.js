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
const react_1 = __importStar(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const eui_1 = require("@elastic/eui");
const react_redux_1 = require("react-redux");
require("./globalBreadcrumb.less");
const chrome_1 = __importDefault(require("ui/chrome"));
const app_navigate_1 = require("../../../react-services/app-navigate");
class WzGlobalBreadcrumb extends react_1.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }
    async componentDidMount() {
        const $injector = await chrome_1.default.dangerouslyGetActiveInjector();
        this.router = $injector.get('$route');
        $('#breadcrumbNoTitle').attr("title", "");
    }
    componnedDidUpdate() {
        $('#breadcrumbNoTitle').attr("title", "");
    }
    render() {
        const container = document.getElementsByClassName('euiBreadcrumbs');
        return (react_1.default.createElement("div", null, !!this.props.state.breadcrumb.length && (react_dom_1.default.createPortal(react_1.default.createElement(eui_1.EuiBreadcrumbs, { className: 'wz-global-breadcrumb', responsive: false, truncate: false, max: 6, showMaxPopover: true, breadcrumbs: this.props.state.breadcrumb.map(breadcrumb => breadcrumb.agent ? {
                text: (react_1.default.createElement("a", { style: { marginRight: 0, height: 16 }, className: "euiLink euiLink--subdued euiBreadcrumb ", onClick: (ev) => { ev.stopPropagation(); app_navigate_1.AppNavigate.navigateToModule(ev, 'agents', { "tab": "welcome", "agent": breadcrumb.agent.id }); this.router.reload(); }, id: "breadcrumbNoTitle" },
                    react_1.default.createElement(eui_1.EuiToolTip, { position: "top", content: "View agent summary" },
                        react_1.default.createElement("span", null, breadcrumb.agent.name))))
            } : breadcrumb), "aria-label": "Wazuh global breadcrumbs" }), container[0]))));
    }
}
const mapStateToProps = state => {
    return {
        state: state.globalBreadcrumbReducers,
    };
};
exports.default = react_redux_1.connect(mapStateToProps, null)(WzGlobalBreadcrumb);
