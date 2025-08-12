import { QueryClient } from "@tanstack/react-query";
const defaultQueryFn = async ({ queryKey }) => {
    const response = await fetch(queryKey[0]);
    if (!response.ok) {
        throw new Error(`Network error: ${response.status}`);
    }
    return response.json();
};
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            queryFn: defaultQueryFn,
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});
export const apiRequest = async (url, options) => {
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
        ...options,
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};
