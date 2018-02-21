import { observable, action } from 'mobx';

class AppStore {
  @observable isSignedIn = false;
  @observable userEmail = "munaz@google.com";
  
  @action updateEmail = (newEmail) => {
    this.userEmail = newEmail;
  }
}

const appStore = new AppStore();
export default appStore;