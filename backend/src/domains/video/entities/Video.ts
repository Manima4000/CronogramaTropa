// Entity seguindo princípios do DDD
export class Video {
  constructor(
    public readonly id: number,
    public source: string | null,
    public uid: string | null,
    public duration: number | null,
    public image: string | null,
    public lessonId: number
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.duration !== null && this.duration < 0) {
      throw new Error('Video duration cannot be negative');
    }
  }

  public updateSource(source: string | null): void {
    this.source = source;
  }

  public updateUid(uid: string | null): void {
    this.uid = uid;
  }

  public updateDuration(duration: number | null): void {
    if (duration !== null && duration < 0) {
      throw new Error('Video duration cannot be negative');
    }
    this.duration = duration;
  }

  public updateImage(image: string | null): void {
    this.image = image;
  }

  public getDurationInMinutes(): number | null {
    return this.duration ? Math.floor(this.duration / 60) : null;
  }

  public getDurationInHours(): number | null {
    return this.duration ? Math.floor(this.duration / 3600) : null;
  }
}
