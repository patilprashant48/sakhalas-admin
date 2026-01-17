import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Power } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { Badge } from '@/components/Badge';
import { User, UserRole, TableColumn, UserFormData, PermissionResource, PermissionAction, Company } from '@/types';
import { userService } from '@/api/userService';
import { companyService } from '@/api/companyService';
import { formatDate, formatRoleName } from '@/utils/helpers';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const Users = () => {
  const { hasPermission, isSuperAdmin } = useAuth();
  const canCreate = hasPermission(PermissionResource.USERS, PermissionAction.CREATE);
  const canUpdate = hasPermission(PermissionResource.USERS, PermissionAction.UPDATE);
  const canDelete = hasPermission(PermissionResource.USERS, PermissionAction.DELETE);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  
  useEffect(() => {
    const load = async () => {
      try {
        const [usersRes, companiesRes] = await Promise.all([
          userService.getAll({ page: 1, pageSize: 50 }),
          isSuperAdmin() ? companyService.getAll({ page: 1, pageSize: 100 }) : Promise.resolve({ data: { data: [] } }),
        ]);
        setUsers(usersRes.data.data);
        setCompanies(companiesRes.data.data);
      } catch (e) {
        toast.error('Failed to load data');
      }
    };
    load();
  }, []);

  const { register, handleSubmit, reset, setValue } = useForm<UserFormData>();

  const roleOptions = [
    { label: 'Company Admin', value: UserRole.COMPANY_ADMIN },
    { label: 'Manager', value: UserRole.MANAGER },
    { label: 'Employee', value: UserRole.EMPLOYEE },
  ];

  // Super admin can assign super admin role
  if (isSuperAdmin()) {
    roleOptions.unshift({ label: 'Super Admin', value: UserRole.SUPER_ADMIN });
  }

  const columns: TableColumn<User>[] = [
    {
      key: 'firstName',
      label: 'Name',
      sortable: true,
      render: (_, row) => (
        <div>
          <p className="font-medium text-gray-900">
            {row.firstName} {row.lastName}
          </p>
          <p className="text-xs text-gray-500">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (value) => (
        <Badge variant="info">{formatRoleName(value as string)}</Badge>
      ),
    },
    {
      key: 'company',
      label: 'Company',
      render: (_, row) => (
        <span className="text-sm text-gray-600">
          {row.company?.name || 'N/A'}
        </span>
      ),
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
          {canUpdate && (
            <button
              onClick={() => handleEdit(row)}
              className="rounded p-1 text-blue-600 hover:bg-blue-50"
              title="Edit"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          )}
          {canUpdate && (
            <button
              onClick={() => handleToggleActive(row)}
              className="rounded p-1 text-orange-600 hover:bg-orange-50"
              title={row.isActive ? 'Deactivate' : 'Activate'}
            >
              <Power className="h-4 w-4" />
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => {
                setSelectedUser(row);
                setIsDeleteDialogOpen(true);
              }}
              className="rounded p-1 text-red-600 hover:bg-red-50"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setValue('email', user.email);
    setValue('firstName', user.firstName);
    setValue('lastName', user.lastName);
    setValue('role', user.role);
    if (user.companyId) {
      setValue('companyId', user.companyId);
    }
    setIsModalOpen(true);
  };

  const handleToggleActive = async (user: User) => {
    try {
      const res = await userService.toggleActive(user.id);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? res.data : u)));
      toast.success(`User ${user.isActive ? 'deactivated' : 'activated'}`);
    } catch (e: any) {
      console.error('User toggle error:', e);
      const message = e?.response?.data?.message || 'Failed to toggle status';
      toast.error(message);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    
    setIsSubmitting(true);
    try {
      await userService.delete(selectedUser.id);
      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      toast.success('User deleted successfully');
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error('Failed to delete user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: UserFormData) => {
    setIsSubmitting(true);
    try {
      if (selectedUser) {
        const res = await userService.update(selectedUser.id, data);
        setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? res.data : u)));
        toast.success('User updated successfully');
      } else {
        const res = await userService.create({ ...data, isActive: true });
        setUsers((prev) => [...prev, res.data]);
        toast.success('User created successfully');
      }

      setIsModalOpen(false);
      reset();
      setSelectedUser(null);
    } catch (error: any) {
      console.error('User save error:', error);
      const message = error?.response?.data?.message || 'Failed to save user';
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
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage user accounts and permissions
          </p>
        </div>
        {canCreate && (
          <Button
            onClick={() => {
              setSelectedUser(null);
              reset();
              setIsModalOpen(true);
            }}
            icon={<Plus className="h-4 w-4" />}
          >
            Add User
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <DataTable<User>
          data={users}
          columns={columns}
          searchPlaceholder="Search users..."
        />
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
          reset();
        }}
        title={selectedUser ? 'Edit User' : 'Add User'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
              {selectedUser ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input label="Email" type="email" {...register('email')} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" {...register('firstName')} required />
            <Input label="Last Name" {...register('lastName')} required />
          </div>
          <Select label="Role" options={roleOptions} {...register('role')} required />
          {isSuperAdmin() && companies.length > 0 && (
            <Select 
              label="Company" 
              options={[
                { label: 'No Company (Super Admin)', value: '' },
                ...companies.map(c => ({ label: c.name, value: c.id }))
              ]} 
              {...register('companyId')} 
            />
          )}
          {!selectedUser && (
            <Input
              label="Password"
              type="password"
              {...register('password')}
              helperText="Minimum 6 characters"
              required
            />
          )}
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${selectedUser?.firstName} ${selectedUser?.lastName}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default Users;
