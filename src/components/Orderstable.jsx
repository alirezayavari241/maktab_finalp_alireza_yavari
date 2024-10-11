import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'jalali-moment';
import { toast } from 'sonner';
import OrdersPagination from './OrdersPagination';

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'delivered', 'undelivered'
  const [selectedOrder, setSelectedOrder] = useState(null); // for modal
  const [currentPage, setCurrentPage] = useState(1); // current page
  const [itemsPerPage, setItemsPerPage] = useState(5); // items per page
  const [sortOrder, setSortOrder] = useState('date'); // 'date' or 'price'
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/orders?limit=100');
        setOrders(response.data.data.orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  // Filter the orders based on delivery status
  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return filter === 'delivered' ? order.deliveryStatus : !order.deliveryStatus;
  });

  // Sort orders based on selected criteria
  const sortOrders = (orders) => {
    return orders.sort((a, b) => {
      let comparison = 0;

      if (sortOrder === 'date') {
        comparison = new Date(a.createdAt) - new Date(b.createdAt); // Sort by date
      } else if (sortOrder === 'price') {
        comparison = a.totalPrice - b.totalPrice; // Sort by price
      }

      return sortDirection === 'asc' ? comparison : -comparison; // Reverse order if needed
    });
  };

  const sortedOrders = sortOrders(filteredOrders);

  // Calculate total pages
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);

  // Calculate current orders to display
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Open modal for a specific order
  const handleOpenModal = (order) => {
    setSelectedOrder(order);
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  // Toggle delivery status
  const toggleDeliveryStatus = async (orderId) => {
    try {
      const currentDate = !selectedOrder.deliveryStatus ? new Date().toISOString() : selectedOrder.deliveryDate;

      const updatedStatus = {
        deliveryStatus: !selectedOrder.deliveryStatus,
        deliveryDate: currentDate
      };

      const response = await axios.patch(`http://localhost:8000/api/orders/${orderId}`, updatedStatus);

      setOrders(orders.map(order => (order._id === orderId ? response.data.data.order : order))); // Update state
      setSelectedOrder(response.data.data.order); // Update selected order in modal
      toast.success('کالا تحویل داده شد');
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 mx-auto w-full text-center">مدیریت سفارشات</h1>

      {/* Filter Buttons */}
      <div className="flex justify-center space-x-3 mb-4 w-4/5 mx-auto">
        <button onClick={() => setFilter('undelivered')} className="px-4 py-2 bg-red-500 text-white rounded-xl">تحویل نشده</button>
        <button onClick={() => setFilter('delivered')} className="px-4 py-2 bg-green-500 text-white rounded-xl">تحویل شده</button>
        <button onClick={() => setFilter('all')} className="px-4 py-2 bg-blue-500 text-white rounded-xl">همه</button>
      </div>

      {/* Orders Pagination */}
      <div>
        <OrdersPagination
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder} // Ensure this line is present
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
        />
      </div>

      {/* Orders Table */}
      <div className='flex mx-auto flex-col align-middle items-center w-4/5 h-5/6'>
        <table className="min-w-full border border-gray-300 mb-4">
          <thead>
            <tr className="bg-gray-100 text-black">
              <th className="border border-gray-300 p-2">عملیات</th>
              <th className="border border-gray-300 p-2">تاریخ سفارش</th>
              <th className="border border-gray-300 p-2">مجموع مبلغ</th>
              <th className="border border-gray-300 p-2">نام کاربر</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map(order => (
              <tr key={order._id} className='text-black'>
                <td className="border border-gray-300 p-2 text-center ">
                  <button onClick={() => handleOpenModal(order)} className="bg-blue-500 text-white px-4 py-2 rounded">جزئیات</button>
                </td>
                <td className="border border-gray-300 p-2 text-center">{moment(order.createdAt).locale('fa').format('YYYY/MM/DD').toLocaleString('fa-IR')}</td>
                <td className="border border-gray-300 p-2 text-center">{order.totalPrice.toLocaleString('fa-IR')}</td>
                <td className="border border-gray-300 p-2 text-center">{order.user.firstname} {order.user.lastname}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for showing order details */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center align-middle">
          <div className="bg-white p-4 rounded-lg">
            <div className='flex text-center mx-auto justify-center'>
              <h2 className="mb-4 text-black">جزئیات سفارش</h2>
            </div>
            <p className='text-right text-black'>{selectedOrder.user.firstname} {selectedOrder.user.lastname}<strong className='text-right'> :نام و نام خانوادگی</strong></p>
            <p className='text-right text-black'>{selectedOrder.user.address}<strong className='text-right'> :آدرس</strong></p>
            <p className='text-right text-black'>{selectedOrder.user.phoneNumber}<strong className='text-right'> :تلفن</strong></p>
            <p className='text-right text-black'>{moment(selectedOrder.createdAt).locale('fa').format('YYYY/MM/DD HH:mm').toLocaleString('fa-IR')}<strong className='text-right'> :زمان ثبت سفارش</strong></p>

            {/* Display delivery date only if order is delivered */}
            {selectedOrder.deliveryStatus && (
              <p className='text-right text-black'>{moment(selectedOrder.deliveryDate).locale('fa').format('YYYY/MM/DD - HH:mm').toLocaleString('fa-IR')}<strong className='text-right'> :زمان تحویل سفارش</strong></p>
            )}

            {/* Products Table */}
            <div className='mb-2'>
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-100 text-black">
                    <th className="border border-gray-300 p-2">نام محصول</th>
                    <th className="border border-gray-300 p-2">تعداد</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.products.map(product => (
                    <tr key={product._id} className='text-black'>
                      <td className="border border-gray-300 p-2 text-center">{product.productName}</td>
                      <td className="border border-gray-300 p-2 text-center">{product.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className='flex justify-center'>
              {/* Toggle delivery status button */}
              {!selectedOrder.deliveryStatus ? (
                <button onClick={() => toggleDeliveryStatus(selectedOrder._id)} className="bg-green-500 text-white px-4 py-2 rounded">
                  تحویل شده
                </button>
              ) : (
                <button onClick={() => toggleDeliveryStatus(selectedOrder._id)} className="bg-red-500 text-white px-4 py-2 rounded">
                  تحویل نشده
                </button>
              )}

              <button onClick={handleCloseModal} className="bg-red-500 text-white px-4 py-2 rounded ml-2">بستن</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;
