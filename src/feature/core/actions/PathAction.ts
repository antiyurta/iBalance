import { AnyAction } from 'redux';
import { PathActionType, PathState } from '../entities/PathState';

function setPathData(data: PathState): any {
    return (dispatch: (action: AnyAction) => void) => {
        dispatch({
            type: PathActionType.SET_PATH_DATA, data: data
        })
    }
}

export const PathActions = {
    setPathData,
};
