function sanitizeFilename(name) {
    return name.replace(/[<>:"/\\|?*\u0000-\u001F]/g, '_').substring(0, 200);
  }
  
  document.getElementById('downloadBtn').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id, allFrames: true },
        func: () => {
          const images = Array.from(document.querySelectorAll('img'));
          return images
            .map(img => img.src)
            .filter(src =>
              src.includes('simgad') || src.includes('googlesyndication.com')
            );
        }
      }).then(injectionResults => {
        const urls = injectionResults.flatMap(r => r.result);
        console.log('[Ad Extractor] 광고 이미지 URLs:', urls);
  
        urls.forEach((url, i) => {
          try {
            const urlObj = new URL(url);
            let extension = urlObj.pathname.split('.').pop();
  
            // 확장자 유효성 체크
            if (!['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension.toLowerCase())) {
              extension = 'jpg';
            }
  
            // 파일 이름 추출 및 정제
            let baseName = urlObj.pathname.split('/').pop().split('.')[0];
            baseName = sanitizeFilename(baseName);
            const filename = `${baseName || '광고이미지'}_${i + 1}.${extension}`;
  
            chrome.downloads.download({
              url,
              filename,
              conflictAction: 'uniquify'
            });
          } catch (e) {
            console.error('다운로드 실패:', e);
          }
        });
      });
    });
  });
  