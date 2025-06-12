#include <napi.h>
#include "leitor.h"  

// Função wrapper para `read_image_path`
Napi::Object ReadImagePath(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  std::string path = info[0].As<Napi::String>().Utf8Value();
  Reading r = read_image_path(path.c_str());

  Napi::Object result = Napi::Object::New(env);
  result.Set("erro", r.erro);
  result.Set("id_prova", r.id_prova);
  result.Set("id_participante", r.id_participante);
  result.Set("leitura", r.leitura ? Napi::String::New(env, r.leitura) : env.Null());

  return result;
}

// Função wrapper para `read_image_data`
Napi::Object ReadImageData(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  std::string file_type = info[0].As<Napi::String>().Utf8Value();
  Napi::Buffer<unsigned char> file_data = info[1].As<Napi::Buffer<unsigned char>>();
  int file_data_size = info[2].As<Napi::Number>().Int32Value();

  Reading r = read_image_data(file_type.c_str(), file_data.Data(), file_data_size);

  Napi::Object result = Napi::Object::New(env);
  result.Set("erro", r.erro);
  result.Set("id_prova", r.id_prova);
  result.Set("id_participante", r.id_participante);
  result.Set("leitura", r.leitura ? Napi::String::New(env, r.leitura) : env.Null());

  return result;
}

// Inicialização do módulo
Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("readImagePath", Napi::Function::New(env, ReadImagePath));
  exports.Set("readImageData", Napi::Function::New(env, ReadImageData));
  return exports;
}

NODE_API_MODULE(addon, Init)
