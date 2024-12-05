import express from 'express';
import redis from 'redis';
import { promisify } from 'util';
import kue from 'kue';

const client = redis.createClient();
const setAsync = promisify(client.set).bind(client);
const getAsync = promisify(client.get).bind(client);
const queue = kue.createQueue();

const app = express();
const port = 1245;
let reservationEnabled = true;

// Initialize Redis with 50 available seats
async function reserveSeat(number) {
  await setAsync('available_seats', number);
}

async function getCurrentAvailableSeats() {
  const availableSeats = await getAsync('available_seats');
  return availableSeats || 0;
}

function createReserveSeatJob() {
  const job = queue.create('reserve_seat', { seats: 1 })
    .save((err) => {
      if (err) {
        console.log('Job failed to save:', err);
      }
    });
}

app.get('/available_seats', async (req, res) => {
  const availableSeats = await getCurrentAvailableSeats();
  res.json({ numberOfAvailableSeats: availableSeats });
});

app.get('/reserve_seat', (req, res) => {
  if (!reservationEnabled) {
    return res.json({ status: "Reservation are blocked" });
  }

  // Create the reservation job
  createReserveSeatJob();

  res.json({ status: "Reservation in process" });
});

app.get('/process', async (req, res) => {
  res.json({ status: "Queue processing" });

  queue.process('reserve_seat', async (job, done) => {
    const availableSeats = await getCurrentAvailableSeats();
    if (availableSeats <= 0) {
      console.log(`Seat reservation job ${job.id} failed: Not enough seats available`);
      return done(new Error("Not enough seats available"));
    }

    // Decrement the available seats
    await reserveSeat(availableSeats - 1);

    if (availableSeats - 1 === 0) {
      reservationEnabled = false;  // Disable reservation when seats reach 0
    }

    console.log(`Seat reservation job ${job.id} completed`);
    done();
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Initialize Redis with 50 available seats
reserveSeat(50);

