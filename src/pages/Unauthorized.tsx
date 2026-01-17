import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/Button';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
          <ShieldAlert className="h-12 w-12 text-red-600" />
        </div>
        <h1 className="mb-2 text-6xl font-bold text-gray-900">403</h1>
        <h2 className="mb-4 text-2xl font-semibold text-gray-700">
          Access Denied
        </h2>
        <p className="mb-8 text-gray-600">
          You don't have permission to access this resource.
          <br />
          Please contact your administrator if you believe this is a mistake.
        </p>
        <div className="flex justify-center space-x-4">
          <Button onClick={() => navigate(-1)} variant="secondary">
            Go Back
          </Button>
          <Button onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
