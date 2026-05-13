'use client';

import { useMutation } from '@tanstack/react-query';
import { contactApi } from '@/features/contactApi';

export function useContactMutation() {
  const mutation = useMutation({
    mutationFn: (data) => contactApi.send(data),
  });

  return {
    sendMessage: mutation.mutateAsync,
    isSending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
}
