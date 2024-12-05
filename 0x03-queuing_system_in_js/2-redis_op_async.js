import { createClient, print } from 'redis';
import { promisify } from 'util';

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

// تحويل client.get إلى وظيفة مع Promise
const getAsync = promisify(client.get).bind(client);

// وظيفة لعرض قيمة مفتاح معين باستخدام async/await
async function displaySchoolValue(schoolName) {
  try {
    const value = await getAsync(schoolName);
    console.log(value); // طباعة القيمة المسترجعة
  } catch (err) {
    console.error(err);
  }
}

// استدعاء الوظائف
displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
