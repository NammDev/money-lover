'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { deleteCategory } from '@/lib/actions/categories'
import { DeleteCategorySchemaType } from '@/lib/schemas/categories'
import { TransactionType } from '@/types'
import { Category } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { ReactNode } from 'react'
import { toast } from 'sonner'

interface Props {
  trigger: ReactNode
  category: Category
  userId: string
}

function DeleteCategoryDialog({ category, trigger, userId }: Props) {
  const categoryIdentifier = `${category.name}-${category.type}`
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (values: DeleteCategorySchemaType) => deleteCategory(userId, values),
    onSuccess: async () => {
      toast.success('Category deleted successfully', {
        id: categoryIdentifier,
      })

      await queryClient.invalidateQueries({
        queryKey: ['categories'],
      })
    },
    onError: () => {
      toast.error('Something went wrong', {
        id: categoryIdentifier,
      })
    },
  })
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your category
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              toast.loading('Deleting category...', {
                id: categoryIdentifier,
              })
              deleteMutation.mutate({
                name: category.name,
                type: category.type as TransactionType,
              })
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteCategoryDialog
