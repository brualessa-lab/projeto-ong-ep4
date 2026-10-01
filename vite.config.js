import { defineConfig } from "vite";

export default defineConfig({
  /* o index.html da aplicação vive em html/, conforme a estrutura
     de diretórios exigida pelo projeto */
  root: "html",

  /* caminhos relativos no resultado, porque o site é publicado
     numa subpasta do domínio e não na raiz do servidor */
  base: "./",

  build: {
    /* a pasta publicada fica fora de html/, na raiz do projeto */
    outDir: "../dist",
    emptyOutDir: true,

    /* minificação do JavaScript com esbuild e do CSS junto */
    minify: "esbuild",
    cssMinify: true,

    /* o logotipo fica como arquivo próprio em vez de embutido em
       base64 no HTML: muda pouco ao longo do tempo, então vale mais
       a pena o navegador guardá-lo em cache separado */
    assetsInlineLimit: 0,

    /* nomes com hash, para o navegador buscar o arquivo novo
       quando o conteúdo muda, e usar o cache quando não muda */
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]"
      }
    }
  }
});
