export function calcVisibleRows(prevVisible, increment, totalRows) {
  const newCount = prevVisible + increment;
  return newCount > totalRows ? totalRows : newCount;
}