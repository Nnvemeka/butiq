import {
	loginFailure,
	loginStart,
	loginSuccess,
	signUpFailure,
	signUpStart,
	signUpSuccess,
} from "./userRedux";
import { publicRequest } from "../requestMethods";
import {
	createOrderFailure,
	createOrderStart,
	createOrderSuccess,
} from "./orderRedux";

export const login = async (dispatch, user) => {
	dispatch(loginStart());

	try {
		const res = await publicRequest.post("/auth/sign-in", user);
		dispatch(loginSuccess(res.data.data));
	} catch (err) {
		dispatch(loginFailure());
	}
};

export const signUp = async (dispatch, user) => {
	dispatch(signUpStart());

	try {
		const res = await publicRequest.post("/auth/sign-up", user);
		dispatch(signUpSuccess(res.data.data));
	} catch (err) {
		dispatch(signUpFailure());
	}
};

export const createOrder = async (dispatch, order) => {
	dispatch(createOrderStart());

	try {
		const res = await publicRequest.post("/order/create", order);
		dispatch(createOrderSuccess(res.data.data));
	} catch (err) {
		dispatch(createOrderFailure());
	}
};
