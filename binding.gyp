{
  "targets": [
    {
      "target_name": "ffmpeg_addon",
      "sources": [ "src/native/ffmpeg_addon.cc" ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      "libraries": [
        "-lavcodec",
        "-lavformat",
        "-lavutil"
      ],
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ],
      "defines": [ "NAPI_DISABLE_CPP_EXCEPTIONS" ]
    }
  ]
}
