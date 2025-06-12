{
  "targets": [
    {
      "target_name": "wrapper",
      "sources": ["wrapper.cpp"],
      "include_dirs": ["<!(node -e \"require('node-addon-api').include\")", "."],
      "libraries": ["<!(pwd)/libleitor.so"],  // colocar meu path pra biblioteca!
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ],
      "defines": [ "NAPI_DISABLE_CPP_EXCEPTIONS" ],
      "dependencies": [ "<!(node -e \"require('node-addon-api').gyp\")" ],
      "link_settings": {
        "libraries": ["-lm"]
      }
    }
  ]
}