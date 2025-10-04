#include <napi.h>
#include <string>

extern "C" {
    #include <libavcodec/avcodec.h>
    #include <libavformat/avformat.h>
    #include <libavutil/avutil.h>
}

Napi::String GetVersion(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    unsigned int version = avcodec_version();
    return Napi::String::New(env, std::to_string(version));
}

Napi::Object GetVideoInfo(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() < 1 || !info[0].IsString()) {
        Napi::TypeError::New(env, "파일 경로가 필요합니다")
            .ThrowAsJavaScriptException();
        return Napi::Object::New(env);
    }

    std::string filepath = info[0].As<Napi::String>().Utf8Value();

    AVFormatContext* fmt_ctx = nullptr;
    if (avformat_open_input(&fmt_ctx, filepath.c_str(), nullptr, nullptr) < 0) {
        Napi::Error::New(env, "파일을 열 수 없습니다")
            .ThrowAsJavaScriptException();
        return Napi::Object::New(env);
    }

    avformat_find_stream_info(fmt_ctx, nullptr);

    Napi::Object result = Napi::Object::New(env);
    result.Set("duration", (double)fmt_ctx->duration / (double)AV_TIME_BASE);
    result.Set("bitrate", (double)fmt_ctx->bit_rate);
    result.Set("streams", (double)fmt_ctx->nb_streams);

    avformat_close_input(&fmt_ctx);
    return result;
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set("getVersion", Napi::Function::New(env, GetVersion));
    exports.Set("getVideoInfo", Napi::Function::New(env, GetVideoInfo));
    return exports;
}

NODE_API_MODULE(ffmpeg_addon, Init)
