function isAdElement(el) {
    const adKeywords = ['ad', 'ads', 'sponsor', 'banner'];
    const classId = (el.className + ' ' + el.id).toLowerCase();
    return adKeywords.some(keyword => classId.includes(keyword));
  }
  
  function getAdImages() {
    const images = Array.from(document.querySelectorAll('img'));
    const adImages = images.filter(img => {
      const parent = img.closest('div, ins, iframe');
      return parent && isAdElement(parent);
    });
    return adImages.map(img => img.src);
  }
  
  const adImageUrls = getAdImages();
  console.log('[Ad Extractor] Found images:', adImageUrls);
  
  // 확장자 백그라운드에 전달해도 됨 (예: 메시징 사용)
  