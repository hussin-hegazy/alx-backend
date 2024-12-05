import { createClient } from 'redis';

// إنشاء عميل Redis
const client = createClient();

// عند نجاح الاتصال
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// عند فشل الاتصال
client.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err.message}`);
});

// دالة لنشر الرسائل
const publishMessage = (message, time) => {
  setTimeout(() => {
    console.log(`About to send ${message}`);
    client.publish('holberton school channel', message);
  }, time);
};

// نشر الرسائل
publishMessage('Holberton Student #1 starts course', 100);
publishMessage('Holberton Student #2 starts course', 200);
publishMessage('KILL_SERVER', 300);
publishMessage('Holberton Student #3 starts course', 400);
