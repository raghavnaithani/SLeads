import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { leadApi } from '@/api/lead.api';
import { LeadStatus, LeadSource } from '@/types/lead.types';
import type { ILead } from '@/types/lead.types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';

const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  status: z.enum([LeadStatus.NEW, LeadStatus.CONTACTED, LeadStatus.QUALIFIED, LeadStatus.LOST]).optional(),
  source: z.enum([LeadSource.WEBSITE, LeadSource.REFERRAL, LeadSource.COLD_CALL, LeadSource.ADVERTISEMENT]),
});

type LeadValues = z.infer<typeof leadSchema>;

interface LeadFormProps {
  initialData?: ILead;
  onClose: () => void;
}

export function LeadForm({ initialData, onClose }: LeadFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      status: initialData?.status || LeadStatus.NEW,
      source: initialData?.source || LeadSource.WEBSITE,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: LeadValues) => {
      if (isEditing) {
        return leadApi.updateLead(initialData._id, data);
      }
      return leadApi.createLead(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success(`Lead ${isEditing ? 'updated' : 'created'} successfully`);
      onClose();
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} lead`;
      toast.error(message);
    },
  });

  const onSubmit = (data: LeadValues) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2 relative pb-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Lead name" {...register('name')} error={errors.name?.message} />
      </div>

      <div className="space-y-2 relative pb-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="Lead email" {...register('email')} error={errors.email?.message} />
      </div>

      <div className="space-y-2 relative pb-2">
        <Label htmlFor="source">Source</Label>
        <Select id="source" {...register('source')} error={errors.source?.message}>
          {Object.values(LeadSource).map((source) => (
            <option key={source} value={source}>
              {source}
            </option>
          ))}
        </Select>
      </div>

      {isEditing && (
        <div className="space-y-2 relative pb-2">
          <Label htmlFor="status">Status</Label>
          <Select id="status" {...register('status')} error={errors.status?.message}>
            {Object.values(LeadStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" isLoading={mutation.isPending}>
          {isEditing ? 'Save Changes' : 'Create Lead'}
        </Button>
      </div>
    </form>
  );
}
