import { configureStore } from '@reduxjs/toolkit';
import {
    TypedUseSelectorHook,
    useDispatch as useAppDispatch,
    useSelector as useAppSelector,
} from 'react-redux';
import { rootreducer } from './combine-reducer';
import { aidApi } from './rtk/aidApi';
import { audioApi } from './rtk/audioApi';
import { caseApi } from './rtk/caseApi';
import { fundApi } from './rtk/fundApi';
import { householdMonthlyApi } from './rtk/householdMonthyApi';
import { householdYearApi } from './rtk/householdYearApi';
import { insuranceApi } from './rtk/insuranceApi';
import { stockApi } from './rtk/stockApi';
import { allowanceApi } from './rtk/allowanceApi';
import { bondApi } from './rtk/bondApi';
import { channelApi } from './rtk/ChannelApi';
import { socialWorkerApi } from './rtk/socialWorkerLeaderApi';
import { reassignApi } from './rtk/reassignApi'; 
import { reviewApi } from './rtk/reviewApi';
import { dashApi } from './rtk/dashboardApi';
import { familyApi } from './rtk/familyApi';

export type RootState = ReturnType<typeof rootreducer>;

export type AppDispatch = typeof store.dispatch;

export const store=configureStore({
    reducer:rootreducer,
    middleware: (getDefaultMiddleware) =>getDefaultMiddleware()
        .concat(caseApi.middleware)
        .concat(stockApi.middleware)
        .concat(fundApi.middleware)
        .concat(householdYearApi.middleware)
        .concat(aidApi.middleware)
        .concat(insuranceApi.middleware)
        .concat(householdMonthlyApi.middleware)
        .concat(audioApi.middleware)
        .concat(allowanceApi.middleware)
        .concat(bondApi.middleware)
        .concat(channelApi.middleware)
        .concat(socialWorkerApi.middleware)
        .concat(reassignApi.middleware)
        .concat(reviewApi.middleware)
        .concat(dashApi.middleware)
        .concat(familyApi.middleware)
})

export const useSelector: TypedUseSelectorHook<RootState> = useAppSelector;

export const useDispatch = () => useAppDispatch<AppDispatch>();
