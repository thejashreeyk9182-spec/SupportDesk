
import { useCallback, useState } from "react";

function useAsync<T, Args extends unknown[]>(
  asyncFunction: (...args: Args) => Promise<T>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: Args): Promise<T | undefined> => {
      try {
        setLoading(true);
        setError(null);

        const result = await asyncFunction(...args);

        setData(result);
        return result;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Something went wrong";

        setError(errorMessage);
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

export default useAsync;
