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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainSca = void 0;
const react_1 = __importStar(require("react"));
const index_1 = require("./index");
const appStateActions_1 = require("../../../redux/actions/appStateActions");
const eui_1 = require("@elastic/eui");
const react_redux_1 = require("react-redux");
const mapStateToProps = state => ({
    currentAgentData: state.appStateReducers.currentAgentData
});
const mapDispatchToProps = dispatch => ({
    showExploreAgentModal: show => dispatch(appStateActions_1.showExploreAgentModal(show))
});
exports.MainSca = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(class MainSca extends react_1.Component {
    constructor(props) {
        super(props);
        this.tabs = [
            { id: 'inventory', name: 'Inventory' },
            { id: 'events', name: 'Events' },
        ];
        this.buttons = ['settings'];
    }
    showExploreAgentModal() {
        this.props.showExploreAgentModal(true);
    }
    render() {
        const { selectView } = this.props;
        const existsCurrentAgent = this.props.currentAgentData && this.props.currentAgentData.id;
        if (selectView) {
            return (react_1.default.createElement("div", null,
                selectView === 'inventory' && existsCurrentAgent && react_1.default.createElement(index_1.Inventory, Object.assign({}, this.props, { agent: this.props.currentAgentData })),
                selectView === 'inventory' && (!existsCurrentAgent && !this.props.agent &&
                    (react_1.default.createElement(eui_1.EuiEmptyPrompt, { iconType: "watchesApp", title: react_1.default.createElement("h2", null, "No agent is selected"), body: react_1.default.createElement(react_1.Fragment, null,
                            react_1.default.createElement("p", null, "You need to select an agent to see Security Configuration Assessment inventory.")), actions: react_1.default.createElement(eui_1.EuiButton, { color: "primary", fill: true, onClick: () => this.showExploreAgentModal() }, "Select agent") })))));
        }
        else {
            return false;
        }
    }
});
