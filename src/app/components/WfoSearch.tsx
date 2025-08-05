"use client";

import React, { useState } from "react";
import { useSearch } from "../hooks/useSearch";
import { useDebounce } from "../hooks/useDebounce";
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
  EuiSearchBar,
  EuiSpacer,
  EuiTab,
  EuiTabs,
  EuiText,
  Query,
  EuiSearchBarOnChangeArgs,
} from "@elastic/eui";
import {
  EntityKind,
  AnySearchResult,
  Subscription,
  SubscriptionSearchResult,
  ProcessSearchResult,
  ProductSearchResult,
  WorkflowSearchResult,
} from "@/app/types/models";

function isSubscriptionSearchResult(
  item: AnySearchResult
): item is SubscriptionSearchResult {
  return "subscription" in item && typeof item.subscription === "object";
}
function isProcessSearchResult(
  item: AnySearchResult
): item is ProcessSearchResult {
  return "processId" in item && "workflowName" in item;
}
function isProductSearchResult(
  item: AnySearchResult
): item is ProductSearchResult {
  return "productId" in item && "productType" in item;
}
function isWorkflowSearchResult(
  item: AnySearchResult
): item is WorkflowSearchResult {
  return "products" in item && Array.isArray(item.products);
}

const WfoSearchResults = ({
  results,
  loading,
}: {
  results: AnySearchResult[];
  loading: boolean;
}) => {
  const getDisplayText = (item: AnySearchResult): string => {
    if (isSubscriptionSearchResult(item)) {
      const subData = item.subscription as Subscription;
      return subData.description || "Subscription";
    }
    if (isProcessSearchResult(item)) {
      return item.workflowName;
    }
    if (isProductSearchResult(item)) {
      return item.name;
    }
    if (isWorkflowSearchResult(item)) {
      return item.name;
    }
    return "Unknown result type";
  };
  if (loading) {
    return (
      <EuiText size="s" color="subdued">
        Loading...
      </EuiText>
    );
  }
  if (!results || results.length === 0) {
    return (
      <EuiText size="s" color="subdued">
        No results to display.
      </EuiText>
    );
  }
  return (
    <div style={{ maxHeight: "300px", overflowY: "auto" }}>
      {results.map((item, index) => (
        <div
          key={index}
          style={{
            padding: "8px",
            borderBottom: "1px solid #eee",
            cursor: "pointer",
          }}
        >
          <EuiText size="s" color="default">
            <strong>{getDisplayText(item)}</strong>
          </EuiText>
        </div>
      ))}
    </div>
  );
};

const ENTITY_TABS = [
  { id: "SUBSCRIPTION", label: "Subscriptions", icon: "📋" },
  { id: "PRODUCT", label: "Products", icon: "📦" },
  { id: "WORKFLOW", label: "Workflows", icon: "🔄" },
  { id: "PROCESS", label: "Processes", icon: "⚙️" },
] as const;

export const WfoSearch = () => {
  const [query, setQuery] = useState<Query | string>(
    EuiSearchBar.Query.MATCH_ALL
  );
  const [selectedEntityTab, setSelectedEntityTab] =
    useState<EntityKind>("SUBSCRIPTION");

  const debouncedQuery = useDebounce(query, 500);

  const { results: results, loading: loading } = useSearch(
    debouncedQuery,
    selectedEntityTab
  );

  const handleTabChange = (tabId: EntityKind) => {
    setSelectedEntityTab(tabId);
    setQuery(EuiSearchBar.Query.MATCH_ALL);
  };

  const onSearchChange = ({ query, queryText }: EuiSearchBarOnChangeArgs) => {
    setQuery(query || EuiSearchBar.Query.MATCH_ALL);

    return true;
  };

  const currentTab = ENTITY_TABS.find((tab) => tab.id === selectedEntityTab);

  return (
    <>
      <EuiTabs>
        {ENTITY_TABS.map((tab) => (
          <EuiTab
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            isSelected={selectedEntityTab === tab.id}
          >
            {tab.icon} {tab.label}
          </EuiTab>
        ))}
      </EuiTabs>

      <EuiSpacer size="m" />

      <div style={{ position: "relative" }}>
        <EuiPanel paddingSize="m">
          <EuiFlexGroup gutterSize="s" alignItems="center" responsive={false}>
            <EuiFlexItem>
              <EuiSearchBar
                box={{
                  placeholder: `Search for ${currentTab?.label.toLowerCase()}…`,
                  incremental: true,
                }}
                query={query}
                onChange={onSearchChange}
              />
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiPanel>

        <EuiPanel
          paddingSize="m"
          style={{
            marginTop: 8,
            position: "absolute",
            width: "100%",
            zIndex: 1000,
            border: "1px solid #D3DAE6",
          }}
        >
          <WfoSearchResults results={results} loading={loading} />
        </EuiPanel>
      </div>
    </>
  );
};
