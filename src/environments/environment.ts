export const environment = {
  emailjs: {
    publicKey:  (typeof globalThis !== 'undefined' && (globalThis as any).EMAILJS_PUBLIC_KEY) || '9z0_yIR7PDq3iFVVx',
    serviceId:  (typeof globalThis !== 'undefined' && (globalThis as any).EMAILJS_SERVICE_ID) || 'service_p7wtwvf',
    templateId: (typeof globalThis !== 'undefined' && (globalThis as any).EMAILJS_TEMPLATE_ID) || 'template_ujvoh44',
  }
};
