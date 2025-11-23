import Link from 'next/link';
import Image from 'next/image';
import { FaEye } from 'react-icons/fa';
import DeleteRoomButton from './DeleteRoomButton';

const MyRoomCard = ({ room }) => {
    const bucketID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ROOMS;
    const projectID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;

    const imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${bucketID}/files/${room.image}/view?project=${projectID}`;

    const imageSrc = room.image ? imageUrl : '/images/no-image.jpg';

    return (
        <div className="bg-white shadow rounded-lg p-4 mt-4 flex flex-col sm:flex-row justify-between items-center">
            <Image width={ 400 } height={ 100 } src={ imageSrc } alt={ room.name} className="w-full sm:w-32 sm:h-32 mb-3 sm:mb-0 object-cover rounded-lg" />
            <div className="flex flex-col">
                <h4 className="text-lg font-semibold">{ room.name }</h4>
            </div>
            <div className="flex flex-col sm:flex-row w-full sm:w-auto sm:space-x-2 mt-2 sm:mt-0">
                <Link href={ `/rooms/${room.$id}` } className="bg-blue-500 text-white px-4 py-2 rounded mb-2 sm:mb-0 w-full sm:w-auto text-center hover:bg-blue-700">
                    <FaEye className="inline mr-1" />
                    View
                </Link>

                <DeleteRoomButton roomID={ room.$id } />
            </div>
        </div>
    );
}
 
export default MyRoomCard;