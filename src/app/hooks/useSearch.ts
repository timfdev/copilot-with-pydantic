"use client";

import { useEffect, useState } from "react";
import { Query } from "@elastic/eui";
import {
  EntityKind,
  AnySearchParameters,
  AnySearchResult,
  PathFilter,
} from "@/app/types/models";

const translateQueryToApiParams = (
  query: Query | string,
  entityType: EntityKind
): AnySearchParameters => {
  const filters: PathFilter[] = [];
  let queryText = "";

  if (typeof query !== "string" && query.ast) {
    query.ast.clauses.forEach((clause: any) => {
      if (clause.type === "field" && clause.field && clause.value) {
        filters.push({
          path: `${entityType.toLowerCase()}.${clause.field}`,
          condition: { op: "eq", value: clause.value },
        });
      }
    });
    queryText = query.text?.trim() || "";
  } else if (typeof query === "string") {
    queryText = query;
  }

  const commonParams = {
    action: "select" as const,
    query: queryText || undefined,
    filters: filters.length > 0 ? filters : undefined,
  };

  switch (entityType) {
    case "PROCESS":
      return { ...commonParams, entity_type: "PROCESS" };
    case "PRODUCT":
      return { ...commonParams, entity_type: "PRODUCT" };
    case "WORKFLOW":
      return { ...commonParams, entity_type: "WORKFLOW" };
    case "SUBSCRIPTION":
    default:
      return { ...commonParams, entity_type: "SUBSCRIPTION" };
  }
};

const getEndpointPath = (entityType: EntityKind): string => {
  switch (entityType) {
    case "PROCESS":
      return "processes";
    case "PRODUCT":
      return "products";
    case "WORKFLOW":
      return "workflows";
    case "SUBSCRIPTION":
    default:
      return "subscriptions";
  }
};

export const useSearch = (query: Query | string, entityType: EntityKind) => {
  const [results, setResults] = useState<AnySearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const performSearch = async () => {
      const searchParams = translateQueryToApiParams(query, entityType);

      const hasActiveSearch =
        (searchParams.query && searchParams.query.length > 1) ||
        (searchParams.filters && searchParams.filters.length > 0);

      if (!hasActiveSearch) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const endpointPath = getEndpointPath(entityType);
        const endpoint = `http://127.0.0.1:8081/api/search/${endpointPath}`;
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(searchParams),
        });

        if (!response.ok) {
          throw new Error(`Search failed with status: ${response.status}`);
        }

        const data = await response.json();
        setResults(data.page || []);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query, entityType]);

  return { results, loading };
};
