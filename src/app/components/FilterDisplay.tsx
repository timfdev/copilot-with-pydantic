"use client";

type FilterCondition = {
  op: string;
  value: any;
};

type Filter = {
  path: string;
  condition: FilterCondition;
};

type FilterDisplayProps = {
  parameters: {
    action?: string;
    entity_type?: string;
    filters?: Filter[] | null;
    query?: string | null;
  };
};

export function FilterDisplay({ parameters }: FilterDisplayProps) {
  const { action, entity_type, filters, query } = parameters;

  if (Object.keys(parameters).length === 0) {
    return null;
  }

  const formatFilterValue = (value: any): string => {
    if (
      typeof value === "object" &&
      value !== null &&
      ("start" in value || "end" in value) &&
      "end" in value
    ) {
      const fromDate = value.start || value.end;
      return `${fromDate} ... ${value.end}`;
    }

    return String(value);
  };

  const getPathSegments = (path: string) => {
    return path.split(".");
  };

  return (
    <div className="bg-slate-800/90 p-4 rounded text-sm mb-6 space-y-4 border border-slate-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <h3 className="text-xs text-slate-400 uppercase font-semibold mb-1">
            Action
          </h3>
          <span className="bg-indigo-900/80 text-indigo-200 text-sm font-mono px-2 py-1 rounded">
            {action || "N/A"}
          </span>
        </div>
        <div>
          <h3 className="text-xs text-slate-400 uppercase font-semibold mb-1">
            Entity Type
          </h3>
          <span className="bg-sky-900/80 text-sky-200 text-sm font-mono px-2 py-1 rounded">
            {entity_type || "N/A"}
          </span>
        </div>
        {query && (
          <div>
            <h3 className="text-xs text-slate-400 uppercase font-semibold mb-1">
              Search Query
            </h3>
            <span className="italic text-slate-300">"{query}"</span>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-xs text-slate-400 uppercase font-semibold mb-2">
          Active Filters
        </h3>
        {filters && filters.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {filters.map((filter, index) => {
              const pathSegments = getPathSegments(filter.path);

              return (
                <div
                  key={`${filter.path}-${index}`}
                  className="flex items-center bg-slate-700 rounded-full text-slate-200 shadow-md"
                >
                  <span
                    className="flex items-center pl-3 pr-2 text-slate-400 text-xs cursor-help"
                    title={`Full Path: ${filter.path}`}
                  >
                    {pathSegments.map((segment, i) => (
                      <span key={i} className="flex items-center">
                        {segment}
                        {i < pathSegments.length - 1 && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-4 h-4 mx-1 text-slate-500"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </span>
                    ))}
                  </span>
                  <span className="px-2 py-1 bg-slate-600 text-xs font-mono">
                    {filter.condition.op}
                  </span>
                  <span className="pl-2 pr-3 font-medium text-amber-300">
                    {formatFilterValue(filter.condition.value)}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-slate-500 italic">No filters applied.</p>
        )}
      </div>
    </div>
  );
}
