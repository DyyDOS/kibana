"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withWindowSize = void 0;
const react_1 = __importDefault(require("react"));
const useWindowSize_1 = require("../hooks/useWindowSize");
exports.withWindowSize = (WrappedComponent) => (props) => {
    const windowSize = useWindowSize_1.useWindowSize();
    return react_1.default.createElement(WrappedComponent, Object.assign({}, props, { windowSize: windowSize }));
};
