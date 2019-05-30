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

    document.querySelectorAll('.notification-subscribe').forEach(v => {
      v.addEventListener('click', event => {
        subscribe(serviceWorker).catch(error => {
          console.error(error);
        })
      });
    });

    document.querySelectorAll('.notification-unsubscribe').forEach(v => {
      v.addEventListener('click', event => {
        unsubscribe(serviceWorker).catch(error => {
          console.error(error);
        })
      });
    });
  } catch (e) {
    throw e;
  }
};

/**
 * PUSH通知を購読する
 *
 * @param {ServiceWorkerRegistration} serviceWorker
 * @returns {Promise<void>}
 */
async function subscribe(serviceWorker) {
  try {
    const existingSubscription = await serviceWorker.pushManager.getSubscription();
    if (existingSubscription) {
      console.log('already subscribe.\r\nif you refresh public-key, please push "unsubscribe" button.');
      return;
    }

    const applicationServerKey = urlB64ToUint8Array(PUBLIC_KEY);
    const subscription = await serviceWorker.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    });

    document.querySelectorAll('.subscription-json').forEach(v => {
      v.textContent = JSON.stringify(subscription);
    });
  } catch(e) {
    throw e;
  }
}

/**
 * PUSH通知の購読停止する
 *
 * @param {ServiceWorkerRegistration} serviceWorker
 * @returns {Promise<void>}
 */
async function unsubscribe(serviceWorker) {
  try {
    const existingSubscription = await serviceWorker.pushManager.getSubscription();
    if (!existingSubscription) {
      console.log('no subscription');
      return;
    }

    await existingSubscription.unsubscribe();
  } catch(e) {
    throw e;
  }
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
