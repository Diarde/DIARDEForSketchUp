import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SketchupService {
  private sketchup: any;

  constructor() {
    // tslint:disable-next-line:no-string-literal
    this.sketchup = window['sketchup'];
  }

  set addFaces(data: any) {
    if (this.sketchup) {
      this.sketchup.accept(data);
    } else {
      console.log(data);
    }
  }
}
