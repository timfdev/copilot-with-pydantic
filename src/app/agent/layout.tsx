import type { Metadata } from "next";
import { CopilotKit } from "@copilotkit/react-core";

import "../globals.css";
import "@copilotkit/react-ui/styles.css";

export const metadata: Metadata = {
  title: "Search assistant",
  description: "Query the orchestrator database with CopilotKit",
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CopilotKit runtimeUrl="/api/copilotkit" agent="query_agent">
          {children}
        </CopilotKit>
      </body>
    </html>
  );
}
