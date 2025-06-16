{
  "targets": [
    {
      "target_name": "wrapper.cpp",
      "sources": [ "wrapper.cc" ],
      "include_dirs": [
        "<!(node -p \"require('node-addon-api').include_dir\")",
        "<!(node -p \"require('node-addon-api').include\")"
      ],
      "libraries": [
        "<!(pwd)/libleitor.so",
        "<!(pwd)/libraylib.so.550",
        "<!(pwd)/libZXing.so.3"
      ],
      "ldflags": [
        "-Wl,-rpath,\\$$ORIGIN/../.."
      ],
      "defines": [ "NAPI_DISABLE_CPP_EXCEPTIONS" ]
    }
  ]
}

