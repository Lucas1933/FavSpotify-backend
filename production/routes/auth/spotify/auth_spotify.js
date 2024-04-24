"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const http_status_code_1 = require("../../../utils/http_status_code");
const SpotifyProvider_1 = __importDefault(require("./SpotifyProvider"));
const authSpotifyRouter = (0, express_1.Router)();
const spotifyProvider = new SpotifyProvider_1.default();
authSpotifyRouter.get("/spotify", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authUrl = yield spotifyProvider.getAuthorizationUrl();
    req.session.spotifyStateCode = spotifyProvider.getState();
    res.redirect(authUrl);
}));
authSpotifyRouter.get("/callback/spotify", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code, state, error } = req.query;
    if (error) {
        if (state != req.session.spotifyStateCode) {
            console.log("state ", state);
            console.log("req.session.state ", req.session.spotifyStateCode);
        }
        console.log("something went wrong", error);
        res.sendStatus(http_status_code_1.UNAUTHORIZED).send({ code: http_status_code_1.UNAUTHORIZED, error });
    }
    else {
        const token = yield spotifyProvider.getAuthorizationToken(code);
        console.log("succesfull response from spotify api ", token);
        res.send(token);
    }
}));
exports.default = authSpotifyRouter;
