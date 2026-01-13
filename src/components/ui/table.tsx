const Table = ({ headers, data, renderRow, selectedRows, onRowSelect, onSelectAll }) => {
  return (
    <div className="overflow-x-auto rounded-b-lg  bg-white  px-4">
      {/* Ensure the table will exceed the container width when needed */}
      <table className="table-auto w-full text-center"> {/* min-width ensures the table is wide enough */}
        {/* Table Header */}
        <thead className=" text-sm font-semibold uppercase bg-gray-200">
          <tr>
            {/* "Select All" Checkbox in Header */}
            {onRowSelect && (
              <th className="py-3 px-4">
                <input
                  type="checkbox"
                  onChange={onSelectAll}
                  checked={data.length > 0 && selectedRows.length === data.length}
                  className="rounded text-blue-500 focus:ring-0"
                />
              </th>
            )}
            {headers.map((header: any, index: any) => (
              <th key={index} className="py-3 text-center px-4">
                {header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="text-gray-700 divide-y divide-gray-200">
          {data.map((row: any, index: any) => (
            <tr key={index} className="hover:bg-gray-50 text-center">
              {/* Row Selection Checkbox */}
              {onRowSelect && (
                <td className="px-4 py-3 no-print">
                  <input
                    type="checkbox"
                    checked={selectedRows.some((selectedOrder) => selectedOrder.id === row.id)}
                    onChange={() => onRowSelect(row)}
                    className="rounded text-blue-500 focus:ring-0"
                  />
                </td>
              )}
              {renderRow(row, index)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
