import { Person } from '../models/person';
import { Meeting } from '../models/meeting';

export class Scheduler {
  private persons: Person[] = [];
  private meetings: Meeting[] = [];
  private personId = 1;
  private meetingId = 1;

  createPerson(name: string, email: string): Person {
    if (this.persons.find(p => p.email === email)) {
      throw new Error('Email already exists');
    }

    const person: Person = { id: this.personId++, name, email };
    this.persons.push(person);
    return person;
  }

  createMeeting(participantEmails: string[], start: Date): Meeting {
    if (!this.isHourMark(start)) {
      throw new Error('Meeting must start on the hour');
    }

    const end = new Date(start);
    end.setHours(start.getHours() + 1);

    for (const email of participantEmails) {
      if (!this.persons.find(p => p.email === email)) {
        throw new Error(`Person with email ${email} does not exist`);
      }
    }

    for (const meeting of this.meetings) {
      if (
        meeting.participants.some(email => participantEmails.includes(email)) &&
        this.overlaps(meeting.startTime, meeting.endTime, start, end)
      ) {
        throw new Error('Meeting conflict');
      }
    }

    const meeting: Meeting = {
      id: this.meetingId++,
      participants: participantEmails,
      startTime: start,
      endTime: end,
    };

    this.meetings.push(meeting);
    return meeting;
  }

  getSchedule(email: string): Meeting[] {
    return this.meetings
      .filter(m => m.participants.includes(email))
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }

  suggestAvailableSlots(participantEmails: string[], daysAhead = 5): Date[] {
    const availableSlots: Date[] = [];
    const now = new Date();
    now.setMinutes(0, 0, 0);

    for (let d = 0; d < daysAhead; d++) {
      const date = new Date(now);
      date.setDate(now.getDate() + d);
      for (let h = 9; h < 17; h++) {
        const slotStart = new Date(date);
        slotStart.setHours(h);
        const slotEnd = new Date(slotStart);
        slotEnd.setHours(h + 1);

        const conflict = this.meetings.some(meeting =>
          meeting.participants.some(email => participantEmails.includes(email)) &&
          this.overlaps(meeting.startTime, meeting.endTime, slotStart, slotEnd)
        );

        if (!conflict && slotStart > now) {
          availableSlots.push(slotStart);
        }
      }
    }

    return availableSlots;
  }

  private overlaps(startA: Date, endA: Date, startB: Date, endB: Date): boolean {
    return startA < endB && startB < endA;
  }

  private isHourMark(date: Date): boolean {
    return date.getMinutes() === 0 && date.getSeconds() === 0;
  }
}