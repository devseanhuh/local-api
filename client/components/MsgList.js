import MsgItem from "./MsgItem";
import MsgInput from "./MsgInput";
import { useState } from "react";

const userIds = ["sean", "moon"];
const getRandomUserId = () => userIds[Math.round(Math.random())];
const originalMsgs = Array(50)
  .fill(0)
  .map((_, i) => ({
    id: 50 - i,
    userId: getRandomUserId(),
    timestamp: 1636860746000 + i * 1000,
    text: `mock test - ${50 - i}`,
  }));

const MsgList = () => {
  const [msgs, setMsgs] = useState(originalMsgs);
  const [editingId, setEditingId] = useState(null);
  const onCreate = (text) => {
    const newMsgs = {
      id: msgs.length + 1,
      userId: getRandomUserId(),
      timestamp: Date.now(),
      text,
    };
    setMsgs((msgs) => [newMsgs, ...msgs]);
  };
  const onUpdate = (text, id) => {
    setMsgs((msgs) => {
      const targetIdx = msgs.findIndex((msg) => msg.id === id);
      if (targetIdx < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIdx, 1, {
        ...msgs[targetIdx],
        text,
      });
      return newMsgs;
    });
    doneEdit();
  };
  const doneEdit = () => setEditingId(null);
  const onDelete = (id) => {
    setMsgs((msgs) => {
      const targetIdx = msgs.findIndex((msg) => msg.id === id);
      if (targetIdx < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIdx, 1);
      return newMsgs;
    });
  };
  return (
    <>
      <MsgInput mutate={onCreate} />
      <ul className="messages">
        {msgs.map((v) => (
          <MsgItem
            key={v.id}
            {...v}
            onUpdate={onUpdate}
            isEditing={editingId === v.id}
            startEdit={() => setEditingId(v.id)}
            onDelete={() => onDelete(v.id)}
          />
        ))}
      </ul>
    </>
  );
};

export default MsgList;
