import MsgItem from './MsgItem';
import MsgInput from './MsgInput';
import { useEffect, useRef, useState } from 'react';
import fetcher from '../fetcher';
import { useRouter } from 'next/router';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

const userIds = ['sean', 'moon'];
const getRandomUserId = () => userIds[Math.round(Math.random())];
const originalMsgs = Array(50)
  .fill(0)
  .map((_, i) => ({
    id: 50 - i,
    userId: getRandomUserId(),
    timestamp: 1636860746000 + i * 1000,
    text: `mock test - ${50 - i}`,
  }));

const MsgList = ({ smsgs, users }) => {
  const {
    query: { userId = '' },
  } = useRouter();
  const [msgs, setMsgs] = useState(smsgs);
  const [editingId, setEditingId] = useState(null);
  const fetchMoreEl = useRef(null);
  const intersecting = useInfiniteScroll(fetchMoreEl);
  const [hasNext, setHasNext] = useState(true);
  const onCreate = async text => {
    const newMsg = await fetcher('post', '/messages', { text, userId });
    if (!newMsg) throw new Error('작업 도중 문제가 발생하였습니다.');
    setMsgs(msgs => [newMsg, ...msgs]);
  };
  const onUpdate = async (text, id) => {
    const newMsg = await fetcher('put', `/messages/${id}`, { text, userId });
    if (!newMsg) throw new Error('작업 도중 문제가 발생하였습니다.');
    setMsgs(msgs => {
      const targetIdx = msgs.findIndex(msg => msg.id === id);
      if (targetIdx < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIdx, 1, newMsg);
      return newMsgs;
    });
    doneEdit();
  };
  const doneEdit = () => setEditingId(null);
  const onDelete = async id => {
    const receivedId = await fetcher('delete', `/messages/${id}`, {
      params: { userId },
    });
    setMsgs(msgs => {
      const targetIdx = msgs.findIndex(msg => msg.id === receivedId + '');
      if (targetIdx < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIdx, 1);
      return newMsgs;
    });
  };

  const getMsgs = async () => {
    const newMsgs = await fetcher('get', '/messages', {
      params: { cursor: msgs[msgs.length - 1]?.id || '' },
    });
    if (newMsgs.length === 0) {
      setHasNext(false);
      return;
    }
    setMsgs(msgs => [...msgs, ...newMsgs]);
  };

  useEffect(() => {
    if (intersecting && hasNext) getMsgs();
  }, [intersecting]);

  // console.log(JSON.stringify(originalMsgs));
  return (
    <>
      {userId && <MsgInput mutate={onCreate} />}
      <ul className="messages">
        {msgs?.map(v => (
          <MsgItem
            key={v.id}
            {...v}
            onUpdate={onUpdate}
            isEditing={editingId === v.id}
            startEdit={() => setEditingId(v.id)}
            onDelete={() => onDelete(v.id)}
            myId={userId}
            user={users[v.userId]}
          />
        ))}
      </ul>
      <div ref={fetchMoreEl} />
    </>
  );
};

export default MsgList;
