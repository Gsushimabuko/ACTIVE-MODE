import { Injectable } from '@angular/core';
import { ScriptStore } from './script.store';

declare let document: any;

@Injectable({
  providedIn: 'root'
})
export class ScriptService {

  private scripts: any = {};

  constructor() {
    ScriptStore.forEach((script: any) => {
      this.scripts[script.name] = {
        loaded: false,
        src: script.src
      };
    });
  }

  load(id: string, ...scripts: string[]) {
    const promises: any[] = [];
    scripts.forEach((script) => promises.push(this.loadScript(script, id)));
    return Promise.all(promises);
  }

  loadScript(name: string, id: string) {
    return new Promise((resolve, reject) => {
      //resolve if already loaded
      if (this.scripts[name].loaded) {
        resolve({script: name, loaded: true, status: 'Already Loaded'});
      }
      else {
        //load script
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.scripts[name].src;
        script.id = id;
        if (script.readyState) {  //IE
          script.onreadystatechange = () => {
              if (script.readyState === "loaded" || script.readyState === "complete") {
                  script.onreadystatechange = null;
                  this.scripts[name].loaded = true;
                  resolve({script: name, loaded: true, status: 'Loaded'});
              }
          };
        }
        else {  //Others
          script.onload = () => {
            this.scripts[name].loaded = true;
            resolve({script: name, loaded: true, status: 'Loaded'});
          };
        }
        
        script.onerror = (error: any) => resolve({script: name, loaded: false, status: 'Loaded'});
        document.getElementsByTagName('head')[0].appendChild(script);
      }
    });
  }

  unloadScript(id: string) {
    const script = document.getElementById(id);
    console.log(script);
    if (script) script.remove();
  }

  cleanupNiubizArtifacts() {
    const iframe = document.getElementById('visaNetJS');
    
    if (iframe) iframe.remove();

    delete (window as any).Niubiz;
    // If this were not to work, use a window.reload = /transaction since
    // it will refresh the page and delete the niubiz scripts
  }
}
