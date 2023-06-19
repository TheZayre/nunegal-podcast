import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface ContextualInformation {
    ContextualInformation:{
        contextualMessage: any;
        showLoading: boolean;
        showConfirmModal: boolean;
    }
}

const initialState : ContextualInformation = {
  ContextualInformation: {
    contextualMessage: { message: '', type: '' },
    showLoading: false,
    showConfirmModal: false,
  },
};

export const contextualSlice = createSlice({
  name: 'contextualSlice',
  initialState,
  reducers: {
    updateContextualMessage: (state, action) => {
      console.log('->updateContextualMessage');
      state.ContextualInformation.contextualMessage = action.payload;
    },

    updateShowLoading: (state, action) => {
      console.log('->updateShowLoading');
      state.ContextualInformation.showLoading = action.payload;
    },
    updateShowConfirmModal: (state, action) => {
      console.log('UPDATE CONFIRM');
      state.ContextualInformation.showConfirmModal = action.payload;
    },
    resetContextualMessage: (state) => {
      console.log('->resetContextualMessage');
      state.ContextualInformation.contextualMessage =
        initialState.ContextualInformation.contextualMessage;
    },
  },
});

export const {
  updateContextualMessage,
  updateShowLoading,
  resetContextualMessage,
  updateShowConfirmModal,
} = contextualSlice.actions;

export const contextualInformation = (state: RootState) =>
  state.contextualSlice.ContextualInformation;
export const contextualInformationMessage = (state: RootState) =>
  state.contextualSlice.ContextualInformation.contextualMessage;
export const contextualInformationLoading = (state: RootState) =>
  state.contextualSlice.ContextualInformation.showLoading;
export const contextualInformationConfirmModal = (state: RootState) =>
  state.contextualSlice.ContextualInformation.showConfirmModal;