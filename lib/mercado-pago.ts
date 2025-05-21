import mercadopago from 'mercadopago';

// Configuração do Mercado Pago
mercadopago.configure({
    access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
    integrator_id: 'dev_24c65fb163bf110081ff8e98'
});

export default mercadopago;
