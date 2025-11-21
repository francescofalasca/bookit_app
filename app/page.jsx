import RoomCard from '@/components/RoomCard';
import Heading from '@/components/Heading';
import rooms from '@/data/rooms.json';

export default function Home({ room }) {
  return (
    <>
      <Heading title="Available Rooms" />
      { rooms.length > 0 ? (
        rooms.map(room => <RoomCard key={ room.image } room={ room } />)
      ) : (
        <p>No rooms available at the moment</p>
      ) }
    </>
  );
}
