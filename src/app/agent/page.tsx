"use client";

import { useCoAgent } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { FilterDisplay } from "../components/FilterDisplay";

enum EntityKind {
  SUBSCRIPTION = "SUBSCRIPTION",
  PRODUCT = "PRODUCT",
  WORKFLOW = "WORKFLOW",
  PROCESS = "PROCESS",
}

type SearchState = {
  parameters: Record<string, any> | null;
  results: Record<string, any>[];
};

const initialState: SearchState = {
  parameters: {
    action: "",
    entity_type: "",
    filters: [],
    query: null,
  },
  results: [],
};

export default function AgentPage() {
  const { state } = useCoAgent<SearchState>({
    name: "query_agent",
    initialState: initialState,
  });

  const { parameters, results } = state;

  const hasStarted =
    state.parameters &&
    state.parameters.filters &&
    state.parameters.filters.length > 0;
  const isLoadingResults =
    hasStarted && (!state.results || state.results.length === 0);

  return (
    <main className="flex h-screen">
      <section className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Search results</h1>

        <>
          <h2 className="font-semibold mb-2">Filled parameters</h2>
          {parameters && <FilterDisplay parameters={parameters} />}

          <h2 className="font-semibold mb-2">
            Results&nbsp;
            {results && `(${results.length})`}
          </h2>

          {isLoadingResults ? (
            <div className="flex items-center space-x-2 text-slate-400">
              <div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-slate-400"></div>
              <span>Searching database...</span>
            </div>
          ) : (
            <ul className="space-y-3">
              {results && results.length > 0
                ? results.map((r, i) => (
                    <li
                      key={i}
                      className="border border-slate-700 rounded p-3 bg-slate-800/80 text-sm"
                    >
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify(r, null, 2)}
                      </pre>
                    </li>
                  ))
                : // Show "No results" only after loading is complete
                  hasStarted && (
                    <p className="text-slate-500 italic">No results found.</p>
                  )}
            </ul>
          )}
        </>
      </section>

      <CopilotSidebar
        defaultOpen
        clickOutsideToClose={false}
        labels={{
          title: "Database assistant",
          initial:
            "👋 Ask me things such as:\n" +
            "• *Find active subscriptions for Formatics*\n" +
            "• *Show workflows containing “billing”*\n\n" +
            "The filled template and results will appear on the left.",
        }}
      />
    </main>
  );
}
