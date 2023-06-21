import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface ContextualInformation {
    ContextualInformation:{
        showLoading: boolean;
    }
}

const initialState : ContextualInformation = {
  ContextualInformation: {
    showLoading: false,
  },
};

export const contextualSlice = createSlice({
  name: 'contextualSlice',
  initialState,
  reducers: {
    updateShowLoading: (state, action) => {
      console.log('->updateShowLoading');
      state.ContextualInformation.showLoading = action.payload;
    },
  },
});

export const {
  updateShowLoading,
} = contextualSlice.actions;

export const contextualInformation = (state: RootState) =>
  state.contextualSlice.ContextualInformation;
export const contextualInformationLoading = (state: RootState) =>
  state.contextualSlice.ContextualInformation.showLoading;