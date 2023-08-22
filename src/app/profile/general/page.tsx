"use client";

import { IUser } from "@/service/authentication/entities";
import { authService } from "@/service/authentication/service";
import { useEffect, useState } from "react";

const General = () => {
  const [user, setUser] = useState<IUser>();
  const getProfile = async () => {
    authService.authGet().then((response) => {
      setUser(response.response);
    });
  };
  useEffect(() => {
    getProfile();
  }, []);
  return <div>{user?.lastName}</div>;
};
export default General;
