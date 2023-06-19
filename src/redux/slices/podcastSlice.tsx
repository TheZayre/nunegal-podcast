import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
export interface PodcastInformation {
  podcastList: any;
  podcastSelected: any | null;
}

const initialState : PodcastInformation = {
    podcastList: [],
    podcastSelected: null
};

export const podcastSlice = createSlice({
  name: 'podcastSlice',
  initialState,
  reducers: {
    setPodcasts: (state, action?) => {
      if (action.payload !== undefined) {
        state.podcastList = { ...state.podcastList, ...action.payload };
      }
    },
    setPodcast: (state, action?) => {
        if (action.payload !== undefined) {
          state.podcastSelected = { ...state.podcastSelected, ...action.payload };
        }
      },

  }
});

export const podcastInformation = (state: RootState) => state.podcastSlice;
