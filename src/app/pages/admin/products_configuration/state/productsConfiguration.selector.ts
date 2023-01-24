import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ProductsConfigurationState } from "./productsConfiguration.state";

export const PRODUCTSCONFIGURATION_STATE_NAME = 'productsConfiguration';

const getProdutsConfigurationState = createFeatureSelector<ProductsConfigurationState>(PRODUCTSCONFIGURATION_STATE_NAME);

export const getProviders = createSelector(getProdutsConfigurationState, (state) => {
  return state.providers;
});

export const getProductsAll = createSelector(getProdutsConfigurationState, (state) => {
  return state.productsAll;
});

export const getPlans = createSelector(getProdutsConfigurationState, (state) => {
  return state.plans;
});

