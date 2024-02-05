import { IUser } from "@/service/authentication/entities";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: IUser = {
    imageId: 0,
    email: "",
    firstName: "",
    id: 0,
    lastName: ""
}
export const user = createSlice({
    name: "user",
    initialState,
    reducers: {
        emptyUser: () => {
            return initialState;
        },
        setUser: (state, action: PayloadAction<IUser>) => {
            state = action.payload;
            return state;
        }
    }
});
export const { emptyUser, setUser } = user.actions;
export default user.reducer;