import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import ffi from 'ffi-napi';
import ref from 'ref-napi';
import StructType from 'ref-struct-napi';

// Importa o caminho do arquivo e o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Criação da estrutura reading
const Reading = StructType({
  erro: 'int',
  id_prova: 'int',
  id_participante: 'int',
  leitura: 'string'
});

// Caminho absoluto para a .so
const libPath = path.join(__dirname, '..', 'lib', 'libleitor.so');

// Carrega a biblioteca com os nomes corretos exportados pelo C
const lib = ffi.Library(libPath, {
  read_image_path: [Reading, ['string']],
  read_image_data: [Reading, ['string', 'pointer', 'int']]
});

export default lib;
