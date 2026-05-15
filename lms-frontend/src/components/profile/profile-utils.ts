export const getInitials = (name?: string | null) =>
  name
    ?.split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || 'U';

export const getRoleLabel = (role?: string) => (role === 'ADMIN' ? 'Admin' : 'Pelajar');
