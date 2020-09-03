import {
  GET_POST,
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  UPDATE_COMMENT
} from '../actions/types';

const initialState = {
  post: null,
  posts: [],
  loading: true,
  error: {}
};
export default function(state = initialState, actions) {
  const { type, payload } = actions;
  switch (type) {
    case ADD_POST:
      return {
        ...state,
        posts: [payload, ...state.posts], //因为post route 返回的就是新post的所有数据，所以加到posts的array里
        loading: false
      };
    case GET_POSTS:
      return {
        ...state,
        posts: payload,
        loading: false
      };
    case GET_POST:
      return {
        ...state,
        post: payload,
        loading: false
      };
    case POST_ERROR:
      return {
        ...state,
        errors: payload,
        loading: false
      };
    case UPDATE_LIKES:
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === payload.id ? { ...post, likes: payload.likes } : post
        ),
        loading: false
      };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== payload),
        loading: false
      };
    case UPDATE_COMMENT:
      return {
        ...state,
        post: {
          ...state.post,
          comments: payload
        },
        loading: false
      };
    default:
      return state;
  }
}
