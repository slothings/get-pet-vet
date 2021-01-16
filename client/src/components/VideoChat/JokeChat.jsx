// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";

// eslint-disable-next-line no-unused-vars
const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

// eslint-disable-next-line no-unused-vars
const Row = styled.div`
  display: flex;
  width: 100%;
`;

// eslint-disable-next-line no-unused-vars
const Video = styled.video`
  border: 1px solid blue;
  width: 50%;
  height: 50%;
`;


// eslint-disable-next-line no-unused-vars
function NameSelf({
  setName,
}) {
  const inputRef = useRef();

  function onClick() {
    setName(inputRef.current.value);
  }

  return (
    <div> Please Enter Your Name
      <input id="caller-name" type="text" placeholder="your name goes here." ref={inputRef} />
      <button onClick={onClick} >Submit</button>
    </div>
  );
}

function Joke() {
  const [yourID, setYourID] = useState("");
  const [users, setUsers] = useState({});
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callerName, setCallerName] = useState(null);
  const [initiatorName, setInitiatorName] = useState(null);

  const userVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();

  useEffect(() => {
    socket.current = io.connect("/");

    // checks if user will allow video/audio -> run on load
    navigator
      .mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(stream => {
        setStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
      });

    socket.current.on("yourID", (id) => {
      setYourID(id);
    });

    socket.current.on("allUsers", (users) => {
      setUsers(users);
    });

    socket.current.on("hey", (data) => {
      console.log(data);
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });
  }, []);

  useEffect(() => {
    socket.current.emit('nameSelf', { id: yourID, username: initiatorName });
  }, [initiatorName]);

  function callPeer(id) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", data => {
      socket.current.emit("callUser", { userToCall: id, signalData: data, from: yourID });
    });

    peer.on("stream", stream => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.current.on("callAccepted", signal => {
      setCallAccepted(true);
      peer.signal(signal);
    });
  }

  function acceptCall() {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", data => {
      socket.current.emit("acceptCall", { signal: data, to: caller });
    });

    peer.on("stream", stream => {
      partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
  }

  function handleInitiatorname(value) {
    setInitiatorName(value);
  }

  // eslint-disable-next-line no-unused-vars
  function handleCallerName(target) {
    setCallerName(target.value);
  }

  return (
    <Container>
      <Row>
        {!initiatorName && (<NameSelf setName={handleInitiatorname} />)}
        <column>
          <h1>{initiatorName}</h1>
          {stream && (
            <Video playsInline muted ref={userVideo} autoPlay />
          )}
        </column>
        <column>
          <h1>{callerName}</h1>
          {callAccepted && (
            <Video playsInline ref={partnerVideo} autoPlay />
          )}
        </column>
      </Row>
      <Row>
        {Object.keys(users).map(key => {
          if (key === yourID) {
            return null;
          }
          return (
            <button onClick={() => callPeer(key)}>Call {key}</button>
          );
        })}
      </Row>
      <Row>
        {receivingCall && (
          <div>
            <h1>{caller} is calling you</h1>
            <button onClick={acceptCall}>Accept</button>
          </div>
        )}
      </Row>
    </Container>
  );
}

export default Joke;