/* eslint-disable import/no-anonymous-default-export */
import { FETCH_IMAGES } from '../actions/types';

const initalState = [];

export default function (state = initalState, action) {
   switch (action.type) {
      case FETCH_IMAGES:
         return action.payload;
      default:
         return state;
   }
}
