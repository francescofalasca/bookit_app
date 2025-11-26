'use client';

import cancelBooking from "@/app/actions/cancelBooking";
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const DeleteBookingButton = ({ bookingID }) => {
    const router = useRouter();

    const handleCancelClick = async () => {
        const confirmed = window.confirm('Are you sure you want to cancel this booking?');

        if (!confirmed) {
            return;
        }

        try {
            const result = await cancelBooking(bookingID);

            if (result.success) {
                toast.success('Booking deleted successfully.');
                // Refresh the page to reflect the deletion
                router.refresh();
            } else {
                toast.error(result.error || 'Failed to delete booking.');
            }
        } catch (error) {
            console.error('Failed to delete booking.', error);
            toast.error('Failed to delete booking.');
        }
    }

    return (
        <button onClick={ handleCancelClick } className="bg-red-500 text-white px-4 py-2 rounded w-full sm:w-auto text-center hover:bg-red-700">
            Cancel Booking
        </button>
    );
}
 
export default DeleteBookingButton;