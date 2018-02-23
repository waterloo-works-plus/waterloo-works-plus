import { AsyncStorage } from 'react-native';

const StorageKeys = {
  username: '@AppStore:username',
  password: '@AppStore:password'
}

export class Storage {

  static updateUserCredentials(username, password, err) {
    AsyncStorage.multiSet(
      [
        [StorageKeys.username, username],
        [StorageKeys.password, password]
      ],
      (errors) => {
        if (errors) {
          console.warn('Error updating user credentials', errors);
          err && err(errors);
        }
      }
    );
  }

  static getUserCredentials(err, cb) {
    AsyncStorage.multiGet(
      [StorageKeys.username, StorageKeys.password],
      (errors, data) => {
        if (errors) {
          console.warn('Error getting user credentials', errors);
          err && err(errors);
        }
        if (cb) {
          return cb(data[0][1], data[1][1]);
        }
      }
    )
  }

  static clearUserCredentials(err) {
    AsyncStorage.multiRemove(
      [StorageKeys.username, StorageKeys.password],
      (errors) => {
        if (errors) {
          console.warn('Error removing user credentials');
          err && error(errors);
        }
      }
    )
  }

}