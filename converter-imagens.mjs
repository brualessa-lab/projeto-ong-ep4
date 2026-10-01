/* =========================================================
   converter-imagens.mjs — gera a versão WebP dos ficheiros PNG
   da pasta imagens. O PNG permanece como reserva para
   navegadores antigos, servido pelo elemento picture.

   Uso: npm run imagens
   ========================================================= */

import sharp from "sharp";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const PASTA = "imagens";
const QUALIDADE = 90;

const pngs = readdirSync(PASTA).filter(f => f.endsWith(".png"));

for (const png of pngs) {
  const origem = join(PASTA, png);
  const destino = origem.replace(/\.png$/, ".webp");

  await sharp(origem).webp({ quality: QUALIDADE }).toFile(destino);

  const antes = statSync(origem).size;
  const depois = statSync(destino).size;
  const reducao = ((1 - depois / antes) * 100).toFixed(1);

  console.log(`${png}: ${antes} -> ${depois} bytes (${reducao}% menor)`);
}
