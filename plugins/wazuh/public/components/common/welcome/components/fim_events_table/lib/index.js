"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
var get_fim_alerts_1 = require("./get_fim_alerts");
Object.defineProperty(exports, "getFimAlerts", { enumerable: true, get: function () { return get_fim_alerts_1.getFimAlerts; } });
Object.defineProperty(exports, "getWazuhFilter", { enumerable: true, get: function () { return get_fim_alerts_1.getWazuhFilter; } });
