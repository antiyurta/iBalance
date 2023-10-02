import { Button, Upload } from "antd";
import { CameraOutlined, EditOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useAuthContext } from "@/feature/context/AuthContext";

const Header = () => {
  const { user, setEdit } = useAuthContext();
  return (
    <div className="header">
      <div className="top"></div>
      <div className="bottom">
        <div className="image">
          <Image
            src={"/images/sidebar/famale.jpeg"}
            width={180}
            height={180}
            loading="eager"
            alt="profile"
          />
          <div title="Зураг оруулах" className="upload">
            <Upload className="avatar-uploader" showUploadList={false}>
              <CameraOutlined
                style={{
                  color: "white",
                  fontSize: 20,
                }}
              />
            </Upload>
          </div>
        </div>
        <div className="info">
          <div className="name">
            <p>{user?.firstName + " " + user?.lastName}</p>
            <Button icon={<EditOutlined />} onClick={() => setEdit(true)} />
          </div>
          <div className="position">
            <p>{user?.role.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Header;
