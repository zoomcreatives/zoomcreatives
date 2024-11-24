import { useState } from 'react';
import { Palette, Plus, Search, Calculator } from 'lucide-react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useStore } from '../../store';
import AddDesignJobModal from './AddDesignJobModal';
import EditDesignJobModal from './EditDesignJobModal';
import HisabKitabModal from '../../components/HisabKitabModal';
import DataTable from '../../components/DataTable';
import AmountCell from '../../components/AmountCell';
import type { GraphicDesignJob } from '../../types/graphicDesign';

export default function GraphicDesignPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isHisabKitabOpen, setIsHisabKitabOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<GraphicDesignJob | null>(null);
  
  const { graphicDesignJobs = [], deleteGraphicDesignJob } = useStore();

  // Filter jobs based on search query
  const filteredJobs = graphicDesignJobs.filter(job => 
    job.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.designType?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      deleteGraphicDesignJob(id);
    }
  };

  const columns = [
    {
      key: 'clientName',
      label: 'Client',
      render: (value: string, item: GraphicDesignJob) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-sm text-gray-500">{item.businessName}</p>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Completed' ? 'bg-green-100 text-green-700' :
          value === 'Cancelled' ? 'bg-red-100 text-red-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'deadline',
      label: 'Deadline',
      render: (value: string) => (
        <span className="text-sm">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (_: unknown, item: GraphicDesignJob) => (
        <AmountCell 
          amount={typeof item.amount === 'number' ? item.amount : null} 
          dueAmount={typeof item.dueAmount === 'number' ? item.dueAmount : null} 
        />
      ),
    },
    {
      key: 'id',
      label: 'Actions',
      render: (_: string, item: GraphicDesignJob) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedJob(item);
              setIsHisabKitabOpen(true);
            }}
            title="View HisabKitab"
          >
            <Calculator className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedJob(item);
              setIsEditModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(item.id)}
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Palette className="h-6 w-6 text-gray-400" />
            <h1 className="text-xl font-semibold text-gray-900">Graphic Design</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search designs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Design Job
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <DataTable
          columns={columns}
          data={filteredJobs}
          searchable={false}
        />
      </div>

      <AddDesignJobModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {selectedJob && (
        <>
          <EditDesignJobModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedJob(null);
            }}
            job={selectedJob}
          />

          <HisabKitabModal
            isOpen={isHisabKitabOpen}
            onClose={() => {
              setIsHisabKitabOpen(false);
              setSelectedJob(null);
            }}
            application={selectedJob}
          />
        </>
      )}
    </div>
  );
}