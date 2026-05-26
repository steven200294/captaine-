import { createServiceClient } from '@shared/config/supabase-server';
import type { ESIMPackage } from '@shared/types';

const BNESIM_BASE_URL = process.env.BNESIM_API_URL || 'https://api.bnesim.com/v2.0';
const BNESIM_API_KEY = process.env.BNESIM_API_KEY;
const BNESIM_API_SECRET = process.env.BNESIM_API_SECRET;

const USE_MOCK = !BNESIM_API_KEY || !BNESIM_API_SECRET;

interface ProvisionParams {
  reservationId: string;
  packageType: ESIMPackage;
  customerName: string;
  customerEmail: string;
}

async function bnesimLogin(): Promise<string> {
  const form = new FormData();
  form.append('api_key', BNESIM_API_KEY!);
  form.append('api_secret', BNESIM_API_SECRET!);
  form.append('type', 'operator');

  const res = await fetch(`${BNESIM_BASE_URL}/login`, {
    method: 'POST',
    headers: { accept: 'application/json' },
    body: form,
  });

  const data = await res.json();
  if (!data.success) throw new Error('BNESIM login failed');
  return data.token;
}

async function bnesimRequest(token: string, endpoint: string, params: Record<string, string>) {
  const form = new FormData();
  for (const [key, value] of Object.entries(params)) {
    form.append(key, value);
  }

  const res = await fetch(`${BNESIM_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: form,
  });

  return res.json();
}

async function pollActivationStatus(token: string, transactionId: string, maxAttempts = 10): Promise<string> {
  for (let i = 0; i < maxAttempts; i++) {
    const status = await bnesimRequest(token, '/enterprise/activation-transaction/get-status', {
      activationTransaction: transactionId,
    });

    if (status.activation_status === 'OK') return status.license_cli;
    if (status.activation_status === 'FAILED') throw new Error('Activation failed');

    await new Promise((r) => setTimeout(r, 3000));
  }
  throw new Error('Activation timeout');
}

async function provisionReal(params: ProvisionParams) {
  const token = await bnesimLogin();

  const licenseRes = await bnesimRequest(token, '/enterprise/license/activation', {
    name: params.customerName,
    email: params.customerEmail,
  });

  if (!licenseRes.success) throw new Error('License activation failed');

  const licenseCli = await pollActivationStatus(token, licenseRes.activationTransaction);

  const productsRes = await bnesimRequest(token, '/enterprise/products/get-products', {
    area: 'Europe',
  });

  const targetVolume = params.packageType === '3gb' ? 3072 : 10240;
  const product = productsRes.products?.find(
    (p: { volume: number; duration: number }) => p.volume >= targetVolume && p.duration === 30
  );

  if (!product) throw new Error(`No BNESIM product found for ${params.packageType}`);

  const esimRes = await bnesimRequest(token, '/enterprise/simcard/add-esim', {
    license_cli: licenseCli,
    product_id: String(product.id),
  });

  if (!esimRes.success) throw new Error('eSIM activation failed');

  await pollActivationStatus(token, esimRes.activationTransaction);

  const detailRes = await bnesimRequest(token, '/enterprise/simcard/get-detail', {
    license_cli: licenseCli,
  });

  const simcard = detailRes.data?.simcard_details;

  return {
    licenseCli,
    iccid: simcard?.iccid || '',
    qrCodeUrl: simcard?.qr_code_image || '',
    activationCode: simcard?.matching_id || '',
    smdpAddress: simcard?.smdp_address || '',
    iosLink: simcard?.ios_universal_installation_link || '',
  };
}

function provisionMock(params: ProvisionParams) {
  const mockId = Math.random().toString(36).substring(2, 10);
  return {
    licenseCli: `MOCK-CLI-${mockId}`,
    iccid: `8933${Math.random().toString().slice(2, 18)}`,
    qrCodeUrl: `https://placehold.co/200x200/1c355e/white?text=eSIM+${params.packageType}`,
    activationCode: `MOCK-${mockId.toUpperCase()}`,
    smdpAddress: 'mock.smdp.bnesim.com',
    iosLink: `https://esimsetup.apple.com/esim_qrcode_provisioning?carddata=MOCK-${mockId}`,
  };
}

export async function provisionESIM(params: ProvisionParams) {
  const supabase = createServiceClient();

  const { data: order, error } = await supabase
    .from('esim_orders')
    .insert({
      reservation_id: params.reservationId,
      package_type: params.packageType,
      status: 'pending',
    })
    .select()
    .single();

  if (error || !order) throw new Error(`Failed to create eSIM order: ${error?.message}`);

  try {
    const result = USE_MOCK ? provisionMock(params) : await provisionReal(params);

    await supabase
      .from('esim_orders')
      .update({
        status: 'provisioned',
        license_cli: result.licenseCli,
        iccid: result.iccid,
        qr_code_url: result.qrCodeUrl,
        activation_code: result.activationCode,
        smdp_address: result.smdpAddress,
        ios_link: result.iosLink,
        provider_order_id: result.licenseCli,
      })
      .eq('id', order.id);

    return result;
  } catch (err) {
    await supabase
      .from('esim_orders')
      .update({ status: 'failed' })
      .eq('id', order.id);
    throw err;
  }
}
