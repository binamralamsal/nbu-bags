export function zodTransformSortSearchParams<T extends string>(
  allowedKeys: T[],
) {
  return function (sort: string) {
    return sort
      .split(";")
      .filter(Boolean)
      .reduce(
        (result, part) => {
          const [key, value] = part.split(".");

          if (allowedKeys.includes(key as T)) {
            if (value === "desc" || value === "asc") {
              result[key as T] = value;
            }
          }
          return result;
        },
        {} as Partial<Record<T, "asc" | "desc">>,
      );
  };
}
