import { IPDFProvider, ScheduleWithItems } from '../../../shared/interfaces/IPDFProvider';

// Dependency Inversion Principle (D do SOLID)
export class PDFProvider implements IPDFProvider {
  async generateSchedulePDF(data: ScheduleWithItems): Promise<Buffer> {
    // TODO: Implementar geração de PDF usando biblioteca como PDFKit ou Puppeteer
    // Por enquanto, retorna um buffer vazio

    const { schedule, items } = data;

    // Exemplo básico (implementar com biblioteca de PDF depois)
    const pdfContent = `
      Cronograma: ${schedule.title}
      Descrição: ${schedule.description}
      Curso: ${schedule.courseId}
      Data Início: ${schedule.startDate}
      Data Fim: ${schedule.endDate}
      Dias/Semana: ${schedule.studyDaysPerWeek}
      Horas/Dia: ${schedule.hoursPerDay}

      Total de aulas: ${items.length}
    `;

    return Buffer.from(pdfContent, 'utf-8');
  }
}
