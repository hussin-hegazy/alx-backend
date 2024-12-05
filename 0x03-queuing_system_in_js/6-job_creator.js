import kue from 'kue';

// إنشاء الطابور
const queue = kue.createQueue();

// إنشاء بيانات الوظيفة
const jobData = {
  phoneNumber: '+1234567890',
  message: 'This is a test notification'
};

// إنشاء الوظيفة
const job = queue.create('push_notification_code', jobData)
  .save((err) => {
    if (err) {
      console.log('Notification job failed:', err);
    } else {
      console.log(`Notification job created: ${job.id}`);
    }
  });

// التعامل مع حالة اكتمال الوظيفة
job.on('complete', () => {
  console.log('Notification job completed');
});

// التعامل مع حالة فشل الوظيفة
job.on('failed', (err) => {
  console.log('Notification job failed:', err);
});
