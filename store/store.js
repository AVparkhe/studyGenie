import { configureStore } from '@reduxjs/toolkit';

const initialState = {
  progress: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        progress: { ...state.progress, ...action.payload },
      };
    default:
      return state;
  }
};

const store = configureStore({
  reducer: reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
