import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { InsertTables, Order, Tables } from '@/types';



export const useAdminOrdersList = ({ archived = false }: { archived: boolean }) => {
    const statuses = archived ? ['Delivered']: ['New', 'Cooking','Delivering']
  return useQuery({
    queryKey: ['orders', { archived}],
    queryFn: async () => {
      const { data, error } = await supabase
      .from('orders')
      .select('*')
      .in('status',statuses);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useUsersOrdersList = () => {
    const {session} =  useAuth();
    const id= session?.user.id;

    return useQuery({
      queryKey: ['orders', {userId: id}],
      queryFn: async () => {
        if(!id) return null;

        const { data, error } = await supabase.from('orders').select('*').eq('user_id',id);
        if (error) {
          throw new Error(error.message);
        }
        return data;
      },
    });
  };

  export const useOrderDetails = (id: number) => {
    return useQuery({
      queryKey: ['orders', id],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', id)
          .single();
        if (error) {
          throw new Error(error.message);
        }
        return data;
      },
    });
  };


export const useInsertOrder = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const userId= session?.user.id;
  return useMutation({
    async mutationFn(data: InsertTables<'orders'>) {
      const { error, data: newOrder } = await supabase.from('orders')
      .insert({...data, user_id: userId})
      .select()
      .single();

      if (error) {
        throw new Error(error.message);
      }
      return newOrder;
    },
    async onSuccess() {
      await queryClient.invalidateQueries(['orders']);
    },
    // onError(error) {
    //   console.log(error);
    // },
  });
};