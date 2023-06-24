import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
export interface PodcastInformation {
  podcastList: any;
  podcastSelected: any | null;
  podcastEpisodes: any[];
}

const initialState: PodcastInformation = {
  podcastList: [],
  podcastSelected: null,
  podcastEpisodes: []
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

    setDescription: (state, action?) => {
      if (action.payload !== undefined) {
        state.podcastSelected['description'] = action.payload;
      }
    },

    setEpisodes: (state, action?) => {
      if (action.payload !== undefined) {
        state.podcastEpisodes = action.payload;
      }
    },

    resetSelected: (state?) => {
      state.podcastEpisodes = [];
      state.podcastSelected = null;

    },

  }
});

export const {
  setPodcast,
  setPodcasts,
  setDescription,
  setEpisodes,
  resetSelected
} = podcastSlice.actions;

export const podcastInformation = (state: RootState) => state.podcastSlice;
export const podcastInformationPodcastList = (state: RootState) => state.podcastSlice.podcastList;
export const podcastInformationPodcastSelected = (state: RootState) => state.podcastSlice.podcastSelected;
export const podcastInformationPodcastEpisodes = (state: RootState) => state.podcastSlice.podcastEpisodes;
