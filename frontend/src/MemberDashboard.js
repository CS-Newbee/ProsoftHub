import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function MemberDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Component load hote hi Home page pe redirect
    navigate('/');
  }, [navigate]);

  return null; // Kuch render nahi karna
}

export default MemberDashboard;
