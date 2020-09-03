import { SET_ALERT, REMOVE_ALERT } from '../actions/types';
const initialState = []; //这个reducer的原始状态是一个空array
export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_ALERT:
      return [...state, payload]; //此处payload是一个alert 的object
    case REMOVE_ALERT:
      //payload 可以是任何东西，在此是要被remove的alert的id
      return state.filter(alert => alert.id !== payload);
    default:
      return state;
  }
}
