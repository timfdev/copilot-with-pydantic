import { components } from "./api";

// Base Entities
export type Subscription = components["schemas"]["SubscriptionSchema"];
export type Process = components["schemas"]["ProcessSchema"];
export type Product = components["schemas"]["ProductSchema"];
export type Workflow = components["schemas"]["WorkflowSchema"];

// Search Parameter Types
export type SubscriptionSearchParameters =
  components["schemas"]["SubscriptionSearchParameters"];
export type ProcessSearchParameters =
  components["schemas"]["ProcessSearchParameters"];
export type ProductSearchParameters =
  components["schemas"]["ProductSearchParameters"];
export type WorkflowSearchParameters =
  components["schemas"]["WorkflowSearchParameters"];

// Search Result Types
export type SubscriptionSearchResult =
  components["schemas"]["SubscriptionSearchResult"];
export type ProcessSearchResult = components["schemas"]["ProcessSearchSchema"];
export type ProductSearchResult = components["schemas"]["ProductSearchSchema"];
export type WorkflowSearchResult =
  components["schemas"]["WorkflowSearchSchema"];

// Utility & Enum Types
export type PageInfo = components["schemas"]["PageInfoSchema"];
export type EntityKind = components["schemas"]["EntityKind"];
export type PathFilter = components["schemas"]["PathFilter"];

export type AnySearchResult =
  | SubscriptionSearchResult
  | ProcessSearchResult
  | ProductSearchResult
  | WorkflowSearchResult;

export type AnySearchParameters =
  | SubscriptionSearchParameters
  | ProcessSearchParameters
  | ProductSearchParameters
  | WorkflowSearchParameters;
export type SearchAgentState = {
  /** The most recent query sent by the user. */
  last_query: string;

  /** The entity type being searched (e.g., 'SUBSCRIPTION'). */
  last_entity_type: EntityKind;

  /** A simple counter for how many searches have been run. */
  search_count: number;

  /** A flag to show a "loading" or "thinking" state in the UI. */
  is_thinking: boolean;

  /** The last text response from the agent, for display in the status box. */
  last_response: string;
};
