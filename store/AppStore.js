import { observable, action } from 'mobx';
import _ from 'lodash';

const BASE_URL = 'http://10.0.0.218:8080';

class AppStore {
  @observable isSignedIn = false;
  @observable username = '';
  @observable password = '';

  @observable isLoadingApplications = true;
  @observable applications = {
  };

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

    this.isLoadingApplications = true;
    Promise.all([
      this.getApplicationsForTerm(currentWorkTerm),
      this.getApplicationsForTerm(currentJobSearchTerm)
    ]).then(() => {
      this.isLoadingApplications = false;
    })
  }

  @action getApplicationsForTerm = (term) => {
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
        this.applications[term] = _.merge(this.applications[term], response.jobs);
      }
    })
    .catch(error => {
      console.warn('Error getting applications for term: ' + term);
    });
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