import React, { useReducer } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { BaseProviderImpl } from "./BaseProvider";

const loadingIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
  />
);

export interface BlockView {
  isBlock(): boolean;
  block(): void;
  unblock(): void;
}
class BlockContextImpl
  extends BaseProviderImpl<boolean, boolean>
  implements BlockView
{
  reducer(prevState: boolean, state: boolean) {
    return state;
  }
  isBlock(): boolean {
    return this.state;
  }
  block() {
    this.setBlock(true);
  }
  unblock(): void {
    this.setBlock(false);
  }
  private setBlock(value: boolean) {
    this.sendDispatch(value);
  }
}
const provider: BlockContextImpl = new BlockContextImpl(false);

export const BlockContext: React.Context<BlockView> =
  React.createContext<BlockView>(provider);

/** Үндсэн үйлдэл block хийж үйлдэл хийх боломжгүй болгох зорилготой */

export function AppBlock() {
  provider.iniReducer(useReducer(provider.reducer, false));
  return (
    <BlockContext.Consumer>
      {(context) =>
        context.isBlock() ? (
          <div className="app-container-block">
            <Spin indicator={loadingIcon} />
          </div>
        ) : (
          <></>
        )
      }
    </BlockContext.Consumer>
  );
}
