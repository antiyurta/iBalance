"use client";

import { NewColumn, NewTable } from "@/components/table";

const Information = () => {
  return (
    <div>
      <p>GROUP</p>
      <NewTable
        prop={{
          rowKey: "id",
          bordered: true,
          dataSource: [],
        }}
        meta={{
          page: 1,
          limit: 0,
          itemCount: 0,
        }}
        isLoading={false}
        isPagination={false}
      >
        <NewColumn title="asdas" />
      </NewTable>
    </div>
  );
};
export default Information;
