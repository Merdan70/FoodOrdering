import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { InsertTables, UpdateTables } from '@/types';



export const useAdminOrdersList = ({ archived = false }: { archived: boolean }) => {
    const statuses = archived ? ['Delivered']: ['New', 'Cooking','Delivering']
  return useQuery({
    queryKey: ['orders', { archived}],
    queryFn: async () => {
      const { data, error } = await supabase
      .from('orders')
      .select('*')
      .in('status',statuses)
      .order('created_at',{ascending:false});
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

        const { data, error } = await supabase.from('orders').select('*').eq('user_id',id).order('created_at',{ascending:false});
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
          .select('*, order_items(*, products(*))')
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
    async onSuccess(data) {
      await queryClient.invalidateQueries(['orders']);
    },
    // onError(error) {
    //   console.log(error);
    // },
  });
};


export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn({
      id,
      updateField,
    }:{
      id:number,
      updateField:UpdateTables<'orders'>,
    }) {
      const { error, data: updateOrder } = await supabase
      .from('orders')
      .update(updateField)
      .eq('id',id)
      .select()
      .single();

      if (error) {
        throw new Error(error.message);
      }
      return updateOrder;
    },
    async onSuccess(_, {id}) {
      await queryClient.invalidateQueries(['orders']);
      await queryClient.invalidateQueries(['orders', id]);
    },
    // onError(error) {
    //   console.log(error);
    // },
  });
};
