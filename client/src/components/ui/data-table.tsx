import { Skeleton } from "@/components/ui/skeleton";

interface Column<T> {
  header: string;
  accessorKey: keyof T;
  cell?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  testId?: string;
}

export default function DataTable<T>({ 
  data, 
  columns, 
  isLoading = false, 
  emptyMessage = "No data found.",
  testId
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              {columns.map((column, index) => (
                <th key={index} className="px-4 py-3 text-left text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[...Array(3)].map((_, index) => (
              <tr key={index}>
                {columns.map((_, colIndex) => (
                  <td key={colIndex} className="px-4 py-3">
                    <Skeleton className="h-4 w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground" data-testid={`${testId}-empty`}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full" data-testid={testId}>
        <thead className="bg-muted/50">
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="px-4 py-3 text-left text-sm font-medium text-muted-foreground uppercase tracking-wide">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-muted/30" data-testid={`${testId}-row-${rowIndex}`}>
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-4 py-3 text-sm">
                  {column.cell 
                    ? column.cell((row as any)[column.accessorKey], row)
                    : String((row as any)[column.accessorKey])
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
