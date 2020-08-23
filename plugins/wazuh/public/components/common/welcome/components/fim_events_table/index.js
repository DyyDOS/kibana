"use strict";
/*
 * Wazuh app - React component building the welcome screen of an agent.
 * version, OS, registration date, last keep alive.
 *
 * Copyright (C) 2015-2020 Wazuh, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var fim_events_table_1 = require("./fim_events_table");
Object.defineProperty(exports, "FimEventsTable", { enumerable: true, get: function () { return fim_events_table_1.FimEventsTable; } });
Object.defineProperty(exports, "useTimeFilter", { enumerable: true, get: function () { return fim_events_table_1.useTimeFilter; } });
var lib_1 = require("./lib");
Object.defineProperty(exports, "getWazuhFilter", { enumerable: true, get: function () { return lib_1.getWazuhFilter; } });
