import io from 'socket.io-client';
import {baseUrl} from '../routes/routes';

const socket = io(baseUrl);

export default socket;
