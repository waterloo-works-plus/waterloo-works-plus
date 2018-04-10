import { observable, action } from 'mobx';
import _ from 'lodash';

import { TermUtil } from '../util/TermUtil';

const BASE_URL = 'https://waterlooworksplus.munazrahman.com';

const JOB_STATUS_VALUES =
  ['Open for Applications', 'Expired - Apps Available',
  'Interview Selection Complete', 'Interviews Complete',
  'Emp Rankings Finalized', 'Filled', 'Unfilled', 'Part Filled', 'Cancel',
  'Posted', 'Sub Posted'];
const APP_STATUS_VALUES =
  ['Applied', 'Employed', 'Not Selected', 'Selected for Interview'];

class AppStore {
  @observable isSignedIn = false;
  @observable username = '';
  @observable password = '';

  @observable isLoadingApplications = new Map();
  @observable applications = new Map();

  @observable isLoadingJob = new Map();
  @observable jobs = new Map();

  @observable isLoadingInterviews = false;
  @observable interviews = null;

  @observable isLoadingInterviewDetails = new Map();
  @observable interviewDetails = new Map();
  
  @observable jobStatusFilters = JOB_STATUS_VALUES;
  @observable appStatusFilters = APP_STATUS_VALUES;

  @action setUserCredentials = (username, password, cb, err) => {
    this.isSignedIn = true;
    return this.login(username, password, cb, err);
  }

  @action login = (newUsername, newPassword, cb, err) => {
    this.username = newUsername;
    this.password = newPassword;

    fetch(BASE_URL + '/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.username,
        password: this.password,
      }),
    })
    .then(res => res.json())
    .then(response => {
      if (response.status === 'OK') {
        this.isSignedIn = true;

        if (cb) {
          cb();
        }
      } else {
        this.isSignedIn = false;
        if (err) {
          err();
        }
      }
    })
    .catch(error => err(error));
  }

  @action logout = () => {
    // Clear all the data
    this.isSignedIn = false;
    this.username = '';
    this.password = '';
    this.isLoadingApplications = new Map();
    this.applications = new Map();
    this.isLoadingJob = new Map();
    this.jobs = new Map();
    this.interviews = null;
    this.isLoadingInterviews = false;
  }

  @action getApplicationsForTerm = (term) => {
    this.isLoadingApplications.set(term, true);

    return fetch(BASE_URL + '/applications/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.username,
        password: this.password,
        selectedTerm: term,
      }),
    })
    .then(res => res.json())
    .then(response => {
      if (response.status === 'OK') {
        this.applications.set(term, _.merge(this.applications.get(term), response.jobs));
      }

      this.isLoadingApplications.set(term, false);
    })
    .catch(error => {
      this.isLoadingApplications.set(term, false);
    });
  }

  @action getInterviews = () => {
    this.isLoadingInterviews = true;

    return fetch(BASE_URL + '/interviews/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.username,
        password: this.password,
        numOfDays: -1,
      }),
    })
    .then(res => res.json())
    .then(response => {
      if (response.status === 'OK') {
        this.interviews = _.merge(this.interviews, response.interviews);
      }

      this.isLoadingInterviews = false;
    })
    .catch(error => {
      this.isLoadingInterviews = false;
    });
  }

  @action getInterviewDetails = (interviewId) => {
    this.isLoadingInterviewDetails.set(interviewId, true);

    return fetch(BASE_URL + '/interviews/get-interview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.username,
        password: this.password,
        interviewId: interviewId,
      })
    })
    .then(res => res.json())
    .then(response => {
      if (response.status === 'OK') {
        this.interviewDetails.set(interviewId, response.interview);
      }

      this.isLoadingInterviewDetails.set(interviewId, false);
    })
    .catch(error => {
      // TODO handle error
      console.warn('Error getting interviewDetails: ' + interviewId);
      this.isLoadingInterviewDetails.set(interviewId, false);
    })
  }

  @action getJob = (jobId, term) => {
    this.isLoadingJob.set(jobId, true);
    Promise.all([
      this.getJobFromDb(jobId),
      this.getJobFromWW(jobId, term)
    ]).then(() => {
      this.isLoadingJob.set(jobId, false);
    });
  }

  @action getJobFromDb = (jobId) => {
    return fetch(BASE_URL + '/jobs/db/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobId: jobId
      })
    })
    .then(res => res.json())
    .then(response => {
      if (response.status === 'OK' && response.found) {
        this.jobs.set(jobId, _.merge(this.jobs.get(jobId), response.job));
      }
    })
    .catch(error => {
      // TODO handle error
      console.warn('Error getting job from db: ' + jobId);
    })
  }

  @action getJobFromWW = (jobId, term) => {
    return fetch(BASE_URL + '/jobs/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.username,
        password: this.password,
        jobId: jobId,
        selectedTerm: term
      })
    })
    .then(res => res.json())
    .then(response => {
      if (response.status === 'OK') {
        this.jobs.set(jobId, _.merge(this.jobs.get(jobId), response.job));
      }
    })
    .catch(error => {
      // TODO handle error
      console.warn('Error getting job: ' + jobId);
    })
  }

  @action toggleAppStatusFilter(value) {
    const index = this.appStatusFilters.indexOf(value);
    if (index === -1) {
      this.appStatusFilters.push(value);
    } else {
      this.appStatusFilters.splice(index, 1);
    }

    this.filtersLastUpdated = new Date();
  }

  @action toggleJobStatusFilter(value) {
    const index = this.jobStatusFilters.indexOf(value);
    if (index === -1) {
      this.jobStatusFilters.push(value);
    } else {
      this.jobStatusFilters.splice(index, 1);
    }
  }

  @action resetAppFilters() {
    this.appStatusFilters = APP_STATUS_VALUES;
    this.jobStatusFilters = JOB_STATUS_VALUES;
  }
}

const appStore = new AppStore();
export default appStore;