"use strict";
/*
 * Wazuh app - React component for show search and filter
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
exports.ContextMenu = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
const operators = {
    '=': ' is ',
    '!=': ' is not ',
    '<': ' less than ',
    '>': ' greater than ',
    '~': ' like '
};
function ContextMenu(props) {
    const [isOpen, setIsOpen] = react_1.useState(false);
    const panels = flattenPanelTree(panelTree({ ...props, setIsOpen }));
    const { conjuntion = false, field, value, operator } = props.qFilter;
    const button = (react_1.default.createElement(eui_1.EuiButtonEmpty, { color: 'text', size: "xs", onClick: () => setIsOpen(!isOpen) },
        react_1.default.createElement("strong", null, conjuntion && conjuntion),
        " ",
        field,
        " ",
        operators[operator],
        " ",
        value));
    return (react_1.default.createElement(eui_1.EuiPopover, { button: button, isOpen: isOpen, closePopover: () => setIsOpen(false), panelPaddingSize: "none", anchorPosition: "downLeft" },
        react_1.default.createElement(eui_1.EuiContextMenu, { initialPanelId: 0, panels: panels })));
}
exports.ContextMenu = ContextMenu;
function flattenPanelTree(tree, array = []) {
    // @ts-ignore
    array.push(tree);
    const treeEach = item => {
        if (item.panel) {
            flattenPanelTree(item.panel, array);
            item.panel = item.panel.id;
        }
    };
    if (!tree.items) {
        return array;
    }
    tree.items.forEach(treeEach);
    return array;
}
const panelTree = (props) => {
    const { operator, conjuntion } = props.qFilter;
    const { invertOperator, changeConjuntion } = props;
    const panels = {
        id: 0,
        items: [
            {
                name: 'Edit filter',
                icon: 'pencil',
                panel: {
                    id: 1,
                    title: 'Edit filter',
                    width: 400,
                    content: react_1.default.createElement(EditFilter, Object.assign({}, props))
                }
            },
            {
                name: 'Delete filter',
                icon: 'trash',
                onClick: props.deleteFilter
            },
        ]
    };
    operator !== '~' && panels.items.unshift(operatorItem(props));
    !!conjuntion && panels.items.unshift(conjuntionItem(props));
    return panels;
};
const operatorItem = (props) => {
    const { invertOperator, setIsOpen } = props;
    return {
        name: 'Invert operator',
        icon: 'kqlOperand',
        onClick: (...args) => { invertOperator(...args); setIsOpen(false); }
    };
};
const conjuntionItem = (props) => {
    const { changeConjuntion, setIsOpen } = props;
    return {
        name: 'Change conjuntion',
        icon: 'kqlSelector',
        onClick: (...args) => { changeConjuntion(...args); setIsOpen(false); }
    };
};
function EditFilter(props) {
    const { index, qSuggest } = props;
    const query = props.qInterpreter.getQuery(index);
    const [conjuntion, setConjuntion] = react_1.useState(query.conjuntion);
    const [operator, setOperator] = react_1.useState(query.operator);
    const [value, setValue] = react_1.useState(query.value);
    return react_1.default.createElement(eui_1.EuiForm, { className: "globalFilterItem__editorForm" },
        conjuntion &&
            EditFilterConjuntion(conjuntion, setConjuntion),
        EditFilterOperator(operator, setOperator),
        EditFilterValue(value, setValue, qSuggest),
        EditFilterSaveButton(query, operator, value, conjuntion, props));
}
function EditFilterSaveButton(query, operator, value, conjuntion, props) {
    return (react_1.default.createElement(react_1.Fragment, null,
        react_1.default.createElement(eui_1.EuiSpacer, null),
        react_1.default.createElement(eui_1.EuiFlexGroup, { direction: 'rowReverse' },
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiButton, { fill: true, onClick: () => {
                        const newFilter = { field: query.field, operator, value };
                        conjuntion && (newFilter['conjuntion'] = conjuntion);
                        props.qInterpreter.editByIndex(props.index, newFilter);
                        props.updateFilters(newFilter);
                        props.setIsOpen(false);
                    } }, "Save")),
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiButton, { onClick: () => {
                        props.setIsOpen(false);
                    } }, "Cancel")))));
}
function EditFilterValue(value, setValue, suggest) {
    const [isPopoverOpen, setIsPopoverOpen] = react_1.useState(false);
    const [suggetsValues, setSuggetsValues] = react_1.useState([]);
    react_1.useEffect(() => {
        updateSuggestsValues(suggest, value, setSuggetsValues);
    }, [value]);
    return react_1.default.createElement(eui_1.EuiFormRow, { label: "Value" },
        react_1.default.createElement(eui_1.EuiInputPopover, { input: react_1.default.createElement(eui_1.EuiFieldText, { value: value, onFocus: () => setIsPopoverOpen(true), onChange: (e) => setValue(e.target.value) }), isOpen: isPopoverOpen, closePopover: () => setIsPopoverOpen(false) }, suggetsValues.map((item, key) => (react_1.default.createElement(eui_1.EuiSuggestItem, { key: key, label: item, type: { iconType: 'kqlValue', color: 'tint0' }, onClick: () => { setValue(item); setIsPopoverOpen(false); } })))));
}
async function updateSuggestsValues(suggest, value, setSuggetsValues) {
    (suggest.values && {}.toString.call(suggest.values) === '[object Function]')
        ? setSuggetsValues(await suggest.values(value))
        : setSuggetsValues(suggest.values || []);
}
function EditFilterOperator(operator, setOperator) {
    return react_1.default.createElement(eui_1.EuiFormRow, { label: "Operator" },
        react_1.default.createElement(eui_1.EuiSuperSelect, { options: [
                { value: '=', inputDisplay: 'is' },
                { value: '!=', inputDisplay: 'is not' },
                { value: '<', inputDisplay: 'less than' },
                { value: '>', inputDisplay: 'greater than' },
                { value: '~', inputDisplay: 'like' },
            ], valueOfSelected: operator, onChange: setOperator }));
}
function EditFilterConjuntion(conjuntion, setConjuntion) {
    return react_1.default.createElement(eui_1.EuiFormRow, { label: "Conjuntion" },
        react_1.default.createElement(eui_1.EuiButtonGroup, { options: [
                { id: `conjuntion-AND`, label: "AND" },
                { id: `conjuntion-OR`, label: "OR" },
            ], idSelected: `conjuntion-${conjuntion.trim()}`, onChange: () => setConjuntion(/and/gi.test(conjuntion) ? ' OR ' : ' AND ') }));
}
