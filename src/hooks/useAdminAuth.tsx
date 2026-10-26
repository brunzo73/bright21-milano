import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setIsAdmin(false); setLoading(false); return; }
      const { data } = await supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' });
      setIsAdmin(data === true);
      setLoading(false);
    };
    check();
    const { data: sub } = supabase.auth.onAuthStateChange(() => { setTimeout(check, 0); });
    return () => sub.subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  return { isAuthenticated: isAdmin, isAdmin, loading, logout };
};
