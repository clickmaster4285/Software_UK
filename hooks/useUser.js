'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/features/userApi';
import { useRouter } from 'next/navigation';

export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => userApi.me(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUserMutations() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }) => userApi.login(email, password),
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data);
      router.push('/admin/dashboard');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => userApi.logout(),
    onSuccess: () => {
      queryClient.setQueryData(['user'], null);
      router.push('/login');
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data) => userApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  return {
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    updateProfile: updateProfileMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isUpdating: updateProfileMutation.isPending,
  };
}
