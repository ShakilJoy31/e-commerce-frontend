export function MyCustomUploadAdapterPlugin(editor: any) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
      return new Base64UploadAdapter(loader);
    };
  }
  
  class Base64UploadAdapter {
    constructor(private loader: any) {}
  
    async upload() {
      return this.loader.file.then((file: File) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve({ default: reader.result });
          reader.onerror = (error) => reject(error);
        });
      });
    }
  
    abort() {}
  }
  