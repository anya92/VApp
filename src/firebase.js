import * as firebase from 'firebase';

import config from './config';

export const firebaseApp = firebase.initializeApp(config);