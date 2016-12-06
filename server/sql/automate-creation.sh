#!/bin/bash

psql -f create-db.sql
psql -f create-tables.sql
psql -f fill-tables.sql