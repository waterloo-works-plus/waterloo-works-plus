import { observable, action } from 'mobx';
import _ from 'lodash';

const BASE_URL = 'https://waterlooworksapi.munazrahman.com';

class AppStore {
  @observable isSignedIn = false;
  @observable username = '';
  @observable password = '';

  @observable isLoadingApplications = new Map();
  @observable applications = new Map();

  @observable isLoadingJob = new Map();
  @observable jobs = new Map();

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
    this.isSignedIn = false;
    this.username = '';
    this.password = '';
  }

  @action getApplications = () => {
    const currentWorkTerm = this.getCurrentWorkTerm();
    const currentJobSearchTerm = this.getCurrentJobSearchTerm();

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
        this.isLoadingApplications.set(term, false);
      }
    })
    .catch(error => {
      // TODO handle error
      console.warn('Error getting applications for term: ' + term);
    });
  }

  @observable getJob = (jobId, term) => {
    this.isLoadingJob.set(jobId, true);
    Promise.all([
      this.getJobFromDb(jobId),
      this.getJobFromWW(jobId, term)
    ]).then(() => {
      this.isLoadingJob.set(jobId, false);
    });
  }

  @observable getJobFromDb = (jobId) => {
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

  @observable getJobFromWW = (jobId, term) => {
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

  getCurrentJobSearchTerm = () => {
    const now = new Date();
    const term = 411 + 3 * (now.getFullYear() - 2018) + Math.floor((now.getMonth() - 1) / 4);
    return term.toString();
  }

  getCurrentWorkTerm = () => {
    const now = new Date();
    const term = 410 + 3 * (now.getFullYear() - 2018) + Math.floor((now.getMonth() - 1) / 4);
    return term.toString();
  }
}

const appStore = new AppStore();
export default appStore;