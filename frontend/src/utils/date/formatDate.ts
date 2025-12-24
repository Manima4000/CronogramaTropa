import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDate = (dateString: string, pattern: string = 'dd/MM/yyyy'): string => {
  const date = parseISO(dateString);
  return format(date, pattern, { locale: ptBR });
};

export const formatDateTime = (dateString: string): string => {
  return formatDate(dateString, "dd/MM/yyyy 'às' HH:mm");
};

export const formatDateShort = (dateString: string): string => {
  return formatDate(dateString, 'dd/MMM');
};

export const formatDateLong = (dateString: string): string => {
  return formatDate(dateString, "dd 'de' MMMM 'de' yyyy");
};

// Funções para trabalhar com Date objects

export const formatDateObject = (date: Date, pattern: string = 'dd/MM/yyyy'): string => {
  return format(date, pattern, { locale: ptBR });
};

export const formatDateObjectShort = (date: Date): string => {
  return format(date, 'dd MMM', { locale: ptBR });
};

export const formatDateObjectFull = (date: Date): string => {
  return format(date, 'dd MMM yyyy', { locale: ptBR });
};

export const formatWeekday = (date: Date): string => {
  return format(date, 'EEE', { locale: ptBR });
};

export const formatDateRange = (startDate: Date, endDate: Date): string => {
  const start = formatDateObjectShort(startDate);
  const end = formatDateObjectFull(endDate);
  return `${start} - ${end}`;
};
