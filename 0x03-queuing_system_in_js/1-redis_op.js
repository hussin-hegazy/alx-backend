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

// وظيفة لإضافة قيمة جديدة إلى Redis
function setNewSchool(schoolName, value) {
  client.set(schoolName, value, print); // print لعرض رسالة التأكيد
}

// وظيفة لعرض قيمة مفتاح معين
function displaySchoolValue(schoolName) {
  client.get(schoolName, (err, reply) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(reply); // طباعة القيمة المسترجعة
  });
}

// استدعاء الوظائف
displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
