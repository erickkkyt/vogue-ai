declare module "google-one-tap" {
  interface OneTapOptions {
    client_id: string;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
    context?: 'signin' | 'signup' | 'use';
  }

  interface OneTapResponse {
    credential: string;
  }

  type OneTapCallback = (response: OneTapResponse) => void;

  function googleOneTap(options: OneTapOptions, callback: OneTapCallback): void;

  export = googleOneTap;
}

// Google Identity Services 类型定义
interface GoogleIdentityConfiguration {
  client_id: string;
  callback: (response: any) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
  context?: 'signin' | 'signup' | 'use';
}

interface GoogleIdentityNotification {
  isNotDisplayed(): boolean;
  isSkippedMoment(): boolean;
  isDismissedMoment(): boolean;
  getNotDisplayedReason(): string;
  getSkippedReason(): string;
  getDismissedReason(): string;
}

// 扩展 Window 对象以包含 Google Identity Services
declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: GoogleIdentityConfiguration) => void;
          prompt: (callback?: (notification: GoogleIdentityNotification) => void) => void;
          cancel: () => void;
        };
      };
    };
  }
}
