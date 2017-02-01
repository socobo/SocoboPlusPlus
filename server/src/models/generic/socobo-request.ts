import express = require('express');

export interface Request extends express.Request {
    requestData: any;
}