export default function truncateString(s: string, length = 16): string {
  if (s.length <= length) {
    return s;
  }

  return s.slice(0, length) + '...';
}
