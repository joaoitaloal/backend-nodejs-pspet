#!/bin/bash
NODE_INCLUDE="$(dirname $(which node))/../include/node"
NAPI_INCLUDE="$(node -p \"require('node-addon-api').include\")"

g++ -shared -fPIC -o build/Release/wrapper.node wrapper.cpp \
    -I "$NAPI_INCLUDE" \
    -I "$NODE_INCLUDE" \
    -L "/mnt/c/Users/vivia/OneDrive/Documentos/leitor-gabaritosOCI/backend" \
    -lleitor \
    -std=c++17 \
    -Wl,-rpath="/mnt/c/Users/vivia/OneDrive/Documentos/leitor-gabaritosOCI/backend"