import { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { Badge } from '@/components/Badge';
import { Role, TableColumn } from '@/types';
import { roleService } from '@/api/roleService';
import { formatDate } from '@/utils/helpers';

const Roles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  useEffect(() => {
    const load = async () => {
      try {
        const res = await roleService.getAll({ page: 1, pageSize: 50 });
        setRoles(res.data.data);
      } catch (e) {
        // silently ignore
      }
    };
    load();
  }, []);

  const columns: TableColumn<Role>[] = [
    {
      key: 'name',
      label: 'Role Name',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <Shield className="h-4 w-4 text-primary-600" />
          <div>
            <p className="font-medium text-gray-900">{value as string}</p>
            {row.description && (
              <p className="text-xs text-gray-500">{row.description}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'isSystem',
      label: 'Type',
      render: (value) =>
        value ? (
          <Badge variant="info">System</Badge>
        ) : (
          <Badge variant="default">Custom</Badge>
        ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (value) => formatDate(value as string),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage roles and their permissions
        </p>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <DataTable<Role>
          data={roles}
          columns={columns}
          searchPlaceholder="Search roles..."
        />
      </div>
    </div>
  );
};

export default Roles;
