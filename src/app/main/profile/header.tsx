import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useAuthContext } from "@/feature/context/AuthContext";
import { UploadImage } from "@/components/upload-image";
import { useEffect, useState } from "react";
import { authService } from "@/service/authentication/service";

const Header = () => {
  const { user } = useAuthContext();
  const [profileId, setProfileId] = useState<number>();
  const changeProfile = async (imageId: number) => {
    await authService.changeProfile({ imageId });
  };
  useEffect(() => {
    if (profileId) {
      changeProfile(profileId);
    }
  }, [profileId]);
  return (
    <div className="header">
      <div className="top"></div>
      <div className="bottom">
        <div className="image">
          <UploadImage imageId={user?.imageId} setImage={setProfileId} />
        </div>
        <div className="info">
          <div className="name">
            <p>{user?.firstName + " " + user?.lastName}</p>
          </div>
          <div className="position">
            <p>{user?.role?.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Header;
