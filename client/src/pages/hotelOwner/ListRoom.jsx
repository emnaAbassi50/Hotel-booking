import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Title from '../../components/Title'
import { useAppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import UpdateRoom from './UpdateRoom'

export const ListRoom = () => {

  const [rooms, setRooms] = useState([])
  const { axios, getToken, user, currency, showRoomUpdate, setShowRoomUpdate, setUpdatedRoomId } = useAppContext()

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get('/api/rooms/owner', { headers: { Authorization: `Bearer ${await getToken()}` } })
      if (data.success) {
        setRooms(data.rooms)
      }
      else {
        toast.error(data.message || "Failed to fetch rooms")
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Toggle Availability of the Room
  const toggleAvailability = async (roomId) => {
    const { data } = await axios.post('/api/rooms/toggle-availability', { roomId }, {
      headers: {
        Authorization: `Bearer ${await getToken()}`
      }
    })
    if (data.success) {
      toast.success(data.message)
      fetchRooms()
    } else {
      toast.error(data.message)
    }
  }

  useEffect(() => {
    if (user) {
      fetchRooms()
    }
  }, [user, showRoomUpdate])

  return (

    <div>
      {showRoomUpdate && <UpdateRoom />}
      <div className="flex justify-between items-center">
        <Title
          align='left'
          font='outfit'
          title='Room Listings'
          subTitle='View, edit, or manage all listed rooms. Keep the information up-to-date to provide the best experience for users.'
        />
      </div>
      <div className='w-full max-w-3x1 text-left border border-gray-300 rounded-1g max-h-80 overflow-y-scroll mt-3'>
        <table className='w-full'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='py-3 px-4 text-gray-800 font-medium'>Name</th>
              <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>facility</th>
              <th className='py-3 px-4 text-gray-800 font-medium text-center'>price/Night</th>
              <th className='py-3 px-4 text-gray-800 font-medium text-center'>Available</th>
              <th className='py-3 px-4 text-gray-800 font-medium text-center'>Update</th>
              <th className='py-3 px-4 text-gray-800 font-medium text-center'>Delete</th>
            </tr>
          </thead>
          <tbody className='text-sm'>
            {
              rooms.map((items, index) => (
                <tr key={index}>
                  <td className='py-3 px-4 text-gray-700 
                          border-t border-gray-300'>
                    {items.roomType}
                  </td>
                  <td className='py-3 px-4 text-gray-700 
                          border-t border-gray-300 max-sm:hidden'>
                    {items.amenities.join(',')}
                  </td>
                  <td className='py-3 px-4 text-gray-700 
                          border-t border-gray-300 text-center'>
                    {items.pricePerNight} {` ${currency}`}
                  </td>

                  <td className='py-3 px-4 border-t border-gray-300 text-sm text-red-500 text-center'>
                    <label className='relative inline-flex items-center cursor-pointer text-gray-900 gap-3'>
                      <input onChange={() => toggleAvailability(items._id)} type="checkbox" className='sr-only peer'
                        checked={items.isAvailable} />
                      <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors 
                        duration-200"></div>
                      <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full 
                      transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                    </label>
                  </td>

                  <td className='py-3 px-4 border-t border-gray-300 text-sm text-red-500 text-center'>
                    <label className='relative inline-flex items-center cursor-pointer text-gray-900 gap-3'>
                      <button onClick={() => { setShowRoomUpdate(true); setUpdatedRoomId(items._id) }}
                        className='bg-primary text-white px-5 py-2 rounded cursor-pointer'>update</button>
                    </label>
                  </td>

                  <td className='py-3 px-4 border-t border-gray-300 text-sm text-red-500 text-centertext-center'>
                    <button className='cursor-pointer'>
                      <svg xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 
                          2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 
                          1 0 00-1 1v1h6V4a1 1 0 00-1-1m-40h4" />
                      </svg>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>

        </table>
      </div>
    </div>
  )
}

export default ListRoom