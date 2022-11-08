const {
  ToadScheduler,
  SimpleIntervalJob,
  AsyncTask,
} = require("toad-scheduler");

const accountTypeController = require("./accountTypeController");
const cvController = require("./cvController");
const cvLayoutController = require("./cvLayoutController");
const userController = require("./userController");

exports.scheduledTask = () => {
  const scheduler = new ToadScheduler();

  //Create Tasks
  const downgradeNonRenewersTask = new AsyncTask(
    "downgrade non-renewers to standard accounts",
    async () => {
      let userIDsForDowngrade = await accountTypeController
        .getTodaysNonRenewals()
        .then((users) => users);
      let cvIDsForLayoutChange = await cvController
        .getUserCVsByUserIDs(userIDsForDowngrade)
        .then((cvs) => cvs);
      let premiumCVLayouts = await cvLayoutController
        .getPremiumCVLayouts()
        .then((layouts) => layouts);

      let downgradeUserCVLayoutPromise =
        cvLayoutController.downgradePremiumToStandardTemplates(
          cvIDsForLayoutChange,
          premiumCVLayouts
        );
      let downgradeUserPromise =
        accountTypeController.downgradeTodaysNonRenewals(userIDsForDowngrade);

      Promise.all([downgradeUserCVLayoutPromise, downgradeUserPromise]).then(
        (result) => {
          console.log(result);
        }
      );
    },
    (err) => {
      console.log(err);
    }
  );

  const deleteUserAccountsTask = new AsyncTask(
    "delete the users requesting a deletion",
    async () => {
      let userIDsForDeletion = await accountTypeController
        .getTodaysDeletions()
        .then((result) => result);

      let userCVIdsForDeletion = await cvController
        .getUserCVsByUserIDs(userIDsForDeletion)
        .then((userCVIDs) => userCVIDs);

      let deleteCVLayoutsPromise =
        cvLayoutController.deleteLayoutsByCVID(userCVIdsForDeletion);
      let deleteCVsPromise =
        cvController.deleteUserCVsByID(userCVIdsForDeletion);
      let deleteUsersPromise =
        userController.deleteUsersByUserID(userIDsForDeletion);
      let deleteUserTypesPromise =
        accountTypeController.deleteUserTypesByUserID(userIDsForDeletion);

      Promise.all([
        deleteCVLayoutsPromise,
        deleteCVsPromise,
        deleteUsersPromise,
        deleteUserTypesPromise,
      ]).then((values) => {
        console.log(values);
      });
    },
    (err) => {
      console.log(err);
    }
  );

  const processMonthlyRenewalsTask = new AsyncTask(
    "take the money and update the renewal date",
    async () => {
      //Get people to take money from
      let todaysRenewalUserIDs = await accountTypeController
        .getTodaysRenewals()
        .then((result) => result);

      //Upon success of taking money, set new renewal date
      await accountTypeController
        .renewMonthlyUsers(todaysRenewalUserIDs)
        .then((result) => console.log(result));
    },
    (err) => {
      console.log(err);
    }
  );

  //Create Jobs
  const downgradeNonRenewersJob = new SimpleIntervalJob(
    { minutes: 15 }, //set to 2 hours in case the first job fails.
    downgradeNonRenewersTask
  );

  const deleteUserAccountsJob = new SimpleIntervalJob(
    { minutes: 15 }, //set to 2 hours in case the first job fails.
    deleteUserAccountsTask
  );

  const processMonthlyRenewalsJob = new SimpleIntervalJob(
    { minutes: 15 }, //set to 2 hours in case the first job fails.
    processMonthlyRenewalsTask
  );

  //Add Jobs to Rescheduler
  scheduler.addSimpleIntervalJob(downgradeNonRenewersJob);
  scheduler.addSimpleIntervalJob(deleteUserAccountsJob);
  scheduler.addSimpleIntervalJob(processMonthlyRenewalsJob);
};
