import jsonPlaceholder from '../apis/jsonplaceholder';
import _ from 'lodash';

//Action Creators inside an Action Creator
export const fetchPostsAndUsers = () => async (dispatch, getState) => {
	//If we are calling an action creator in another action creator, we need to pass dispatch
	await dispatch(fetchPosts());

	//We are going to get individual user ids
	//const userIds = _.uniq(_.map(getState().posts, 'userId'));
	//We are going to iterate over userIds to eliminate same ids. We do not need to add await since we do not need to wait that data to come to do another thing
	//userIds.forEach((id) => dispatch(fetchUser(id)));
	//If we need to write the same code with await. Here is how:
	//await Promise.all(userIds.map((id)=>dispatch(fetchUser(id)))

	//Refactoring the same code with _.chain()
	_.chain(getState().posts).map('userId').uniq().forEach((id) => dispatch(fetchUser(id))).value();
};

export const fetchPosts = () => async (dispatch) => {
	const response = await jsonPlaceholder.get('/posts');
	dispatch({
		type: 'FETCH_POSTS',
		payload: response.data
	});
};

export const fetchUser = (id) => async (dispatch) => {
	const response = await jsonPlaceholder.get(`/users/${id}`);
	dispatch({
		type: 'FETCH_USER',
		payload: response.data
	});
};

/*
Memoized Version

import _ from 'lodash';

export const fetchUser = (id) => (dispatch) => {
	_fetchUser(id, dispatch);
};

const _fetchUser = _.memoize(async (id, dispatch) => {
	const response = await jsonPlaceholder.get(`/users/${id}`);
	dispatch({
		type: 'FETCH_USER',
		payload: response.data
	});
});
*/
