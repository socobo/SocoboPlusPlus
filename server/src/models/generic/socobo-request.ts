import express = require('express');

export interface SocoboRequest extends express.Request {
    requestData: any;
}