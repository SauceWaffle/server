import {List, Map} from 'immutable';
import {sqlGetGolfers, sqlGetHoles, sqlGetCurrentRoundId, sqlRegisterTo, sqlSendMessage, sqlGetRoundData, sqlGetAppRegistration,
        sqlGetRoundMessages, sqlGetCurrentRoundMessages, sqlSaveGolferScore, sqlAddNewGolfer, sqlSaveGolferInfo,
        sqlGetManageGolferRounds} from './apicalls'

export const INITIAL_STATE = Map();


export function getHoles(state, holes) {
  const allholes = List(holes);
  return state.set('holes', allholes);
}

export function getGolfers(state, golfers) {
  const allgolfers = List(golfers);
  return state.set('golfers', allgolfers);
}

export function getGolfersNotScored(state, golfers) {
  const allgolfers = List(golfers);
  return state.set('golfersnotscored', allgolfers);
}






export function setCurrentRoundId(state, round_id) {
  sqlGetRoundData(round_id[0]._id);
  return state.set('currentRound', round_id[0]._id);;
}

export function getRoundData(state, round_id) {
  sqlGetRoundData(round_id);
  return state;
}

export function setRoundData(state, round_id, round_data) {
  return state.setIn(['round_data', 'round_'+round_id], round_data);
}

export function getClientManageGolferRounds(state, client_id, golfer_id) {
  sqlGetManageGolferRounds(client_id, golfer_id);
  return state;
}

export function setClientManageGolferRounds(state, client_id, round_data) {
  const roundData = List(round_data);
  const newClientState = state.getIn(['clients', client_id]);

  newClientState['golfermanagerounds'] = roundData;
  return state.updateIn(['clients', client_id], clientstate => newClientState)
}



export function registerToGolfer(state, client_id, golfer_id) {
  sqlRegisterTo(client_id, golfer_id);
  return state;
}

export function getAppRegistration(state, client_id) {
  sqlGetAppRegistration(client_id);
  return state;
}

export function registerFromSql(state, registration) {
  return state.setIn(['clients', registration[0].client_id], registration[0]);
}



export function addNewGolfer(state) {
  sqlAddNewGolfer();
  return state;
}

export function saveGolferInfo(state, golfer_id, field, value){
  sqlSaveGolferInfo(golfer_id, field, value);
  return state;
}




export function setMyGolfers(state, client_id, golfer_id = "none") {
  const allmygolfers = state.getIn(['mygolfers', client_id]) || [];
  const alreadythere = (allmygolfers) ? allmygolfers.filter(val => Map(val).get('_id') == golfer_id) : null;

  if ( golfer_id != "none" && alreadythere.length == 0 ) {
    const thegolfers = state.get('golfers');

    thegolfers.map((golfer) => { if( golfer['_id'] == golfer_id) { allmygolfers.push(golfer) }  })
  }

  return state.updateIn(['mygolfers', client_id], val => allmygolfers);
}


export function removeFromMyGolfers(state, client_id, golfer_id) {
    const thegolfers = state.getIn(['mygolfers', client_id]);
    return state.updateIn(['mygolfers', client_id], val => thegolfers.filter(val => Map(val).get('_id') != golfer_id));
}









export function getRoundMessages(state, round_id = state.get('currentRound')) {
  if (round_id) { sqlGetRoundMessages(round_id); return state; }
  else { sqlGetCurrentRoundMessages(); return state; }
}

export function setRoundMessages(state, messages = state.get('messages'), newMessage) {
  const allmessages = messages;

  if (newMessage) {
    allmessages.push(newMessage[0])
  }

  return state.update('messages', val => allmessages);
}

export function saveMessage(state, round_id, golfer_id, message) {
  sqlSendMessage(round_id, golfer_id, message);
  return state;
}



export function saveGolferScore(state, round_id, golfer_id, hole_id, score, client_id, from_where) {
  sqlSaveGolferScore(round_id, golfer_id, hole_id, score, client_id, from_where);
  return state;
}









export function setEntries(state, surface, hills, distance) {
  const surflist = List(surface);
  const hilllist = List(hills);
  const distlist = List(distance);
  return state.set('surface', surflist)
              .set('hills', hilllist)
              .set('distance', distlist)
              .set('initialEntries', surflist);
}

function getWinners(vote) {
  if (!vote) return [];
  const [one, two] = vote.get('pair');
  const oneVotes = vote.getIn(['tally', one], 0);
  const twoVotes = vote.getIn(['tally', two], 0);
  if      (oneVotes > twoVotes)  return [one];
  else if (oneVotes < twoVotes)  return [two];
  else                           return [one, two];
}

export function next(state, round = state.getIn(['vote', 'round'], 0)) {
  const surfentries = state.get('surface')
                       .concat(getWinners(state.get('vote')));

  const hillentries = state.get('hills')
                        .concat(getWinners(state.get('vote')));

  const distentries = state.get('distance')
                       .concat(getWinners(state.get('vote')));
  // if (entries.size === 1) {
  //   return state.remove('vote')
  //               .remove('entries')
  //               .set('winner', entries.first());
  // } else {
    return state.merge({
      vote: Map({
        round: round + 1,
        surface: surfentries,
        hills: hillentries,
        distance: distentries
      }),
      entries: surfentries//.skip(2)
    });
  // }
}

export function restart(state) {
  const round = state.getIn(['vote', 'round'], 0);
  return next(
    state.set('entries', state.get('initialEntries'))
         .remove('vote')
         .remove('winner'),
    round
  );
}

export function removeMyVotes(state, voter) {
  const surfVote = state.getIn(['vote', 'votes', 'surface', voter]);
  const hillVote = state.getIn(['vote', 'votes', 'hills', voter]);
  const distVote = state.getIn(['vote', 'votes', 'distance', voter]);
  if (surfVote) {
    state = state.updateIn(['vote', 'tally', surfVote], t => t - 1)
                    .removeIn(['vote', 'votes', 'surface', voter]);
  }
  if (hillVote) {
    state = state.updateIn(['vote', 'tally', hillVote], t => t - 1)
                    .removeIn(['vote', 'votes', 'hills', voter]);
  }
  if (distVote) {
    state = state.updateIn(['vote', 'tally', distVote], t => t - 1)
                    .removeIn(['vote', 'votes', 'distance', voter]);
  }

  return state;
}

function removePreviousVote(voteState, group, voter) {
  const previousVote = voteState.getIn(['votes', group, voter]);
  if (previousVote) {
    return voteState.updateIn(['tally', previousVote], t => t - 1)
                    .removeIn(['votes', group, voter]);
  } else {
    return voteState;
  }
}

function addVote(voteState, group, entry, voter) {
  if (voteState.get(group).includes(entry)) {
    return voteState.updateIn(['tally', entry], 0, t => t + 1)
                    .setIn(['votes', group, voter], entry);
  } else {
    return voteState;
  }
}

export function vote(voteState, group, entry, voter) {
  return addVote(
    removePreviousVote(voteState, group, voter),
    group,
    entry,
    voter
  );
}



export function refreshServerData(state) {
  sqlGetGolfers()
  sqlGetHoles()
  sqlGetCurrentRoundId()
  sqlGetCurrentRoundMessages()
  return state;
}
