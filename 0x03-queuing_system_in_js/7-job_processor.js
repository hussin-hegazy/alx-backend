import kue from 'kue';

// إنشاء الطابور
const queue = kue.createQueue();

// مصفوفة الأرقام السوداء
const blacklistedNumbers = [
  '4153518780',
  '4153518781'
];

// دالة لإرسال الإشعار
function sendNotification(phoneNumber, message, job, done) {
  // تتبع التقدم (0%)
  job.progress(0, 100);

  // التحقق مما إذا كان الرقم في القائمة السوداء
  if (blacklistedNumbers.includes(phoneNumber)) {
    job.fail(new Error(`Phone number ${phoneNumber} is blacklisted`));
    console.log(`Notification job #${job.id} failed: Phone number ${phoneNumber} is blacklisted`);
    return done(new Error(`Phone number ${phoneNumber} is blacklisted`));
  }

  // التقدم إلى 50%
  job.progress(50, 100);

  // تسجيل الإشعار
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
  
  // إتمام الوظيفة
  done();
}

// إعداد الطابور ومعالجة الوظائف
queue.process('push_notification_code_2', 2, (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message, job, done);
});

// تسجيل الوظائف
queue.on('job complete', (id) => {
  console.log(`Notification job #${id} completed`);
});

queue.on('job failed', (id, err) => {
  console.log(`Notification job #${id} failed: ${err.message}`);
});

// لاستخراج الوظائف من الطابور
queue.process('push_notification_code_2', 2, (job, done) => {
  sendNotification(job.data.phoneNumber, job.data.message, job, done);
});

