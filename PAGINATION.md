# Pagination Implementation Guide

Use this pattern for API endpoints that accept `api_page` and return a fixed-size array of results.

## Current API Behavior

- Send the requested page as `api_page`.
- The backend currently returns up to 25 items per page.
- The response does not include `total`, `next`, `previous`, or `page_size` metadata.
- Treat a response with exactly 25 items as "a next page may exist".
- Treat a response with fewer than 25 items as the last page.

## Component State

Keep pagination state local to the page unless the selected page must survive navigation or reloads.

```tsx
const PAGE_SIZE = 25;
const [page, setPage] = useState(1);
const [items, setItems] = useState<Item[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

## Fetching Pattern

Fetch whenever `page` changes. Always clear loading in `finally`, and guard against state updates after unmount.

```tsx
useEffect(() => {
  let ignore = false;

  async function loadPage() {
    setLoading(true);
    setError(null);

    try {
      const result = await api.someEndpoint({ api_page: page });

      if (ignore) return;

      if (result.ok) {
        setItems(result.data);
      } else {
        setError("Please try again later.");
      }
    } catch {
      if (ignore) return;
      setError("Please try again later.");
    } finally {
      if (!ignore) setLoading(false);
    }
  }

  void loadPage();

  return () => {
    ignore = true;
  };
}, [page]);
```

## Controls

Disable Previous on page 1. Disable Next when the current page has fewer than 25 items.

```tsx
const hasNextPage = items.length === PAGE_SIZE;

<Button disabled={loading || page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
  Previous
</Button>
<Text>Page {page}</Text>
<Button disabled={loading || !hasNextPage} onClick={() => setPage((value) => value + 1)}>
  Next
</Button>
```

## Multiple Tabs

When a page has independent tabs, keep a separate page number, loading state, error state, and data array for each tab.

For Game History, `My logs` and `All users` use separate page state because they call different endpoints.

## If Backend Metadata Is Added

If the API starts returning pagination metadata, prefer backend-provided values over array length inference.

Recommended metadata shape:

```ts
type PaginatedResponse<T> = {
  results: T[];
  page: number;
  page_size: number;
  total: number;
  has_next: boolean;
  has_previous: boolean;
};
```

Then drive controls from `has_next` and `has_previous` instead of `items.length === PAGE_SIZE`.
