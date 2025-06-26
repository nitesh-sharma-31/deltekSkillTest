export interface Meeting {
  id: number;
  participants: string[]; // emails
  startTime: Date;
  endTime: Date;
}