import { QI_REALMS } from "../constants/qiRealms";
import type { BodyState, QiState } from "../types/state";
import { BODY_REALMS } from "../constants/bodyRealms";

export function getQiRealm(qi: QiState){
    return QI_REALMS[qi.realmIndex];
}

export function getQiStage(qi:QiState){
    return getQiRealm(qi).stages[qi.stage];
}

export function getQiRealmName(qi: QiState){
    return getQiRealm(qi).name;
}

export function getQiStageLabel(qi: QiState){
    return getQiStage(qi).label;
}

export function isFinalQiStage(qi: QiState){
    const finalRealmIndex = QI_REALMS.length - 1;
    const finalStageIndex = QI_REALMS[finalRealmIndex].stages.length - 1;

    return qi.realmIndex === finalRealmIndex && qi.stage === finalStageIndex;
}


//We are encoding the rules
//Asking the current realm, how many stages we have and 
//Checking if we can go to the next stage, if not we stay in the current stage

export function getNextQiPosition(qi: QiState){
    if (isFinalQiStage(qi)){
        return {
            realmIndex: qi.realmIndex,
            stage: qi.stage,
        }
    }

    const currentRealm = getQiRealm(qi);
    const isLastStageInRealm = qi.stage === currentRealm.stages.length - 1;

    if (!isLastStageInRealm){
        return {
            realmIndex: qi.realmIndex,
            stage: qi.stage + 1,
        }
    }

    return {
        realmIndex: qi.realmIndex + 1,
        stage: 0,
    }
}

// Similar functions for Body Realms

export function getBodyRealm(body: BodyState) {
  return BODY_REALMS[body.realmIndex];
}

export function getBodyStage(body: BodyState) {
  return getBodyRealm(body).stages[body.stage];
}

export function getBodyRealmName(body: BodyState) {
  return getBodyRealm(body).name;
}

export function getBodyStageLabel(body: BodyState) {
  return getBodyStage(body).label;
}

export function isFinalBodyStage(body: BodyState) {
  const finalRealmIndex = BODY_REALMS.length - 1;
  const finalStageIndex = BODY_REALMS[finalRealmIndex].stages.length - 1;

  return body.realmIndex === finalRealmIndex && body.stage === finalStageIndex;
}

export function getNextBodyPosition(body: BodyState) {
  if (isFinalBodyStage(body)) {
    return {
      realmIndex: body.realmIndex,
      stage: body.stage,
    };
  }

  const currentRealm = getBodyRealm(body);
  const isLastStageInRealm = body.stage === currentRealm.stages.length - 1;

  if (!isLastStageInRealm) {
    return {
      realmIndex: body.realmIndex,
      stage: body.stage + 1,
    };
  }

  return {
    realmIndex: body.realmIndex + 1,
    stage: 0,
  };
}