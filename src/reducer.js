import {getHoles, getGolfers, setCurrentRoundId, getRoundData, setRoundData, getAppRegistration, registerFromSql, registerToGolfer,
        getRoundMessages, setRoundMessages, saveMessage, saveGolferScore, refreshServerData, addNewGolfer, saveGolferInfo,
        INITIAL_STATE} from './core';

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
  case 'SET_ENTRIES':
    return setEntries(state, action.surface, action.hills, action.distance);
  case 'GET_HOLES':
    return getHoles(state, action.holes);
  case 'GET_GOLFERS':
    return getGolfers(state, action.golfers);


  case 'SET_CURRENT_ROUND_ID':
    return setCurrentRoundId(state, action.round_id);
  case 'GET_ROUND_DATA':
    return getRoundData(state, action.round_id);
  case 'SET_ROUND_DATA':
    return setRoundData(state, action.round_id, action.round_data);

  case 'GET_APP_REGISTRATION':
    return getAppRegistration(state, action.client_id);
  case 'SET_APP_REGISTRATION':
    return registerFromSql(state, action.registration);
  case 'REGISTER_TO_GOLFER':
    return registerToGolfer(state, action.client_id, action.golfer_id);

  case 'GET_ROUND_MESSAGES':
    return getRoundMessages(state, action.round_id);
  case 'SET_ROUND_MESSAGES':
    return setRoundMessages(state, action.messages, action.newMessage);
  case 'ADD_NEW_MESSAGE':
    return saveMessage(state, action.round_id, action.golfer_id, action.message);


  case 'ADD_NEW_GOLFER':
    return addNewGolfer(state);
  case 'SAVE_GOLFER_INFO':
    return saveGolferInfo(state, action.golfer_id, action.field, action.value);


  case 'SEND_GOLFER_SCORE':
    return saveGolferScore(state, action.round_id, action.golfer_id, action.hole_id, action.score);


  case 'REFRESH_SERVER_DATA':
    return refreshServerData(state);

  case 'NEXT':
    return next(state);
  case 'RESTART':
    return restart(state);
  case 'RESET_MY_VOTE':
    return removeMyVotes(state, action.voter);
  case 'VOTE':
    return state.update('vote',
                        voteState => vote(voteState, action.group, action.entry, action.clientId));
  }
  return state;
}
