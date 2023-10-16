import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/filtered";
import { findIndexInColumnSettings, onCloseFilterTag } from "@/feature/common";
import { Col, Row, Space } from "antd";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Jurnal = () => {
  const [columns, setColumns] = useState<any>();
  const [newParams, setNewParams] = useState<any>();
  const getData = (param: any) => {};
  useEffect(() => {
    getData({ page: 1, limit: 10 });
  }, []);
  return (
    <div>
      {/* <Row gutter={[0, 12]}>
        <Col sm={24}>
          <Space
            style={{
              width: "100%",
              justifyContent: "flex-end",
            }}
            size={12}
          >
            <Filtered
              columns={columns}
              isActive={(key, state) => {
                onCloseFilterTag({
                  key: key,
                  state: state,
                  column: columns,
                  onColumn: (columns) => setColumns(columns),
                  params: newParams,
                  onParams: (params) => setNewParams(params),
                });
                getData(newParams);
              }}
            />
            <Space
              style={{
                width: "100%",
                justifyContent: "flex-end",
              }}
              size={12}
            >
              <ColumnSettings
                columns={columns}
                columnIndexes={(arg1, arg2) =>
                  findIndexInColumnSettings({
                    newRowIndexes: arg1,
                    unSelectedRow: arg2,
                    columns: columns,
                    onColumns: (columns) => setColumns(columns),
                    params: newParams,
                    onParams: (params) => setNewParams(params),
                    getData: (params) => getData(params),
                  })
                }
              />
              <Image
                src={"/images/PrintIcon.svg"}
                width={24}
                height={24}
                alt="printIcon"
              />
              <Image
                src={"/images/DownloadIcon.svg"}
                width={24}
                height={24}
                alt="downloadIcon"
              />
            </Space>
          </Space>
        </Col>
      </Row> */}
    </div>
  );
};
export default Jurnal;
