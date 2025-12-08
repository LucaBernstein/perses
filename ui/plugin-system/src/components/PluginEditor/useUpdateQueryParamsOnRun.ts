// Copyright 2025 The Perses Authors
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { useCallback } from 'react';
import { JsonParam, useQueryParams } from 'use-query-params';

export interface QueryInfo {
  kind: string;
  type: string;
  spec: unknown;
}

/**
 * Custom hook to update URL query params when running a query.
 * Uses the use-query-params library to update the URL with query information.
 *
 * @returns A function to update query params with the current query information.
 */
export function useUpdateQueryParamsOnRun(): (queryInfo: QueryInfo) => void {
  const [, setQueryParams] = useQueryParams({ query: JsonParam }, { updateType: 'replaceIn' });

  return useCallback(
    (queryInfo: QueryInfo) => {
      setQueryParams({ query: queryInfo });
    },
    [setQueryParams]
  );
}

/**
 * Custom hook to read query information from URL query params.
 * This allows loading a query from a deep link.
 *
 * @returns The query information from the URL, or null if not present.
 */
export function useQueryFromUrl(): QueryInfo | null {
  const [queryParams] = useQueryParams({ query: JsonParam }, { updateType: 'replaceIn' });

  if (!queryParams.query || typeof queryParams.query !== 'object') {
    return null;
  }

  const query = queryParams.query as Record<string, unknown>;

  // Validate that the query has the required fields
  if (typeof query.kind === 'string' && typeof query.type === 'string' && query.spec !== undefined) {
    return {
      kind: query.kind,
      type: query.type,
      spec: query.spec,
    };
  }

  return null;
}
