export class ScheduleItem {
  constructor(
    public readonly id: number,
    public scheduleId: number,
    public lessonId: number,
    public scheduledDate: Date,
    public startTime: string, // Formato HH:mm (ex: "14:30")
    public duration: number, // Duração em minutos
    public completed: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.duration < 1) {
      throw new Error('Schedule item duration must be at least 1 minute');
    }

    if (!this.isValidTimeFormat(this.startTime)) {
      throw new Error('Start time must be in HH:mm format (e.g., "14:30")');
    }
  }

  private isValidTimeFormat(time: string): boolean {
    const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
    return timeRegex.test(time);
  }

  public markAsCompleted(): void {
    this.completed = true;
  }

  public markAsIncomplete(): void {
    this.completed = false;
  }

  public updateDuration(duration: number): void {
    if (duration < 1) {
      throw new Error('Schedule item duration must be at least 1 minute');
    }
    this.duration = duration;
  }

  public updateScheduledDate(date: Date): void {
    this.scheduledDate = date;
  }

  public updateStartTime(startTime: string): void {
    if (!this.isValidTimeFormat(startTime)) {
      throw new Error('Start time must be in HH:mm format (e.g., "14:30")');
    }
    this.startTime = startTime;
  }

  public getDurationInHours(): number {
    return Math.floor(this.duration / 60);
  }

  public getDurationInMinutes(): number {
    return this.duration % 60;
  }

  /**
   * Calcula a hora de término baseada na hora de início e duração
   * @returns String no formato HH:mm
   */
  public getEndTime(): string {
    const [hours, minutes] = this.startTime.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + this.duration;

    const endHours = Math.floor(endMinutes / 60) % 24; // % 24 para lidar com overflow de dia
    const endMins = endMinutes % 60;

    return `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
  }

  /**
   * Retorna a duração formatada como string (ex: "1h 30min")
   */
  public getFormattedDuration(): string {
    const hours = this.getDurationInHours();
    const mins = this.getDurationInMinutes();

    if (hours === 0) {
      return `${mins}min`;
    }

    if (mins === 0) {
      return `${hours}h`;
    }

    return `${hours}h ${mins}min`;
  }

  public isOverdue(currentDate: Date = new Date()): boolean {
    return !this.completed && this.scheduledDate < currentDate;
  }
}
