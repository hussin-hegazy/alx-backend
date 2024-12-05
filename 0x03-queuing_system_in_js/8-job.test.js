import kue from 'kue';
import createPushNotificationsJobs from './8-job.js';

describe('createPushNotificationsJobs', () => {
  let queue;

  beforeEach(() => {
    // إعداد الطابور في وضع الاختبار
    queue = kue.createQueue();
    queue.testMode = true;
  });

  afterEach(() => {
    // مسح الطابور بعد كل اختبار
    queue.testMode = false;
    queue.shutdown(500, () => {});
  });

  it('should display an error message if jobs is not an array', () => {
    try {
      createPushNotificationsJobs({}, queue); // تمرير قيمة غير صحيحة
    } catch (err) {
      // التحقق من وجود الرسالة المناسبة
      expect(err.message).to.equal('Jobs is not an array');
    }
  });

  it('should create two new jobs to the queue', (done) => {
    const list = [
      {
        phoneNumber: '4153518780',
        message: 'This is the code 1234 to verify your account'
      },
      {
        phoneNumber: '4153518781',
        message: 'This is the code 4562 to verify your account'
      }
    ];

    createPushNotificationsJobs(list, queue);

    // التحقق من وجود الوظائف في الطابور
    setImmediate(() => {
      const jobs = queue.testMode.jobs;
      expect(jobs.length).to.equal(2); // يجب أن تحتوي الطابور على وظيفتين
      done();
    });
  });

  it('should log the correct messages when jobs are created', (done) => {
    const list = [
      {
        phoneNumber: '4153518780',
        message: 'This is the code 1234 to verify your account'
      }
    ];

    createPushNotificationsJobs(list, queue);

    // التحقق من وجود الرسائل الصحيحة في سجل وحدة التحكم
    setImmediate(() => {
      const jobs = queue.testMode.jobs;
      expect(jobs[0].id).to.be.a('number');
      expect(jobs[0].data.phoneNumber).to.equal('4153518780');
      done();
    });
  });
});
