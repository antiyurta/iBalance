import { IDataResource } from "@/service/permission/resource/entities";
import { ResourceService } from "@/service/permission/resource/service";
import { createContext, useContext, useEffect, useState } from "react";

interface ResourceContextProps {
  resources: IDataResource[];
}
const ResourceContext = createContext<ResourceContextProps | undefined>(
  undefined
);
interface IProps {
  children: React.ReactNode;
}
const ProviderResource: React.FC<IProps> = ({ children }) => {
  const [resources, setResources] = useState<IDataResource[]>([]);
  useEffect(() => {
    ResourceService.get().then((response) => {
      if (response.success) {
        setResources(response.response);
      }
    });
  }, []);
  const value: ResourceContextProps = {
    resources,
  };
  return (
    <ResourceContext.Provider value={value}>
      {children}
    </ResourceContext.Provider>
  );
};
const useResourceContext = () => {
  const context = useContext(ResourceContext);
  if (!context) {
    throw new Error(
      "useResourceContext must be used within a ProviderResource"
    );
  }
  return context;
};
export { ProviderResource, useResourceContext };
