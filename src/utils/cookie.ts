export function getCookie(name: string): string | null {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const cookieArray = cookie.split("=");
    if (cookieArray[0] === name) {
      return decodeURIComponent(cookieArray[1]);
    }
  }
  return null;
}
