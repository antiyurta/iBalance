import { AnyAction } from 'redux';
import { LoginResponse } from '@/service/authentication/entities';
import { CoreActionType } from '../entities/CoreState';

function setLoginData(data: LoginResponse): any {
    return (dispatch: (action: AnyAction) => void) => {
        dispatch({
            type: CoreActionType.SET_LOGIN_DATA, data: data
        })
    }
}

function setRememberMe(username: string): any {
    return (dispatch: (action: AnyAction) => void) => {
        dispatch({ type: CoreActionType.SET_REMEMBER_ME, data: username });
    };
}

function setLoggedIn(isLoggedIn: boolean): any {
    return (dispatch: (action: AnyAction) => void) => {
        dispatch({ type: CoreActionType.SET_ISLOGGED_IN, data: isLoggedIn });
    };
}

export const CoreActions = {
    setLoginData,
    setRememberMe,
    setLoggedIn
};
