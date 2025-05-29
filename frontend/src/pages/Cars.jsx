import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import Pagination from '../components/Pagination';

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentCar, setCurrentCar] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    PlateNumber: '',
    type: '',
    Model: '',
    ManufacturingYear: '',
    DriverPhone: '',
    MechanicName: ''
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/cars');
      setCars(response.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
      toast.error('Failed to fetch cars');
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
      if (currentCar) {
        // Update existing car
        await api.put(`/api/cars/${formData.PlateNumber}`, formData);
        toast.success('Car updated successfully');
      } else {
        // Create new car
        await api.post('/api/cars', formData);
        toast.success('Car added successfully');
      }

      // Reset form and fetch updated list
      resetForm();
      fetchCars();
    } catch (error) {
      console.error('Error saving car:', error);
      toast.error(error.response?.data?.message || 'Failed to save car');
    }
  };

  const handleEdit = (car) => {
    setCurrentCar(car);
    setFormData({
      PlateNumber: car.PlateNumber,
      type: car.type,
      Model: car.Model,
      ManufacturingYear: car.ManufacturingYear,
      DriverPhone: car.DriverPhone,
      MechanicName: car.MechanicName
    });
    setShowModal(true);
  };

  const handleDelete = async (plateNumber) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await api.delete(`/api/cars/${plateNumber}`);
        toast.success('Car deleted successfully');
        fetchCars();
      } catch (error) {
        console.error('Error deleting car:', error);
        toast.error(error.response?.data?.message || 'Failed to delete car');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      PlateNumber: '',
      type: '',
      Model: '',
      ManufacturingYear: '',
      DriverPhone: '',
      MechanicName: ''
    });
    setCurrentCar(null);
    setShowModal(false);
  };

  const filteredCars = cars.filter(car =>
    (car.PlateNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (car.Model || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (car.type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (car.MechanicName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCars = filteredCars.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Cars</h1>
          <p className="text-dark-400 text-sm sm:text-base">Manage car information</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors duration-200 text-sm sm:text-base"
        >
          Add Car
        </button>
      </div>

      <div className="bg-dark-700 rounded-lg border border-dark-600 p-6">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search cars..."
            className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 transition-colors duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : currentCars.length === 0 ? (
          <p className="text-center py-8 text-dark-400">No cars found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-dark-600">
                  <th className="px-6 py-4 text-left text-sm font-medium text-dark-300 uppercase tracking-wider">
                    Plate Number
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-dark-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-dark-300 uppercase tracking-wider">
                    Model
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-dark-300 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-dark-300 uppercase tracking-wider">
                    Driver Phone
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-dark-300 uppercase tracking-wider">
                    Mechanic
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-dark-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-600">
                {currentCars.map((car) => (
                  <tr key={car.PlateNumber || Math.random()} className="hover:bg-dark-600 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {car.PlateNumber || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-300">
                      {car.type || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-300">
                      {car.Model || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-300">
                      {car.ManufacturingYear || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-300">
                      {car.DriverPhone || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-300">
                      {car.MechanicName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(car)}
                          className="px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded hover:bg-primary-600 transition-colors duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(car.PlateNumber)}
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

        {filteredCars.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredCars.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Add/Edit Car Modal */}
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
                    {currentCar ? 'Edit Car' : 'Add New Car'}
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label htmlFor="PlateNumber" className="block text-sm font-medium text-dark-300 mb-2">
                        Plate Number
                      </label>
                      <input
                        type="text"
                        id="PlateNumber"
                        name="PlateNumber"
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 transition-colors duration-200"
                        value={formData.PlateNumber}
                        onChange={handleChange}
                        required
                        disabled={currentCar}
                      />
                    </div>

                    <div>
                      <label htmlFor="type" className="block text-sm font-medium text-dark-300 mb-2">
                        Type
                      </label>
                      <input
                        type="text"
                        id="type"
                        name="type"
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 transition-colors duration-200"
                        value={formData.type}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="Model" className="block text-sm font-medium text-dark-300 mb-2">
                        Model
                      </label>
                      <input
                        type="text"
                        id="Model"
                        name="Model"
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 transition-colors duration-200"
                        value={formData.Model}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="ManufacturingYear" className="block text-sm font-medium text-dark-300 mb-2">
                        Manufacturing Year
                      </label>
                      <input
                        type="number"
                        id="ManufacturingYear"
                        name="ManufacturingYear"
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 transition-colors duration-200"
                        value={formData.ManufacturingYear}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="DriverPhone" className="block text-sm font-medium text-dark-300 mb-2">
                        Driver Phone
                      </label>
                      <input
                        type="text"
                        id="DriverPhone"
                        name="DriverPhone"
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 transition-colors duration-200"
                        value={formData.DriverPhone}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="MechanicName" className="block text-sm font-medium text-dark-300 mb-2">
                        Mechanic Name
                      </label>
                      <input
                        type="text"
                        id="MechanicName"
                        name="MechanicName"
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 transition-colors duration-200"
                        value={formData.MechanicName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-dark-700 px-6 py-4 border-t border-dark-600 flex flex-col sm:flex-row-reverse gap-3">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors duration-200"
                  >
                    {currentCar ? 'Update' : 'Save'}
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

export default Cars;
