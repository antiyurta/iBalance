import { IDataResource } from "@/service/permission/resource/entities";
import { ResourceService } from "@/service/permission/resource/service";
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from "react";

interface ResourceContextProps {
  resources: IDataResource[];
  isReload?: boolean;
  setIsReload?: Dispatch<SetStateAction<boolean>>;
}
const ResourceContext = createContext<ResourceContextProps | undefined>(
  undefined
);
interface IProps {
  children: React.ReactNode;
}
const ProviderResource: React.FC<IProps> = ({ children }) => {
  const [resources, setResources] = useState<IDataResource[]>([]);
  const [isReload, setIsReload] = useState<boolean>(false);
  const treeSort = (resources: IDataResource[]): IDataResource[] => {
    resources.sort((a, b) => a.position - b.position);
    resources.forEach((item) => {
      if (item.resources && item.resources.length > 0) treeSort(item.resources);
    });
    return resources;
  };
  useEffect(() => {
    ResourceService.get().then((response) => {
      if (response.success) {
        const resources = treeSort(response.response);
        setResources(resources);
      }
    });
  }, [isReload]);
  const value: ResourceContextProps = {
    resources,
    isReload,
    setIsReload,
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
