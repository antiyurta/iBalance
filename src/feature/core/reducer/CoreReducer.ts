import { AnyAction } from 'redux';
import { CoreActionType, CoreState } from '../entities/CoreState';
import { LoginResponse } from '@/service/authentication/entities';

const initialValues: CoreState = {
    isLoggedIn: false,
    login_data: Object.create({}),
    remember_me: ""
}

export function coreReducer(state: CoreState = initialValues, action: AnyAction) {
    const { type, data } = action;

    switch (type) {
        case CoreActionType.SET_LOGIN_DATA:
            return {
                ...state,
                login_data: data as LoginResponse
            }
        case CoreActionType.SET_REMEMBER_ME:
            return {
                ...state,
                remember_me: data,
            }
        case CoreActionType.SET_ISLOGGED_IN:
            return {
                ...state,
                isLoggedIn: data,
            }
        default:
            return state
    }
} 
