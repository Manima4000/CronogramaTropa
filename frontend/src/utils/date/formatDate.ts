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
