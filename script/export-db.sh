#!/bin/sh
DATE=$(date +%d-%m-%Y_%H:%M)
mongoexport --db matcha --collection users --out ../json/matcha-${DATE}-users.json;
mongoexport --db matcha --collection users --out ../json/matcha-current-users.json;
mongoexport --db matcha --collection citydb --out ../json/matcha-citydb.json;
