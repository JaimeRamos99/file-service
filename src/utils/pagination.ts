export const calculateOffsetAndLimit = (
  page: string,
  pageSize: string,
): { offset: number; limit: number } => {
  const validPage = Math.max(Number(page) || 1, 1);
  const validPageSize = Math.max(Number(pageSize) || 10, 1);
  return {
    offset: (validPage - 1) * validPageSize,
    limit: validPageSize,
  };
};
