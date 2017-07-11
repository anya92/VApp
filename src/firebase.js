import * as firebase from 'firebase';

import config from './config';

export const firebaseApp = firebase.initializeApp(config);

export const userRef = firebase.database().ref('users');
export const poolRef = firebase.database().ref('pools');
