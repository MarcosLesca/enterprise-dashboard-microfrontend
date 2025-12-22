import React from "react";

interface TableData {
  page: string;
  visitors: string;
  conversion: string;
}

interface DataTableProps {
  data: TableData[];
  title?: string;
  loading?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  title = "Top Pages",
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="chart-card">
        <h3 className="chart-card__title">{title}</h3>
        <div className="data-table__loading">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="data-table__skeleton-row">
              <div className="data-table__skeleton-cell"></div>
              <div className="data-table__skeleton-cell"></div>
              <div className="data-table__skeleton-cell"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <h3 className="chart-card__title">{title}</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>Page</th>
            <th>Visitors</th>
            <th>Conversion</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td className="data-table__page">
                <span className="data-table__page-indicator"></span>
                {row.page}
              </td>
              <td className="data-table__visitors">{row.visitors}</td>
              <td className="data-table__conversion">{row.conversion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
