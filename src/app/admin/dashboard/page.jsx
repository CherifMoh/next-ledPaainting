
import PieChartC from '../../../components/admin/charts/PieChart'
import { DashboardCard } from '../../lib/utils';

function Admin() {

  return (
    <main className='p-4'>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DashboardCard
          title="Sales"
          // body={<PieChartC />}
        />
      </div>
    </main>
  )
}

export default Admin;