{
  "targets": [
    {
      "target_name": "wrapper",
      "sources": [ "wrapper.cpp" ],
      "include_dirs": [
        "<!(node -p \"require('node-addon-api').include\")",
        "<!(node -p \"require('node-addon-api').include_dir\")",
        "."
      ],
      "libraries": [ "-LC:/Users/vivia/OneDrive/Documentos/leitor-gabaritosOCI/backend/lib/processamento", "-lleitor" ],
      "cflags_cc": [ "-std=c++17" ],
      "defines": [ "NAPI_DISABLE_CPP_EXCEPTIONS" ],
      "dependencies": [ "<!(node -p \"require('node-addon-api').gyp\")" ],
      "link_settings": {
        "libraries": [ "-lm" ]
      }
    }
  ]
}
