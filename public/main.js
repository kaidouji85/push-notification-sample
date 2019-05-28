/** 公開鍵を入力する */
const PUBLIC_KEY = '';

/** メイン関数 */
window.onload = async () => {
  try {
    const isPublicKeyBlank = PUBLIC_KEY === '';
    if (isPublicKeyBlank) {
      console.error('公開鍵に正しい値をセットしてください。\r\n公開鍵は以下URLから取得できます。\r\nhttps://web-push-codelab.glitch.me/');
      return;
    }

    const hasServiceWorker = 'serviceWorker' in navigator;
    const hasPushManager = 'PushManager' in window;
    if (!hasServiceWorker || !hasPushManager) {
      consoloe.log('このブラウザではPush通知がサポートされていません');
      return;
    }

    const serviceWorker = await navigator.serviceWorker.register('sw.js');
    let subscription = await serviceWorker.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registerSubscription(serviceWorker);
    }

    const subscriptionJSON = document.querySelector('.subscription-json');
    if (!subscriptionJSON) {
      return;
    }
    subscriptionJSON.textContent = JSON.stringify(subscription);
  } catch (e) {
    throw e;
  }
};

/**
 * サブスクリプションを登録するヘルパー関数
 *
 * @param {ServiceWorkerRegistration} serviceWorker
 * @returns {Promise<PushSubscription>} 登録したサブスクリプション
 */
function registerSubscription(serviceWorker) {
  const applicationServerKey = urlB64ToUint8Array(PUBLIC_KEY);
  return serviceWorker.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  });
}

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
