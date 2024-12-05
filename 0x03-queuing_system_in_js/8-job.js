import kue from 'kue';

function createPushNotificationsJobs(jobs, queue) {
  // التحقق من أن "jobs" هو مصفوفة
  if (!Array.isArray(jobs)) {
    throw new Error('Jobs is not an array');
  }

  // إضافة كل وظيفة إلى الطابور
  jobs.forEach((jobData) => {
    const job = queue.create('push_notification_code_3', jobData)
      .save((err) => {
        if (err) {
          console.error(`Notification job failed: ${err}`);
        } else {
          console.log(`Notification job created: ${job.id}`);
        }
      });

    // التعامل مع التقدم، الإكمال والفشل
    job.on('complete', () => {
      console.log(`Notification job ${job.id} completed`);
    });

    job.on('failed', (err) => {
      console.log(`Notification job ${job.id} failed: ${err}`);
    });

    job.on('progress', (progress, total) => {
      const percentage = (progress / total) * 100;
      console.log(`Notification job ${job.id} ${Math.round(percentage)}% complete`);
    });
  });
}

export default createPushNotificationsJobs;
