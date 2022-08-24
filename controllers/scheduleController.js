const {
  ToadScheduler,
  SimpleIntervalJob,
  AsyncTask,
} = require("toad-scheduler");

const accountTypeController = require("./accountTypeController");

exports.scheduledTask = () => {
  const scheduler = new ToadScheduler();

  const task = new AsyncTask(
    "simple task",
    () => {
      return accountTypeController.getUsersForDowngrade().then((result) => {
        /* continue the promise chain */
        console.log(result);
      });
    },
    (err) => {
      /* handle error here */
      console.log(err);
    }
  );
  const job = new SimpleIntervalJob({ seconds: 10 }, task);

  scheduler.addSimpleIntervalJob(job);

  // when stopping your app
  //scheduler.start();
};
