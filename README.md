This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# QR Code para Casamento

## Configuração

1. Instale as dependências:
```bash
npm install
```

2. Adicione os arquivos necessários:

   a. Template do convite:
   - Crie um arquivo `convite-template.jpeg` na pasta `public/`
   - A imagem deve ter um espaço em branco centralizado para o QR Code (220x220 pixels)
   - Dimensões recomendadas: 800x1200 pixels

   b. Fonte personalizada:
   - Adicione o arquivo `Iowan-Old-Style.ttc` na pasta `public/Fonts/`
   - Esta fonte será usada para os textos do convite

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Funcionamento

O sistema irá:
- Centralizar o QR Code no espaço em branco do template
- Adicionar abaixo do QR Code:
  - Nome do convidado
  - Senha do convidado
- Usar a fonte Iowan Old Style para os textos
- Gerar um arquivo PNG com o nome `nome-do-convidado-convite.png`
