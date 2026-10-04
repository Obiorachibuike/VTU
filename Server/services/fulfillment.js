/**
 * Order fulfilment for VTU services (airtime, data, TV, electricity).
 *
 * DEMO MODE (default): orders settle instantly and successfully so the whole
 * flow works end-to-end without external accounts.
 *
 * LIVE MODE: set VTU_PROVIDER_URL (+ optional VTU_PROVIDER_KEY) to point at a
 * real VTU/bills provider. The provider is expected to accept:
 *   POST { category, reference, payload }  ->  { success: boolean, message? }
 */
const axios = require('axios');
const crypto = require('crypto');

const isProviderEnabled = () => Boolean(process.env.VTU_PROVIDER_URL);

const fulfillOrder = async ({ category, reference, payload }) => {
  if (!isProviderEnabled()) {
    // Demo: instant success with a pseudo provider reference.
    return {
      success: true,
      providerRef: `VTU-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
      provider: 'demo',
    };
  }

  try {
    const { data } = await axios.post(
      process.env.VTU_PROVIDER_URL,
      { category, reference, payload },
      {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.VTU_PROVIDER_KEY
            ? { Authorization: `Bearer ${process.env.VTU_PROVIDER_KEY}` }
            : {}),
        },
      }
    );
    return {
      success: Boolean(data.success),
      providerRef: data.reference || data.providerRef || reference,
      provider: 'external',
      message: data.message,
    };
  } catch (err) {
    return { success: false, provider: 'external', message: err.message };
  }
};

module.exports = { fulfillOrder, isProviderEnabled };
