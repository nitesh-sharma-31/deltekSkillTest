import { Scheduler } from './scheduler/scheduler';

const scheduler = new Scheduler();

const alice = scheduler.createPerson('Alice', 'alice@example.com');
const bob = scheduler.createPerson('Bob', 'bob@example.com');

const nextHour = new Date();
nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);

scheduler.createMeeting([alice.email, bob.email], nextHour);

console.log("Alice's Schedule:");
console.log(scheduler.getSchedule(alice.email));

console.log("\nAvailable Time Slots for Alice and Bob:");
console.log(scheduler.suggestAvailableSlots([alice.email, bob.email]));