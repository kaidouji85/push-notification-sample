/** 公開鍵を入力する */
const PUBLIC_KEY = '';

/** メイン関数 */
window.onload = async () => {
  try {
    const hasServiceWorker = 'serviceWorker' in navigator;
    const hasPushManager = 'PushManager' in window;
    if (!hasServiceWorker && !hasPushManager) {
      consoloe.log('このブラウザではPush通知がサポートされていません');
      return;
    }

    const serviceWorker = await navigator.serviceWorker.register('sw.js');
    const existingSubscription = await serviceWorker.pushManager.getSubscription();
    if (!!existingSubscription) {
      console.log('already subscription');
      return;
    }

    const applicationServerKey = urlB64ToUint8Array(PUBLIC_KEY);
    const subscription = await serviceWorker.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    });
  } catch (e) {
    throw e;
  }
};

/**
 * 公開鍵からPush通知サーバーキーを生成する
 *
 * @param {string} base64String 公開鍵
 * @returns {Uint8Array} サーバーキー
 */
function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
