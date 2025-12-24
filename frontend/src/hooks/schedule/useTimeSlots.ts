import { useMemo } from 'react';

interface UseTimeSlotsProps {
  hoursPerDay: number;
  startHour?: number;
}

/**
 * Hook para gerar slots de tempo baseado nas horas de estudo por dia
 * @param hoursPerDay - Número de horas de estudo por dia
 * @param startHour - Hora inicial (default: 8h)
 * @returns Array de strings no formato HH:mm
 */
export const useTimeSlots = ({ hoursPerDay, startHour = 8 }: UseTimeSlotsProps): string[] => {
  return useMemo(() => {
    const slots: string[] = [];

    for (let i = 0; i < hoursPerDay; i++) {
      const hour = startHour + i;
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }

    return slots;
  }, [hoursPerDay, startHour]);
};
