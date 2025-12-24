import type { ManualScheduleState } from '../../contexts/ManualScheduleContext';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Valida as informações básicas do cronograma manual
 * Responsabilidade: Validar campos obrigatórios e regras de negócio
 */
export const validateManualSchedule = (state: ManualScheduleState): ValidationResult => {
  const errors: ValidationError[] = [];

  // Validar título
  if (!state.title || state.title.trim().length === 0) {
    errors.push({
      field: 'title',
      message: 'O título é obrigatório',
    });
  }

  if (state.title && state.title.length > 200) {
    errors.push({
      field: 'title',
      message: 'O título deve ter no máximo 200 caracteres',
    });
  }

  // Validar datas
  if (!state.startDate) {
    errors.push({
      field: 'startDate',
      message: 'A data de início é obrigatória',
    });
  }

  if (!state.endDate) {
    errors.push({
      field: 'endDate',
      message: 'A data de término é obrigatória',
    });
  }

  if (state.startDate && state.endDate && state.startDate >= state.endDate) {
    errors.push({
      field: 'endDate',
      message: 'A data de término deve ser posterior à data de início',
    });
  }

  // Validar dias por semana
  if (state.studyDaysPerWeek < 1 || state.studyDaysPerWeek > 7) {
    errors.push({
      field: 'studyDaysPerWeek',
      message: 'Dias de estudo por semana deve ser entre 1 e 7',
    });
  }

  // Validar horas por dia
  if (state.hoursPerDay < 1 || state.hoursPerDay > 24) {
    errors.push({
      field: 'hoursPerDay',
      message: 'Horas por dia deve ser entre 1 e 24',
    });
  }

  // Validar seleção de aulas
  if (state.selectedLessons.size === 0) {
    errors.push({
      field: 'selectedLessons',
      message: 'Selecione pelo menos uma aula',
    });
  }

  // Validar alocações
  const unallocatedCount = state.selectedLessons.size - state.allocations.size;
  if (unallocatedCount > 0) {
    errors.push({
      field: 'allocations',
      message: `${unallocatedCount} aula(s) não alocada(s). Todas as aulas selecionadas devem ser alocadas no calendário.`,
    });
  }

  // Validar se as alocações estão dentro do range de datas
  if (state.startDate && state.endDate) {
    for (const [lessonId, allocation] of state.allocations.entries()) {
      const allocDate = allocation.scheduledDate;

      if (allocDate < state.startDate || allocDate > state.endDate) {
        const lesson = state.selectedLessons.get(lessonId);
        errors.push({
          field: 'allocations',
          message: `A aula "${lesson?.title || lessonId}" está alocada fora do período do cronograma`,
        });
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Retorna apenas os erros de um campo específico
 */
export const getFieldErrors = (errors: ValidationError[], field: string): string[] => {
  return errors
    .filter(error => error.field === field)
    .map(error => error.message);
};

/**
 * Retorna o primeiro erro de um campo específico
 */
export const getFirstFieldError = (errors: ValidationError[], field: string): string | undefined => {
  const fieldErrors = getFieldErrors(errors, field);
  return fieldErrors.length > 0 ? fieldErrors[0] : undefined;
};

/**
 * Agrupa erros por campo
 */
export const groupErrorsByField = (errors: ValidationError[]): Record<string, string[]> => {
  const grouped: Record<string, string[]> = {};

  for (const error of errors) {
    if (!grouped[error.field]) {
      grouped[error.field] = [];
    }
    grouped[error.field].push(error.message);
  }

  return grouped;
};
