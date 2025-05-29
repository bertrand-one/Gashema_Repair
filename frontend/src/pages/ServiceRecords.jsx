import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import api from '../services/api';
import Pagination from '../components/Pagination';

const ServiceRecords = () => {
  const [records, setRecords] = useState([]);
  const [cars, setCars] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [currentBill, setCurrentBill] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    PlateNumber: '',
    ServiceCode: '',
    AmountPaid: '',
    PaymentDate: format(new Date(), 'yyyy-MM-dd')
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [recordsRes, carsRes, servicesRes] = await Promise.all([
        api.get('/api/service-records'),
        api.get('/api/cars'),
        api.get('/api/services')
      ]);

      setRecords(recordsRes.data);
      setCars(carsRes.data);
      setServices(servicesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'ServiceCode' && value) {
      // Auto-fill amount based on selected service
      const selectedService = services.find(s => s.ServiceCode === parseInt(value));
      if (selectedService) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          AmountPaid: selectedService.ServicePrice
        }));
        return;
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (currentRecord) {
        // Update existing record
        await api.put(`/api/service-records/${currentRecord.RecordNumber}`, formData);
        toast.success('Service record updated successfully');
      } else {
        // Create new record
        await api.post('/api/service-records', formData);
        toast.success('Service record added successfully');
      }

      // Reset form and fetch updated list
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving service record:', error);
      toast.error(error.response?.data?.message || 'Failed to save service record');
    }
  };

  const handleEdit = (record) => {
    setCurrentRecord(record);
    setFormData({
      PlateNumber: record.PlateNumber,
      ServiceCode: record.ServiceCode.toString(),
      AmountPaid: record.AmountPaid,
      PaymentDate: format(new Date(record.PaymentDate), 'yyyy-MM-dd')
    });
    setShowModal(true);
  };

  const handleDelete = async (recordId) => {
    if (window.confirm('Are you sure you want to delete this service record?')) {
      try {
        await api.delete(`/api/service-records/${recordId}`);
        toast.success('Service record deleted successfully');
        fetchData();
      } catch (error) {
        console.error('Error deleting service record:', error);
        toast.error(error.response?.data?.message || 'Failed to delete service record');
      }
    }
  };

  const handleGenerateBill = async (recordId) => {
    try {
      const response = await api.get(`/api/service-records/${recordId}/bill`);
      setCurrentBill(response.data);
      setShowBillModal(true);
    } catch (error) {
      console.error('Error generating bill:', error);
      toast.error('Failed to generate bill');
    }
  };

  const resetForm = () => {
    setFormData({
      PlateNumber: '',
      ServiceCode: '',
      AmountPaid: '',
      PaymentDate: format(new Date(), 'yyyy-MM-dd')
    });
    setCurrentRecord(null);
    setShowModal(false);
  };

  const filteredRecords = records.filter(record =>
    record.PlateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.ServiceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.Model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRecords = filteredRecords.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Service Records</h1>
          <p className="text-dark-400">Manage repair service records</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors duration-200"
        >
          Add Record
        </button>
      </div>

      <div className="bg-dark-700 rounded-lg border border-dark-600 p-6">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search records..."
            className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 transition-colors duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : currentRecords.length === 0 ? (
          <p className="text-center py-8 text-dark-400">No service records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-dark-600">
                  <th className="px-6 py-4 text-left text-sm font-medium text-dark-300 uppercase tracking-wider">
                    Record #
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-dark-300 uppercase tracking-wider">
                    Car
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-dark-300 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-dark-300 uppercase tracking-wider">
                    Amount (RWF)
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-dark-300 uppercase tracking-wider">
                    Payment Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-dark-300 uppercase tracking-wider">
                    Received By
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-dark-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-600">
                {currentRecords.map((record) => (
                  <tr key={record.RecordNumber} className="hover:bg-dark-600 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {record.RecordNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-300">
                      {record.PlateNumber} ({record.Model})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-300">
                      {record.ServiceName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-400 font-medium">
                      {parseFloat(record.AmountPaid).toLocaleString()} RWF
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-300">
                      {format(new Date(record.PaymentDate), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-300">
                      {record.ReceiverName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleGenerateBill(record.RecordNumber)}
                          className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors duration-200"
                          title="Generate Bill"
                        >
                          Bill
                        </button>
                        <button
                          onClick={() => handleEdit(record)}
                          className="px-2 py-1 bg-primary-500 text-white text-xs font-medium rounded hover:bg-primary-600 transition-colors duration-200"
                          title="Edit"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(record.RecordNumber)}
                          className="px-2 py-1 bg-accent-600 text-white text-xs font-medium rounded hover:bg-accent-700 transition-colors duration-200"
                          title="Delete"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredRecords.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredRecords.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Add/Edit Service Record Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {currentRecord ? 'Edit Service Record' : 'Add New Service Record'}
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="form-group">
                      <label htmlFor="PlateNumber" className="form-label">
                        Car
                      </label>
                      <select
                        id="PlateNumber"
                        name="PlateNumber"
                        className="form-input"
                        value={formData.PlateNumber}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a car</option>
                        {cars.map(car => (
                          <option key={car.PlateNumber} value={car.PlateNumber}>
                            {car.PlateNumber} - {car.Model} ({car.type})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="ServiceCode" className="form-label">
                        Service
                      </label>
                      <select
                        id="ServiceCode"
                        name="ServiceCode"
                        className="form-input"
                        value={formData.ServiceCode}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a service</option>
                        {services.map(service => (
                          <option key={service.ServiceCode} value={service.ServiceCode}>
                            {service.ServiceName} - {parseFloat(service.ServicePrice).toLocaleString()} RWF
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="AmountPaid" className="form-label">
                        Amount Paid (RWF)
                      </label>
                      <input
                        type="number"
                        id="AmountPaid"
                        name="AmountPaid"
                        className="form-input"
                        value={formData.AmountPaid}
                        onChange={handleChange}
                        required
                        min="0"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="PaymentDate" className="form-label">
                        Payment Date
                      </label>
                      <input
                        type="date"
                        id="PaymentDate"
                        name="PaymentDate"
                        className="form-input"
                        value={formData.PaymentDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="btn btn-primary w-full sm:w-auto sm:ml-3"
                  >
                    {currentRecord ? 'Update' : 'Save'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full sm:mt-0 sm:w-auto btn bg-gray-200 text-gray-700 hover:bg-gray-300"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Bill Modal */}
      {showBillModal && currentBill && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    SmartPark Car Repair Bill
                  </h3>
                  <p className="text-sm text-gray-500">
                    Receipt #: {currentBill.RecordNumber}
                  </p>
                </div>

                <div className="border-t border-b border-gray-200 py-4 mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Car Details:</p>
                      <p className="font-medium">{currentBill.PlateNumber}</p>
                      <p>{currentBill.Model} ({currentBill.type})</p>
                      <p>Driver Phone: {currentBill.DriverPhone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Date:</p>
                      <p>{format(new Date(currentBill.PaymentDate), 'dd/MM/yyyy')}</p>
                      <p className="text-sm text-gray-500 mt-2">Mechanic:</p>
                      <p>{currentBill.MechanicName}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2">Service</th>
                        <th className="text-right py-2">Amount (RWF)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-3">{currentBill.ServiceName}</td>
                        <td className="text-right py-3">{parseFloat(currentBill.ServicePrice).toLocaleString()}</td>
                      </tr>
                      <tr className="border-t border-gray-200">
                        <td className="py-3 font-bold">Total</td>
                        <td className="text-right py-3 font-bold">{parseFloat(currentBill.AmountPaid).toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Received By:</p>
                      <p className="font-medium">{currentBill.ReceiverName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Payment Status:</p>
                      <p className="font-medium text-green-600">Paid</p>
                    </div>
                  </div>
                  <p className="text-center text-sm text-gray-500 mt-6">
                    Thank you for choosing SmartPark Car Repair Services!
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="btn btn-primary w-full sm:w-auto sm:ml-3"
                  onClick={() => window.print()}
                >
                  Print Bill
                </button>
                <button
                  type="button"
                  className="mt-3 w-full sm:mt-0 sm:w-auto btn bg-gray-200 text-gray-700 hover:bg-gray-300"
                  onClick={() => setShowBillModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceRecords;
