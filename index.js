import 'babel-polyfill'
import fetch from 'isomorphic-fetch'
import makeStore from './src/store';
import {startServer} from './src/server';
import { refreshServerData } from './src/core'
import { sqlGetHoles, sqlGetGolfers, sqlGetGolfersNotScored, sqlGetCurrentRoundId, sqlGetCurrentRoundMessages } from './src/apicalls'
import { DATABASE_SERVER, API_NAME, GET_HOLES, GET_GOLFERS } from './constants/globals'

export const store = makeStore();
startServer(store);


console.log("server is running...")


//store.dispatch({type: 'NEXT'});

sqlGetGolfers()
sqlGetGolfersNotScored()
sqlGetHoles()
sqlGetCurrentRoundId()
sqlGetCurrentRoundMessages()


//setInterval(function(){
//  store.dispatch({ type: 'REFRESH_SERVER_DATA' });
//}, 3000);
