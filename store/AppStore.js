import { observable, action } from 'mobx';

class AppStore {
  @observable isSignedIn = false;
  @observable username = '';
  @observable password = '';
  
  @action login = (newUsername, newPassword, cb) => {
    this.username = newUsername;
    this.password = newPassword;
    this.isSignedIn = true;

    if (cb) {
      cb();
    }
  }

  @action logout = () => {
    this.isSignedIn = false;
    this.username = '';
    this.password = '';
  }
}

const appStore = new AppStore();
export default appStore;