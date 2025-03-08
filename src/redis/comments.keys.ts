import { types } from 'src/enums/react.to.types';
/*
    KEY USED TO STORE COMMENT LIKES IN REDIS 
*/
export const COMMENT_LIKES_KEY = (
    prefix: types,
    id: string,
) => `${prefix}:likes:${id}`;

/*
    KEY USED TO STORE COMMENT DISLIKES IN REDIS 
*/
export const COMMENT_DISLIKES_KEY = (
    prefix: types,
    id: string,
) => `${prefix}:dislikes:${id}`;

