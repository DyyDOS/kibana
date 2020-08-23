"use strict";
/*
 * Wazuh app - Mitre alerts components
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
var elastic_helpers_1 = require("./elastic-helpers");
Object.defineProperty(exports, "getElasticAlerts", { enumerable: true, get: function () { return elastic_helpers_1.getElasticAlerts; } });
Object.defineProperty(exports, "getIndexPattern", { enumerable: true, get: function () { return elastic_helpers_1.getIndexPattern; } });
var mitre_techniques_1 = require("./mitre_techniques");
Object.defineProperty(exports, "mitreTechniques", { enumerable: true, get: function () { return mitre_techniques_1.mitreTechniques; } });
