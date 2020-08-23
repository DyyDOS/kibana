"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WzRulesetTotalItems = void 0;
const react_1 = __importDefault(require("react"));
const loading_1 = __importDefault(require("../configuration/util-hocs/loading"));
const wz_request_1 = require("../../../../../react-services/wz-request");
const eui_1 = require("@elastic/eui");
const sectionToAPIRequest = {
    rules: '/rules',
    decoders: '/decoders',
    lists: '/lists/files'
};
exports.WzRulesetTotalItems = loading_1.default(async (props) => {
    if (props.totalItems)
        return { totalItems: props.totalItems };
    try {
        const apiRequest = sectionToAPIRequest[props.section];
        if (apiRequest) {
            const data = await wz_request_1.WzRequest.apiReq('GET', apiRequest, {});
            const totalItems = (((data || {}).data || {}).data || {}).totalItems || undefined;
            return { totalItems };
        }
    }
    catch (error) {
        return { totalItems: undefined, error };
    }
}, (props, prevProps) => (props.section !== prevProps.section || prevProps.totalItems < props.totalItems), /* Reload if section changed */ () => react_1.default.createElement(eui_1.EuiLoadingSpinner, null) /* Loading component */)((props) => props.totalItems ? react_1.default.createElement("span", null,
    "(",
    props.totalItems,
    ")") : null /* React component after run the Load function. Render (totalItems) */);
