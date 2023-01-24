import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ShareState } from "./share.state";

export const SHARE_STATE_NAME = 'share';

const getShareState = createFeatureSelector<ShareState>(SHARE_STATE_NAME);

/*
export const getLoading = createSelector(getShareState,(state)=>{
    return state.showLoading;
})
*/

export const getTitle = createSelector(getShareState,(state)=>{
  return state.title;
})

export const getBreadcrums = createSelector(getShareState,(state)=>{
  return state.breadcrums;
})
