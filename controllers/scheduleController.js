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
      return accountTypeController
        .downgradeTodaysNonRenewals()
        .then((result) => {
          /* continue the promise chain */
          console.log(result);
        });
    },
    (err) => {
      /* handle error here */
      console.log(err);
    }
  );
  const job = new SimpleIntervalJob({ hours: 2 }, task);
  scheduler.addSimpleIntervalJob(job);
};
