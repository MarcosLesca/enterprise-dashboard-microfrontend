import { TopPageData } from "../app/types";

interface TopPagesTableProps {
  data: TopPageData[];
}

export const TopPagesTable = ({ data }: TopPagesTableProps) => {
  const getBadgeVariant = (bounceRate: string) => {
    const rate = parseFloat(bounceRate);
    if (rate < 30) return "badge-success";
    if (rate < 40) return "badge-warning";
    return "badge-error";
  };

  return (
    <div className="card">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Top Pages
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Most visited pages and performance metrics
        </p>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-[40%]">Page</th>
              <th className="w-[30%]">Visitors</th>
              <th className="w-[30%]">Bounce Rate</th>
            </tr>
          </thead>
          <tbody>
            {data.map((page) => (
              <tr
                key={page.page}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <td className="font-medium text-gray-900 dark:text-gray-100">
                  {page.page}
                </td>
                <td className="text-gray-600 dark:text-gray-400">
                  {page.visitors}
                </td>
                <td>
                  <span className={`badge ${getBadgeVariant(page.bounceRate)}`}>
                    {page.bounceRate}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
