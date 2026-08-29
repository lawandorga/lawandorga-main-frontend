import { computed, Ref, unref } from "vue";

type UrlParamType =
  | string
  | number
  | undefined
  | Ref<string>
  | Ref<number>
  | Ref<null>
  | Ref<undefined>;

interface UseUrlOptions {
  pathParams?: Record<string, UrlParamType>;
  queryParams?: Record<string, UrlParamType | null | undefined>;
}

/**
 * Build a URL dynamically with path and query parameters
 * Returns a reactive ref that updates when any parameter changes
 *
 * @param baseUrl Base URL with optional path placeholders like "/api/users/{id}/"
 * @param options Path parameters and query parameters
 * @returns Computed ref of the built URL
 *
 * @example
 * // Query parameters only
 * const url = useUrl("/api/permissions/query/permissions/", {
 *   queryParams: {
 *     user_id: userId,
 *     group_id: groupId,
 *   }
 * });
 * // url.value = "/api/permissions/query/permissions/?user_id=1&group_id=2"
 * // url.value = "/api/permissions/query/permissions/?user_id=1" (if groupId is undefined)
 *
 * @example
 * // Path parameters only
 * const url = useUrl("/api/users/{id}/", {
 *   pathParams: {
 *     id: userId,
 *   }
 * });
 * // url.value = "/api/users/123/"
 *
 * @example
 * // Both path and query parameters
 * const url = useUrl("/api/users/{id}/records/", {
 *   pathParams: {
 *     id: userId,
 *   },
 *   queryParams: {
 *     limit: 10,
 *     offset: ref(0),
 *   }
 * });
 * // url.value = "/api/users/123/records/?limit=10&offset=0"
 *
 * @example
 * // Using refs for reactive updates
 * const page = ref(1);
 * const url = useUrl("/api/items/", {
 *   queryParams: {
 *     page: page,
 *   }
 * });
 * // url.value = "/api/items/?page=1"
 * // When page.value = 2, url.value automatically updates to "/api/items/?page=2"
 */
export function useUrl(baseUrl: string, options: UseUrlOptions = {}) {
  const url = computed(() => {
    let result = baseUrl;

    // Replace path parameters
    if (options.pathParams) {
      for (const [key, value] of Object.entries(options.pathParams)) {
        const resolved = unref(value);
        if (resolved !== undefined && resolved !== null) {
          result = result.replace(`{${key}}`, String(resolved));
        }
      }
    }

    // Add query parameters
    if (options.queryParams) {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(options.queryParams)) {
        const resolved = unref(value);
        if (resolved !== undefined && resolved !== null) {
          params.append(key, String(resolved));
        }
      }
      const queryString = params.toString();
      if (queryString) {
        result = `${result}${result.includes("?") ? "&" : "?"}${queryString}`;
      }
    }

    return result;
  });

  return url;
}
