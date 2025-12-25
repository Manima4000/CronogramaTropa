import { useMemo } from 'react';

/**
 * Hook para gerar slots de tempo (0h-24h)
 * @returns Array de strings no formato HH:mm
 */
export const useTimeSlots = (): string[] => {
  return useMemo(() => {
    const slots: string[] = [];

    // Gerar todas as 24 horas do dia
    for (let hour = 0; hour < 24; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }

    return slots;
  }, []);
};
