import { observable, action } from 'mobx';

const BASE_URL = 'http://10.0.0.218:8080';

class AppStore {
  @observable isSignedIn = false;
  @observable username = '';
  @observable password = '';

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
}

const appStore = new AppStore();
export default appStore;