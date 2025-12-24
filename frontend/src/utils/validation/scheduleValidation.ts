import * as yup from 'yup';

export const createScheduleSchema = yup.object({
  title: yup
    .string()
    .required('Título é obrigatório')
    .min(3, 'Título deve ter no mínimo 3 caracteres')
    .max(100, 'Título deve ter no máximo 100 caracteres'),
  description: yup.string().nullable(),
  courseId: yup
    .number()
    .required('Curso é obrigatório')
    .positive('Selecione um curso válido')
    .integer('ID do curso deve ser um número inteiro'),
  startDate: yup
    .date()
    .required('Data de início é obrigatória')
    .typeError('Data inválida'),
  endDate: yup
    .date()
    .required('Data de término é obrigatória')
    .min(yup.ref('startDate'), 'Data de término deve ser após a data de início')
    .typeError('Data inválida'),
  studyDaysPerWeek: yup
    .number()
    .required('Dias de estudo por semana são obrigatórios')
    .min(1, 'Mínimo de 1 dia por semana')
    .max(7, 'Máximo de 7 dias por semana')
    .integer('Deve ser um número inteiro'),
  hoursPerDay: yup
    .number()
    .required('Horas por dia são obrigatórias')
    .min(1, 'Mínimo de 1 hora por dia')
    .max(24, 'Máximo de 24 horas por dia')
    .integer('Deve ser um número inteiro'),
});

export type CreateScheduleFormData = yup.InferType<typeof createScheduleSchema>;
