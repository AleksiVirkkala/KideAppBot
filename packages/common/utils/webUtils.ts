export const getSearchParams = (url: string): Record<string, string> => {
  const { searchParams } = new URL(url);
  const params: Record<string, string> = {};

  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
};
