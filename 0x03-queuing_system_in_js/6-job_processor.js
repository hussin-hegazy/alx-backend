import kue from 'kue';

// إنشاء الطابور
const queue = kue.createQueue();

// دالة لإرسال الإشعارات
function sendNotification(phoneNumber, message) {
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
}

// إعداد المعالج للوظائف الجديدة
queue.process('push_notification_code', (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message); // استدعاء دالة إرسال الإشعار
  done(); // إتمام المعالجة
});
