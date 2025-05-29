import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import Pagination from '../components/Pagination';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [formData, setFormData] = useState({
    ServiceName: '',
    ServicePrice: ''
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (currentService) {
        // Update existing service
        await api.put(`/api/services/${currentService.ServiceCode}`, formData);
        toast.success('Service updated successfully');
      } else {
        // Create new service
        await api.post('/api/services', formData);
        toast.success('Service added successfully');
      }

      // Reset form and fetch updated list
      resetForm();
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error(error.response?.data?.message || 'Failed to save service');
    }
  };

  const handleEdit = (service) => {
    setCurrentService(service);
    setFormData({
      ServiceName: service.ServiceName,
      ServicePrice: service.ServicePrice
    });
    setShowModal(true);
  };

  const handleDelete = async (serviceCode) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await api.delete(`/api/services/${serviceCode}`);
        toast.success('Service deleted successfully');
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
        toast.error(error.response?.data?.message || 'Failed to delete service');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      ServiceName: '',
      ServicePrice: ''
    });
    setCurrentService(null);
    setShowModal(false);
  };

  const filteredServices = services.filter(service =>
    service.ServiceName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentServices = filteredServices.slice(startIndex, endIndex);

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
          <h1 className="text-3xl font-bold text-white">Services</h1>
          <p className="text-dark-400">Manage repair services and prices</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors duration-200"
        >
          Add Service
        </button>
      </div>

      <div className="bg-dark-700 rounded-lg border border-dark-600 p-6">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search services..."
            className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 transition-colors duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : currentServices.length === 0 ? (
          <p className="text-center py-8 text-dark-400">No services found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-dark-600">
                  <th className="px-6 py-4 text-left text-sm font-medium text-dark-300 uppercase tracking-wider">
                    Service Code
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-dark-300 uppercase tracking-wider">
                    Service Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-dark-300 uppercase tracking-wider">
                    Price (RWF)
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-dark-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-600">
                {currentServices.map((service) => (
                  <tr key={service.ServiceCode} className="hover:bg-dark-600 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {service.ServiceCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-300">
                      {service.ServiceName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-400 font-medium">
                      {parseFloat(service.ServicePrice).toLocaleString()} RWF
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(service)}
                          className="px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded hover:bg-primary-600 transition-colors duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(service.ServiceCode)}
                          className="px-3 py-1 bg-accent-600 text-white text-xs font-medium rounded hover:bg-accent-700 transition-colors duration-200"
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

        {filteredServices.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredServices.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Add/Edit Service Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-black opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-dark-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-dark-600">
              <form onSubmit={handleSubmit}>
                <div className="bg-dark-800 px-6 pt-6 pb-4">
                  <h3 className="text-xl font-bold text-white mb-6">
                    {currentService ? 'Edit Service' : 'Add New Service'}
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label htmlFor="ServiceName" className="block text-sm font-medium text-dark-300 mb-2">
                        Service Name
                      </label>
                      <input
                        type="text"
                        id="ServiceName"
                        name="ServiceName"
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 transition-colors duration-200"
                        value={formData.ServiceName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="ServicePrice" className="block text-sm font-medium text-dark-300 mb-2">
                        Price (RWF)
                      </label>
                      <input
                        type="number"
                        id="ServicePrice"
                        name="ServicePrice"
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 transition-colors duration-200"
                        value={formData.ServicePrice}
                        onChange={handleChange}
                        required
                        min="0"
                        step="1000"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-dark-700 px-6 py-4 border-t border-dark-600 flex flex-col sm:flex-row-reverse gap-3">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors duration-200"
                  >
                    {currentService ? 'Update' : 'Save'}
                  </button>
                  <button
                    type="button"
                    className="px-6 py-3 bg-dark-600 text-white font-medium rounded-lg hover:bg-dark-500 transition-colors duration-200"
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
    </div>
  );
};

export default Services;
