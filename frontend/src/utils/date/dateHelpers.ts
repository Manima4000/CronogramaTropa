/**
 * Utilitários para trabalhar com datas
 * Seguindo SRP: Cada função tem uma responsabilidade específica
 */

/**
 * Converte string de input date (YYYY-MM-DD) para Date no timezone local
 * Evita problemas de timezone ao criar datas
 *
 * @param dateString - String no formato YYYY-MM-DD do input type="date"
 * @returns Date object no timezone local (00:00:00 local time)
 *
 * @example
 * parseLocalDate("2025-01-03") // 2025-01-03T00:00:00 (local timezone)
 */
export const parseLocalDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  // Criar data no timezone local (month é 0-indexed)
  return new Date(year, month - 1, day, 0, 0, 0, 0);
};

/**
 * Converte Date para string no formato YYYY-MM-DD para input type="date"
 *
 * @param date - Date object
 * @returns String no formato YYYY-MM-DD
 *
 * @example
 * formatDateForInput(new Date(2025, 0, 3)) // "2025-01-03"
 */
export const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Normaliza uma data para meia-noite (00:00:00.000) no timezone local
 * Útil para comparações de datas ignorando horas
 *
 * @param date - Date object
 * @returns Nova Date normalizada para meia-noite
 *
 * @example
 * normalizeDate(new Date(2025, 0, 3, 14, 30)) // 2025-01-03T00:00:00.000
 */
export const normalizeDate = (date: Date): Date => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

/**
 * Verifica se uma data está dentro de um range (inclusive)
 *
 * @param date - Data a verificar
 * @param startDate - Data de início do range
 * @param endDate - Data de fim do range
 * @returns true se a data está dentro do range
 *
 * @example
 * isDateInRange(new Date(2025, 0, 5), new Date(2025, 0, 1), new Date(2025, 0, 10)) // true
 */
export const isDateInRange = (
  date: Date,
  startDate: Date,
  endDate: Date
): boolean => {
  const normalizedDate = normalizeDate(date);
  const normalizedStart = normalizeDate(startDate);
  const normalizedEnd = normalizeDate(endDate);

  return normalizedDate >= normalizedStart && normalizedDate <= normalizedEnd;
};

/**
 * Verifica se uma data é válida
 *
 * @param date - Date object a verificar
 * @returns true se a data é válida
 *
 * @example
 * isValidDate(new Date("2025-01-03")) // true
 * isValidDate(new Date("invalid")) // false
 */
export const isValidDate = (date: Date): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};
