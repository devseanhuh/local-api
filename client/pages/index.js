import MsgList from '../components/MsgList';
import fetcher from '../fetcher';

const Home = ({ smsgs, users }) => {
  return (
    <>
      <h1>Home</h1>
      <MsgList smsgs={smsgs} users={users} />
    </>
  );
};

export const getServerSideProps = async () => {
  // SSR을 사용하여 최초에 렌더링이 한 번만 일어나게 함
  const smsgs = await fetcher('get', '/messages');
  const users = await fetcher('get', '/users');
  return {
    props: { smsgs, users },
  };
};

export default Home;
