import { combineReducers } from "@reduxjs/toolkit";
import { aidApi } from "./rtk/aidApi";
import { audioApi } from "./rtk/audioApi";
import { caseApi } from "./rtk/caseApi";
import { fundApi } from "./rtk/fundApi";
import { householdMonthlyApi } from "./rtk/householdMonthyApi";
import { householdYearApi } from "./rtk/householdYearApi";
import { insuranceApi } from "./rtk/insuranceApi";
import { stockApi } from "./rtk/stockApi";
import audioToTextReducer from "./slice/audioTotextSlice";
import { allowanceApi } from "./rtk/allowanceApi";
import { bondApi } from "./rtk/bondApi";
import { channelApi } from "./rtk/ChannelApi";
import { socialWorkerApi } from "./rtk/socialWorkerLeaderApi";
import { reassignApi } from "./rtk/reassignApi";
import { reviewApi } from "./rtk/reviewApi";
import { dashApi } from "./rtk/dashboardApi";
import { familyApi } from "./rtk/familyApi";

export const rootreducer=combineReducers({
    audioToText:audioToTextReducer,
    [caseApi.reducerPath]:caseApi.reducer,
    [stockApi.reducerPath]:stockApi.reducer,
    [fundApi.reducerPath]:fundApi.reducer,
    [householdYearApi.reducerPath]:householdYearApi.reducer,
    [aidApi.reducerPath]:aidApi.reducer,
    [insuranceApi.reducerPath]:insuranceApi.reducer,
    [householdMonthlyApi.reducerPath]:householdMonthlyApi.reducer,
    [audioApi.reducerPath]:audioApi.reducer,
    [allowanceApi.reducerPath]:allowanceApi.reducer,
    [bondApi.reducerPath]:bondApi.reducer,
    [channelApi.reducerPath]:channelApi.reducer,
    [socialWorkerApi.reducerPath]: socialWorkerApi.reducer, 
    [reassignApi.reducerPath]: reassignApi.reducer, 
    [reviewApi.reducerPath]: reviewApi.reducer, 
    [dashApi.reducerPath]: dashApi.reducer, 
    [familyApi.reducerPath]: familyApi.reducer, 
})