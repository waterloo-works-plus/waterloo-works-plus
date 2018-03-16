import { observable, action } from 'mobx';
import _ from 'lodash';

import { TermUtil } from '../util/TermUtil';

const BASE_URL = 'https://waterlooworksapi.munazrahman.com';

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
        this.getApplications();
        this.getInterviews();

        if (cb) {
          cb();
        }
      } else {
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
  }

  @action getApplications = () => {
    const currentWorkTerm = TermUtil.getCurrentWorkTerm();
    const currentJobSearchTerm = TermUtil.getCurrentJobSearchTerm();

    this.getApplicationsForTerm(currentWorkTerm);
    this.getApplicationsForTerm(currentJobSearchTerm);
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

}

const appStore = new AppStore();
export default appStore;