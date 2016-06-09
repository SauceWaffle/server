import 'babel-polyfill'
import fetch from 'isomorphic-fetch'
import makeStore from './src/store';
import {startServer} from './src/server';
import { refreshServerData } from './src/core'
import { DATABASE_SERVER, API_NAME, GET_HOLES, GET_GOLFERS } from './constants/globals'

export const store = makeStore();
startServer(store);


console.log("server is running...")


//store.dispatch({type: 'NEXT'});

refreshServerData()


//setInterval(function(){
//  store.dispatch({ type: 'REFRESH_SERVER_DATA' });
//}, 3000);
