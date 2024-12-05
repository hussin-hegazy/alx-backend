import { createClient, print } from 'redis';

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

// تخزين قيم في هاش باستخدام hset
client.hset('HolbertonSchools', 'Portland', '50', print);
client.hset('HolbertonSchools', 'Seattle', '80', print);
client.hset('HolbertonSchools', 'New York', '20', print);
client.hset('HolbertonSchools', 'Bogota', '20', print);
client.hset('HolbertonSchools', 'Cali', '40', print);
client.hset('HolbertonSchools', 'Paris', '2', print);

// عرض القيم المخزنة في الهش باستخدام hgetall
client.hgetall('HolbertonSchools', (err, object) => {
  if (err) {
    console.error(err);
  } else {
    console.log(object);
  }
});
