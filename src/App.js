import {useEffect, useRef, useState} from "react";
import TRTC from "trtc-js-sdk";
import {generateUserSign} from "./utils";

const App = () => {
  const [userId, setUserId] = useState('');
  const [roomId, setRoomId] = useState('');

  const clientRef = useRef(null)

  useEffect(() => {
  }, []);

  const create = async () => {
    const {userSig} = generateUserSign(userId);

    clientRef.current = TRTC.createClient({
      mode: 'rtc',
      sdkAppId: Number(process.env.REACT_APP_SDK_APP_ID),
      userId,
      userSig
    });

    clientRef.current.on('stream-added', event => {
      const remoteStream = event.stream;
      console.log('远端流增加: ' + remoteStream.getId());
      //订阅远端流
      clientRef.current.subscribe(remoteStream);
    })
    clientRef.current.on('stream-subscribed', event => {
      const remoteStream = event.stream;
      console.log('远端流订阅成功：' + remoteStream.getId());
      // 播放远端流
      remoteStream.play('remote-video');
    });
  }

  const join = async () => {
    try {
      await clientRef.current.join({ roomId: Number(roomId) })
      console.log('进房成功')
    } catch (e) {
      console.error('进房失败' + e)
    }
  }

  const publish = async () => {
    let localStream;
    try {
      localStream = TRTC.createStream({ userId, audio: true, video: true });
      await localStream.initialize()
      console.log('初始化本地流成功');
      await localStream.play(document.querySelector('#local-video'));
    } catch (e) {
      console.error('初始化本地流失败 ' + e)
    }

    try {
      await clientRef.current.publish(localStream)
      console.log('本地流发布成功');
    } catch (e) {
      console.error('本地流发布失败 ' + e)
    }
  }

  const end = async () => {
    try {
      await clientRef.current.leave()
    } catch (e) {
      console.error('退房失败' + e)
    }
  }

  return (
    <div className="App">
      <input placeholder="userId" value={userId} onChange={e => setUserId(e.target.value)} type="text"/>
      <input placeholder="roomId" value={roomId} onChange={e => setRoomId(e.target.value)} type="text"/>
      <button onClick={create}>创建</button>
      <button onClick={join}>加入</button>
      <button onClick={publish}>发布</button>
      <div id="local-video" style={{ height: 300, width: 300 }} />
      <div id="remote-video" style={{ height: 300, width: 300 }} />
    </div>
  );
}

export default App;
