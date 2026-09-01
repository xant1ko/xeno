import { useEntityPermissions } from '@/composables/useEntityPermissions'
import { useUserStore } from '@/stores/userStore'

interface CommentPermissions {
  canCreate: () => boolean
  canSetVisibility: () => boolean
  canEdit: () => boolean
}

export function useCommentPermissions (commentUserUid?: string): CommentPermissions {
  const userStore = useUserStore()
  const permissions = useEntityPermissions('comments', ['create', 'update', 'visibility'])

  const canCreate = (): boolean => permissions.create
  const canSetVisibility = (): boolean => permissions.visibility
  const canEdit = (): boolean =>
    commentUserUid !== undefined
    && permissions.update
    && commentUserUid === userStore.userData.uid

  return { canCreate, canSetVisibility, canEdit }
}
