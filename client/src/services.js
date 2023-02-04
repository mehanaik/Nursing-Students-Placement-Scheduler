import { createContext } from "react";
import EventEmitter from "eventemitter3";

export const UserContext = createContext();

export const UserContextProvider = UserContext.Provider;

export const GlobalEventEmitter = new EventEmitter();

export const EVENTS = {
    UPDATE_TOP_BAR: "update-top-bar"
};
