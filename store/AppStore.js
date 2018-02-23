import { observable, action } from 'mobx';

class AppStore {
  @observable isSignedIn = false;
  @observable userName = '';
  
  @action updateUserName = (newUserName) => {
    this.userName = newUserName;
  }
}

const appStore = new AppStore();
export default appStore;