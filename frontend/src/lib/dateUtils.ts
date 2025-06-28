/**
 * Dateオブジェクトを「YYYY-MM-DD」形式の文字列に変換します。
 * @param date - Dateオブジェクト
 * @returns YYYY-MM-DD 形式の文字列
 */
export const formatDateToYYYYMMDD = (date: Date | string | undefined | null): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return ''; // 無効な日付も弾く
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 年・月・日から「YYYY-MM-DD」形式の文字列を生成します。
 * 月は0-indexed (0: 1月, 11: 12月)。
 * @param year
 * @param month
 * @param day
 * @returns YYYY-MM-DD形式
 */
export const getDateString = (year: number, month: number, day: number): string => {
  return formatDateToYYYYMMDD(new Date(year, month, day));
};
