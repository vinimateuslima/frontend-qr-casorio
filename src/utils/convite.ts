import QRCode from 'qrcode';

async function carregarFonte() {
  try {
    const fonte = new FontFace(
      'Iowan Old Style',
      'url(/Fonts/Iowan-Old-Style.ttc)'
    );
    const fonteFinal = await fonte.load();
    document.fonts.add(fonteFinal);
    return true;
  } catch (error) {
    console.error('Erro ao carregar fonte:', error);
    return false;
  }
}

export async function gerarQRCode(senha: string): Promise<string> {
  const url = `http://localhost:3001/validar?senha=${senha}`;
  return await QRCode.toDataURL(url, {
    width: 400,
    margin: 0,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  });
}

export async function gerarConvite(nome: string, senha: string): Promise<string> {
  // Carregar a fonte personalizada
  await carregarFonte();

  // Criar um canvas temporário
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Não foi possível criar o contexto do canvas');

  // Carregar a imagem de fundo
  const backgroundImage = new Image();
  backgroundImage.src = '/convite-template.jpeg';

  // Esperar a imagem carregar
  await new Promise((resolve, reject) => {
    backgroundImage.onload = resolve;
    backgroundImage.onerror = reject;
  });

  // Definir o tamanho do canvas baseado na imagem de fundo
  canvas.width = backgroundImage.width;
  canvas.height = backgroundImage.height;

  // Desenhar a imagem de fundo
  ctx.drawImage(backgroundImage, 0, 0);

  // Gerar o QR code
  const qrCodeDataUrl = await gerarQRCode(senha);
  const qrCodeImage = new Image();
  qrCodeImage.src = qrCodeDataUrl;

  // Esperar o QR code carregar
  await new Promise((resolve, reject) => {
    qrCodeImage.onload = resolve;
    qrCodeImage.onerror = reject;
  });

  // Dimensões e posição do quadrado branco no template
  const qrSize = 525; // Tamanho do quadrado branco
  const qrX = (canvas.width - qrSize) / 2;
  const qrY = 650; // Ajuste fino da posição vertical

  // Desenhar o QR code para preencher exatamente o quadrado branco
  ctx.drawImage(qrCodeImage, qrX, qrY, qrSize, qrSize);

  // Configurar fonte e estilo para o texto
  ctx.font = '70px "Iowan Old Style"';
  ctx.fillStyle = '#ECEBED'; // Mesma cor do texto "Agradecemos a confirmação"
  ctx.textAlign = 'center';

  // Posicionar os textos abaixo do bloco verde
  const textoY = qrY + qrSize + 110; // 80px de espaço após o quadrado verde
  ctx.fillText(`${nome}`, canvas.width / 2, textoY);
  ctx.fillText(`SENHA: ${senha}`, canvas.width / 2, textoY + 80); // 40px de espaço entre as linhas

  // Retornar a imagem como data URL
  return canvas.toDataURL('image/png');
}

export function downloadConvite(dataUrl: string, nomeConvidado: string) {
  const link = document.createElement('a');
  link.download = `${nomeConvidado.toLowerCase().replace(/\s+/g, '-')}-convite.png`;
  link.href = dataUrl;
  link.click();
} 