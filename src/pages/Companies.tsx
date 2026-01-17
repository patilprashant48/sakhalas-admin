import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Power } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Input } from '@/components/Input';
import { Badge } from '@/components/Badge';
import { Company, CompanyFormData, TableColumn } from '@/types';
import { companyService } from '@/api/companyService';
import { formatDate } from '@/utils/helpers';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const Companies = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await companyService.getAll({ page: 1, pageSize: 50 });
        setCompanies(res.data.data);
      } catch (e) {
        toast.error('Failed to load companies');
      }
    };
    load();
  }, []);

  const { register, handleSubmit, reset, setValue } = useForm<CompanyFormData>();

  const columns: TableColumn<Company>[] = [
    { key: 'name', label: 'Company Name', sortable: true },
    { key: 'domain', label: 'Domain', sortable: true },
    {
      key: 'userCount',
      label: 'Users',
      sortable: true,
      render: (value) => <span className="font-medium">{(value as number) ?? 0}</span>,
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (value) =>
        value ? (
          <Badge variant="success">Active</Badge>
        ) : (
          <Badge variant="danger">Inactive</Badge>
        ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (value) => formatDate(value as string),
    },
    {
      key: 'id',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row)}
            className="rounded p-1 text-blue-600 hover:bg-blue-50"
            title="Edit"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleToggleActive(row)}
            className="rounded p-1 text-orange-600 hover:bg-orange-50"
            title={row.isActive ? 'Deactivate' : 'Activate'}
          >
            <Power className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              setSelectedCompany(row);
              setIsDeleteDialogOpen(true);
            }}
            className="rounded p-1 text-red-600 hover:bg-red-50"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    setValue('name', company.name);
    setValue('domain', company.domain);
    setIsModalOpen(true);
  };

  const handleToggleActive = async (company: Company) => {
    try {
      const res = await companyService.toggleActive(company.id);
      setCompanies((prev) =>
        prev.map((c) => (c.id === company.id ? res.data : c))
      );
      toast.success(`Company ${company.isActive ? 'deactivated' : 'activated'}`);
    } catch (e: any) {
      console.error('Company toggle error:', e);
      const message = e?.response?.data?.message || 'Failed to toggle status';
      toast.error(message);
    }
  };

  const handleDelete = async () => {
    if (!selectedCompany) return;
    
    setIsSubmitting(true);
    try {
      await companyService.delete(selectedCompany.id);
      setCompanies((prev) => prev.filter((c) => c.id !== selectedCompany.id));
      toast.success('Company deleted successfully');
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      console.error('Company delete error:', error);
      const message = error?.response?.data?.message || 'Failed to delete company';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: CompanyFormData) => {
    setIsSubmitting(true);
    try {
      if (selectedCompany) {
        const res = await companyService.update(selectedCompany.id, data);
        setCompanies((prev) =>
          prev.map((c) => (c.id === selectedCompany.id ? res.data : c))
        );
        toast.success('Company updated successfully');
      } else {
        const res = await companyService.create({ ...data, isActive: true });
        setCompanies((prev) => [...prev, res.data]);
        toast.success('Company created successfully');
      }

      setIsModalOpen(false);
      reset();
      setSelectedCompany(null);
    } catch (error: any) {
      console.error('Company save error:', error);
      const message = error?.response?.data?.message || 'Failed to save company';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage all companies in the system
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedCompany(null);
            reset();
            setIsModalOpen(true);
          }}
          icon={<Plus className="h-4 w-4" />}
        >
          Add Company
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <DataTable<Company>
          data={companies}
          columns={columns}
          searchPlaceholder="Search companies..."
        />
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCompany(null);
          reset();
        }}
        title={selectedCompany ? 'Edit Company' : 'Add Company'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
              {selectedCompany ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input label="Company Name" {...register('name')} required />
          <Input
            label="Domain"
            placeholder="example.com"
            {...register('domain')}
            required
          />
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Company"
        message={`Are you sure you want to delete "${selectedCompany?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default Companies;
