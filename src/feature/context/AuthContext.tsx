import { IUser } from "@/service/authentication/entities";
import { ReactNode, createContext, useContext, useState } from "react";

type authContext = {
  user: IUser | undefined;
  set: (user: IUser) => void;
  isEdit: boolean | undefined;
  setEdit: (state: boolean) => void;
};

const authContextDefualtValues: authContext = {
  user: undefined,
  set: () => {},
  isEdit: false,
  setEdit: () => {},
};

export const AuthContext = createContext<authContext>(authContextDefualtValues);
export function useAuthContext() {
  return useContext(AuthContext);
}
interface IProps {
  children: ReactNode;
}

export function AuthContextProvider(props: IProps) {
  const [user, setUser] = useState<IUser>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const set = (user: IUser) => {
    setUser(user);
  };
  const setEdit = (state: boolean) => {
    setIsEdit(state);
  };
  return (
    <AuthContext.Provider value={{ user, set, isEdit, setEdit }}>
      {props.children}
    </AuthContext.Provider>
  );
}
