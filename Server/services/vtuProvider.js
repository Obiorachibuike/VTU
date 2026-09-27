// Provider contract is intentionally server-side: POST VTU_API_URL with a Bearer VTU_API_KEY.
// Request: {reference, service, amount, recipient, productCode, network, meterType}.
// Success response: {status:"success"}; an explicit {status:"failed"} is a definitive decline.
async function fulfill(order) {
  const baseUrl = process.env.VTU_API_URL;
  const apiKey = process.env.VTU_API_KEY;
  if (!baseUrl || !apiKey) {
    if (process.env.NODE_ENV !== 'production' && process.env.SERVICE_MODE === 'demo') return { simulated: true };
    const error = new Error('A VTU provider is not configured.');
    error.safeToRefund = true;
    throw error;
  }

  let response;
  let result;
  try {
    response = await fetch(baseUrl, {
      method: 'POST',
      signal: AbortSignal.timeout(15000),
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': order.reference },
      body: JSON.stringify({
        reference: order.reference,
        service: order.service,
        amount: order.amount,
        recipient: order.recipient,
        productCode: order.productCode || undefined,
        network: order.network || undefined,
        meterType: order.meterType || undefined,
      }),
    });
    result = await response.json().catch(() => ({}));
  } catch (cause) {
    const error = new Error('The provider response was not received. This order remains pending while it is reconciled.');
    error.ambiguous = true;
    throw error;
  }

  if (response.ok && result.status === 'success') return { simulated: false, providerReference: result.reference || null };
  if (result.status === 'failed') {
    const error = new Error(result.message || 'The provider declined this order.');
    error.providerFailed = true;
    throw error;
  }
  const error = new Error(result.message || 'The provider returned an unclear result. The order remains pending reconciliation.');
  error.ambiguous = true;
  throw error;
}
module.exports = { fulfill };
