#include <iostream>
#include <cstdio>
#include <cstdlib>
#include "leitor.h"

int main(int argc, char* argv[]) {
    if (argc < 2) {
        std::cerr << "Uso: " << argv[0] << " <caminho_da_imagem>" << std::endl;
        return 1;
    }

    const char* path = argv[1];
    Reading r = read_image_path(path);

    std::cout << "{\n";
    std::cout << "  \"erro\": " << r.erro << ",\n";
    std::cout << "  \"id_prova\": " << r.id_prova << ",\n";
    std::cout << "  \"id_participante\": " << r.id_participante << ",\n";

    // Protege contra leitura nula
    std::cout << "  \"leitura\": \"" << (r.leitura ? r.leitura : "") << "\"\n";
    std::cout << "}" << std::endl;

    return 0;
}
