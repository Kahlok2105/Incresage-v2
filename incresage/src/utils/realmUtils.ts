import { QI_REALMS } from "../constants/qiRealms";
import type { QiState } from "../types/state";

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