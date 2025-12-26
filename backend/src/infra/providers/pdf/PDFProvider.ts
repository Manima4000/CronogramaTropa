import PDFDocument from 'pdfkit';
import { IPDFProvider, ScheduleWithItems } from '../../../shared/interfaces/IPDFProvider';

// Dependency Inversion Principle (D do SOLID)
export class PDFProvider implements IPDFProvider {
  async generateSchedulePDF(data: ScheduleWithItems): Promise<Buffer> {
    const { schedule, items } = data;

    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const chunks: Buffer[] = [];

        // Coletar chunks do PDF
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Cores do tema militar
        const colors = {
          primary: '#4a5d23',
          secondary: '#bdb76b',
          dark: '#2d3e1f',
          gray: '#6b7280',
          lightGray: '#e5e7eb',
        };

        // Cabeçalho
        doc.fontSize(24).fillColor(colors.primary).text(schedule.title, { align: 'center' });
        doc.moveDown(0.5);

        if (schedule.description) {
          doc.fontSize(12).fillColor(colors.gray).text(schedule.description, { align: 'center' });
          doc.moveDown();
        }

        // Linha separadora
        doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor(colors.lightGray).stroke();
        doc.moveDown();

        // Informações do cronograma
        doc.fontSize(11).fillColor(colors.dark);
        const startDate = this.formatDate(schedule.startDate);
        const endDate = this.formatDate(schedule.endDate);
        doc.text(`Período: ${startDate} - ${endDate}`);
        doc.text(`Total de aulas: ${items.length}`);
        doc.moveDown();

        // Calcular duração total
        const totalMinutes = items.reduce((sum, item) => sum + item.duration, 0);
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        doc.text(`Duração total: ${hours}h ${mins}min`);
        doc.moveDown(2);

        // Agrupar items por data
        const itemsByDate = this.groupItemsByDate(items);
        const dates = Object.keys(itemsByDate).sort();

        // Listar aulas por data
        dates.forEach((date, index) => {
          // Verificar se precisa de nova página
          if (doc.y > 680) {
            doc.addPage();
          }

          // Data do dia
          doc.fontSize(14).fillColor(colors.primary);
          doc.text(this.formatDateLong(date), 50, doc.y, { underline: true });
          doc.moveDown(0.3);

          // Cabeçalho da tabela
          const tableTop = doc.y;
          doc.fontSize(8).fillColor(colors.gray);
          doc.text('Horário', 50, tableTop, { width: 40 });
          doc.text('Duração', 95, tableTop, { width: 45 });
          doc.text('Curso', 145, tableTop, { width: 100 });
          doc.text('Módulo', 250, tableTop, { width: 90 });
          doc.text('Aula', 345, tableTop, { width: 200 });
          doc.moveDown(0.5);

          // Linha separadora
          doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor(colors.lightGray).stroke();
          doc.moveDown(0.3);

          const dayItems = itemsByDate[date];
          dayItems.forEach((item, itemIndex) => {
            // Verificar se precisa de nova página
            if (doc.y > 720) {
              doc.addPage();
            }

            const y = doc.y;

            // Horário, duração, curso, módulo e aula
            doc.fontSize(8).fillColor(colors.dark);
            doc.text(item.startTime, 50, y, { width: 40 });
            doc.text(`${item.duration}m`, 95, y, { width: 45 });
            doc.text(item.course.name, 145, y, { width: 100 });
            doc.text(item.section.name, 250, y, { width: 90 });
            doc.text(item.lesson.title, 345, y, { width: 200 });

            doc.moveDown(0.7);
          });

          doc.moveDown(1);
        });

        // Finalizar o PDF
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  private formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  private formatDateLong(dateStr: string): string {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  private groupItemsByDate(items: ScheduleWithItems['items']): Record<string, ScheduleWithItems['items']> {
    const grouped: Record<string, ScheduleWithItems['items']> = {};

    items.forEach((item) => {
      const dateKey = item.scheduledDate.toISOString().split('T')[0];
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(item);
    });

    // Ordenar items de cada dia por startTime
    Object.keys(grouped).forEach((date) => {
      grouped[date].sort((a, b) => a.startTime.localeCompare(b.startTime));
    });

    return grouped;
  }
}
