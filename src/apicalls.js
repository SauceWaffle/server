require('es6-promise').polyfill()
import fetch from 'isomorphic-fetch'
import { DATABASE_SERVER, API_NAME } from '../constants/globals'
import * as actionCreators from './reducer'
import {Map,List} from 'immutable'
import {store} from '../index'



export function sqlGetHoles() {
  return fetch(`http://${DATABASE_SERVER}/${API_NAME}?query=allholes`)
          .then(response => { return response.json(); })
          .then(json => { store.dispatch({ type: 'GET_HOLES', holes: json });
                          console.log('Holes Loaded.');
                          return Promise.resolve()
                        })
}


export function sqlGetGolfers() {
  return fetch(`http://${DATABASE_SERVER}/${API_NAME}?query=allgolfers`)
          .then(response => { return response.json(); })
          .then(json => { store.dispatch({ type: 'GET_GOLFERS', golfers: json });
                          console.log('Golfers Loaded.');
                          return Promise.resolve()
                        })
}




/************* GET ALL CURRENT ROUND INFO **********/


export function sqlGetCurrentRoundId() {
    return fetch(`http://${DATABASE_SERVER}/${API_NAME}?query=currentroundid`)
            .then(response => { return response.json(); })
            .then(json => { store.dispatch({ type: 'SET_CURRENT_ROUND_ID', round_id: json });
                            console.log('Current Round ID Found.');
                            return Promise.resolve()
                          })
}


export function sqlGetRoundData(round_id) {
    return fetch(`http://${DATABASE_SERVER}/${API_NAME}?query=getRoundData&roundid=${round_id}`)
            .then(response => { return response.json(); })
            .then(json => { store.dispatch({ type: 'SET_ROUND_DATA', round_id, round_data: json });
                            console.log('Round Data Retrieved.');
                            return Promise.resolve()
                          })
}





/************** APP REGISTRATION ***************/


export function sqlRegisterTo(client_id, golfer_id) {
  return fetch(`http://${DATABASE_SERVER}/${API_NAME}?query=registerTo&clientid=${client_id}&golferid=${golfer_id}`)
          .then(response => { return response.json(); })
          .then(json => { console.log('Registration Set');
                          store.dispatch({ type: 'GET_APP_REGISTRATION', client_id });
                          return Promise.resolve()
                        })
}


export function sqlGetAppRegistration(client_id) {
  return fetch(`http://${DATABASE_SERVER}/${API_NAME}?query=getRegisteredTo&clientid=${client_id}`)
          .then(response => { if (response.status >= 400) { console.log('getRegisteredTo - BAD'); return Promise.resolve(); } else { console.log('getRegisteredTo - GOOD'); return response.json(); } })
          .then(json => { console.log('Registration Retrieved.');
                          store.dispatch({ type: 'SET_APP_REGISTRATION', registration: json });
                          return Promise.resolve();
                        })
}




/******** GOLFER MANAGEMENT ***************/

export function sqlAddNewGolfer() {
  return fetch(`http://${DATABASE_SERVER}/${API_NAME}?query=addNewGolfer`)
          .then(response => { return response.json(); })
          .then(json => { console.log(`Added Golfer`);
                          sqlGetGolfers();
                          return Promise.resolve()
                        })
}

export function sqlSaveGolferInfo(golfer_id, field, value) {
  return fetch(`http://${DATABASE_SERVER}/${API_NAME}?query=saveGolferInfo&golferid=${golfer_id}&field=${field}&value=${value}`)
          .then(response => { return response.json(); })
          .then(json => { console.log(`Golfer ${golfer_id} ${field} updated to ${value}`);
                          sqlGetGolfers();
                          return Promise.resolve()
                        })
}


export function sqlGetManageGolferRounds(client_id, golfer_id) {
  return fetch(`http://${DATABASE_SERVER}/${API_NAME}?query=getManageGolferRounds&golferid=${golfer_id}`)
          .then(response => { return response.json(); })
          .then(json => { console.log(`Got Golfer ${golfer_id} Rounds`);
                          store.dispatch({ type: 'SET_MANAGE_GOLFER_ROUNDS', client_id, round_data: json });
                          return Promise.resolve()
                        })
}








/******* MESSAGE BOARD **********/

export function sqlSendMessage(round_id, golfer_id, message) {
  return fetch(`http://${DATABASE_SERVER}/${API_NAME}?query=sendMessage&roundid=${round_id}&golferid=${golfer_id}&message=${message}`)
          .then(response => { return response.json(); })
          .then(json => { console.log(`Message Sent by ${golfer_id}`);
                          store.dispatch({ type: 'SET_ROUND_MESSAGES', newMessage: json });
                          return Promise.resolve()
                        })
}

export function sqlGetRoundMessages(round_id) {
  return fetch(`http://${DATABASE_SERVER}/${API_NAME}?query=getRoundMessages&roundid=${round_id}`)
          .then(response => { if (response.status >= 400) { console.log('getRoundMessages - BAD'); return Promise.resolve(); } else { /*console.log('getRoundMessages - GOOD');*/ return response.json(); } })
          .then(json => { /*console.log('Messages Retrieved.');*/
                          store.dispatch({ type: 'SET_ROUND_MESSAGES', messages: json });
                          return Promise.resolve();
                        })
}

export function sqlGetCurrentRoundMessages() {
  return fetch(`http://${DATABASE_SERVER}/${API_NAME}?query=getCurrentRoundMessages`)
          .then(response => { if (response.status >= 400) { console.log('getCurrentRoundMessages - BAD'); return Promise.resolve(); } else { /*console.log('getCurrentRoundMessages - GOOD');*/ return response.json(); } })
          .then(json => { /*console.log('Messages Retrieved.');*/
                          store.dispatch({ type: 'SET_ROUND_MESSAGES', messages: json });
                          return Promise.resolve();
                        })
}




/************ SCORING ***************/


export function sqlSaveGolferScore(round_id, golfer_id, hole_id, score, client_id, from_where) {
  return fetch(`http://${DATABASE_SERVER}/${API_NAME}?query=saveScore&roundid=${round_id}&golferid=${golfer_id}&holeid=${hole_id}&score=${score}`)
          .then(response => { return response.json(); })
          .then(json => { console.log(`Golfer ${golfer_id} saved score, hole: ${hole_id}, score: ${score}`);
                          store.dispatch({ type: 'GET_ROUND_DATA', round_id });
                          (from_where === "manage") ? sqlGetManageGolferRounds(client_id, golfer_id) : "";
                          (from_where === "manage") ? sqlGetGolfers() : "";
                          return Promise.resolve()
                        })
}
