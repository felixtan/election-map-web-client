import * as actions from '../actions/roadmap.js';

export function categoryFilter(state = actions.CategoryFilters.SHOW_ALL, action) {
  switch (action.type) {
  case actions.SET_CATEGORY_FILTER:
    return action.filter;
  default:
    return state;
  }
}
