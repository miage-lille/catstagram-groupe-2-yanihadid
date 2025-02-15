import { Picture } from './types/picture.type';
import { Failure, Loading, Success } from './types/api.type';

export const loading = (): Loading => ({ status: 'loading' });
export const success = (payload: Picture[]): Success => ({ status: 'success', data: payload });
export const failure = (error: string): Failure => ({ status: 'failure', error });