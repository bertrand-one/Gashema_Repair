import { useState, useEffect } from 'react';
import api from '../services/api';
import { format } from 'date-fns';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCars: 0,
    totalServices: 0,
    totalServiceRecords: 0,
    totalRevenue: 0,
  });
  const [recentRecords, setRecentRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch cars count
        const carsResponse = await api.get('/api/cars');

        // Fetch services count
        const servicesResponse = await api.get('/api/services');

        // Fetch service records
        const recordsResponse = await api.get('/api/service-records');

        // Calculate total revenue
        const totalRevenue = recordsResponse.data.reduce(
          (sum, record) => sum + parseFloat(record.AmountPaid),
          0
        );

        setStats({
          totalCars: carsResponse.data.length,
          totalServices: servicesResponse.data.length,
          totalServiceRecords: recordsResponse.data.length,
          totalRevenue,
        });

        // Get recent records (last 5)
        setRecentRecords(recordsResponse.data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, gradient }) => (
    <div className={`${gradient} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105`}>
      <div>
        <p className="text-sm text-white/80 font-medium mb-2">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 h-full">
      {/* Welcome Header */}
      

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Cars"
          value={stats.totalCars}
          gradient="bg-gradient-to-br from-dark-600 to-dark-700"
        />
        <StatCard
          title="Services Offered"
          value={stats.totalServices}
          gradient="bg-gradient-to-br from-dark-600 to-dark-700"
        />
        <StatCard
          title="Service Records"
          value={stats.totalServiceRecords}
          gradient="bg-gradient-to-br from-dark-600 to-dark-700"
        />
        <StatCard
          title="Total Revenue"
          value={`${stats.totalRevenue.toLocaleString()} RWF`}
          gradient="bg-gradient-to-br from-dark-600 to-dark-700"
        />
      </div>

      <div className="bg-dark-700 rounded-xl shadow-lg border border-dark-600 p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Recent Service Records</h2>

        {recentRecords.length === 0 ? (
          <p className="text-dark-400 text-center py-8">No service records found.</p>
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
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-dark-300 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-600">
                {recentRecords.map((record) => (
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
                      {format(new Date(record.ServiceDate), 'dd/MM/yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
