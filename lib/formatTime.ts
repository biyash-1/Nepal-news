

export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 0) return `${diffDays} दिन अघि`;
  if (diffHours > 0) return `${diffHours} घण्टा अघि`;
  if (diffMinutes > 0) return `${diffMinutes} मिनेट अघि`;

  return "अहिले";
};
