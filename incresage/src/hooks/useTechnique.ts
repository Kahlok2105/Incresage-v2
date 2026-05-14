import type { Dispatch, SetStateAction} from 'react';
import type { PlayerState } from '../types/state';

export function useTechnique(
    setState: Dispatch<SetStateAction<PlayerState>>,
){
    function selectTechnique(techniqueId: string){
        setState((previous) => {
            const ownsTechnique = previous.qi.techniques.some(
                (technique) => technique.id === techniqueId,
            );

            if(!ownsTechnique) return previous; // Ignore if player doesn't own the technique

            return {
                ...previous,
                qi:{
                    ...previous.qi,
                    activeTechniqueId: techniqueId,
                }
            }
        })
    }
    
    return{
        selectTechnique,
    }
}