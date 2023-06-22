import { createContext } from "react";
import {io} from 'socket.io-client';
import Peer from 'simple-peer';
const socket = io('http://localhost:8080');

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
    const [stream, setStream] = useState(null);
    const [id, setId] = useState('');
    const [call, setCall] = useState({});
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);

    const myVideo = useRef();
    console.log(id);
    // initialize socket
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                myVideo.current.srcObject = currentStream;
                
                socket.on('connect', (id) => setId(id));

                socket.on('call-user', ({ from, name: callerName, signal }) => {
                    setCall({ isReceivedCall: true, from, name: callerName, signal });
                });
            }).catch((err) => {
                console.log(err);
            });
    }, []);

    const answerCall = () => {
        setCallAccepted(true);

    };
    const callUser = () => {};
    const leaveCall = () => {
        setCallEnded(true);
       
    };

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}

export default SocketContext;