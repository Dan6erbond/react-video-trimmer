export const formatDuration = (duration: number) =>
  `${Intl.NumberFormat([], {
    minimumIntegerDigits: 2,
  }).format(Math.floor(duration / 60))}:${Intl.NumberFormat([], {
    minimumIntegerDigits: 2,
  }).format(Math.round(duration % 60))}`;
