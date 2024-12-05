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

// الاشتراك في القناة
client.subscribe('holberton school channel', (err, count) => {
  if (err) {
    console.error('Failed to subscribe:', err);
  } else {
    console.log(`Subscribed to ${count} channel(s).`);
  }
});

// عند استلام رسالة من القناة
client.on('message', (channel, message) => {
  console.log(message);
  if (message === 'KILL_SERVER') {
    // إلغاء الاشتراك وإغلاق الاتصال
    client.unsubscribe('holberton school channel', () => {
      console.log('Unsubscribed from the channel');
      client.quit();
    });
  }
});
