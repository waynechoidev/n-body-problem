export const isMobile = () => {
  const userAgent = navigator.userAgent;

  if (/windows phone/i.test(userAgent)) {
    return true;
  }

  if (/android/i.test(userAgent)) {
    return true;
  }

  if (/iPad|iPhone|iPod/.test(userAgent)) {
    return true;
  }

  return false;
};
