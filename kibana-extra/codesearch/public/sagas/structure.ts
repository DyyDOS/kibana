/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import { call, put, takeEvery } from 'redux-saga/effects';

import { Action } from 'redux-actions';
import { LspRestClient, TextDocumentMethods } from '../../common/lsp_client';
import { loadStructure, loadStructureFailed, loadStructureSuccess } from '../actions';

function requestStructure(uri?: string) {
  const lspClient = new LspRestClient('../api/lsp');
  const lspMethods = new TextDocumentMethods(lspClient);
  return lspMethods.documentSymbol.send({
    textDocument: {
      uri: uri || '',
    },
  });
}

function* handleLoadStructure(action: Action<string>) {
  try {
    const data = yield call(requestStructure, `git:/${action.payload}`);
    yield put(loadStructureSuccess({ path: action.payload, data }));
  } catch (err) {
    yield put(loadStructureFailed(err));
  }
}

export function* watchLoadStructure() {
  yield takeEvery(String(loadStructure), handleLoadStructure);
}
