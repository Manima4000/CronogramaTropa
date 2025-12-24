// Entity seguindo princípios do DDD
export class Classroom {
  constructor(
    public readonly id: number,
    public name: string,
    public courseName: string,
    public userCount: number
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Classroom name cannot be empty');
    }
    if (!this.courseName || this.courseName.trim().length === 0) {
      throw new Error('Classroom course name cannot be empty');
    }
    if (this.userCount < 0) {
      throw new Error('Classroom user count cannot be negative');
    }
  }

  public updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Classroom name cannot be empty');
    }
    this.name = name;
  }

  public updateCourseName(courseName: string): void {
    if (!courseName || courseName.trim().length === 0) {
      throw new Error('Classroom course name cannot be empty');
    }
    this.courseName = courseName;
  }

  public updateUserCount(userCount: number): void {
    if (userCount < 0) {
      throw new Error('Classroom user count cannot be negative');
    }
    this.userCount = userCount;
  }
}
