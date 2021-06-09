import { Injectable, ModuleWithComponentFactories } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import * as URL from 'url';

@Injectable({
  providedIn: 'root'
})
export class ProjectloadService {

  constructor(private http: HttpClient, private config: ConfigService) { }


  getProjects(): Promise<IProject[]> {
    return this.convertAndHandleError(this.http.get<IProject[]>('/_api/projects'));
  }

  getRooms(projectID: string): Promise<Array<IRoom>> {
    return this.convertAndHandleError(this.http.get<IRoom[]>(`/_api/projects/${projectID}/rooms`));
  }

  getGeometries(projectID: string, roomID: string): Promise<Array<IGeometry>> {
    return this.convertAndHandleError(this.http.get<IGeometry[]>(`/_api/projects/${projectID}/rooms/${roomID}/geometries`));
  }

  getRevisions(projectID: string, roomID: string, geometryID: string): Promise<Array<IRevision>> {
    // tslint:disable-next-line:max-line-length
    return this.convertAndHandleError(this.http.get<IRevision[]>(`/_api/projects/${projectID}/rooms/${roomID}/geometries/${geometryID}/revisions`));
  }

  loadModel(id: string): Promise<IModel> {
    const url = URL.resolve(this.config.baseURL, '/_api/loadmodel');
    return this.convertAndHandleError<IModel>(this.http.post<IModel>(url, { id }));
  }

  private convertAndHandleError<T>(observable: Observable<T>): Promise<T> {
    const retPromise = observable.toPromise();
    retPromise.catch((error) => { console.log(error); });
    return retPromise;
  }

}

export interface IProject {
  _id: string;
  description: string;
  name: string;
  date: Date;
  rooms: [IRoom];

}

export interface IRoom {

  _id: string;
  name: string;
  description: string;
  date: Date;
  versions: [IGeometry];
  fotos: [IPhoto];

}

export interface IPhoto {

  _id: string;
  filename: string;
  date: Date;
  owner: string;

}

export interface IGeometry {

  _id: string;
  name: string;
  date: Date;
  revisions: Array<IRevision>;

}

export interface IRevision {

  id: string;
  date: Date;
  model: string;

}

export interface IModel {

  _id: string;
  date: Date;
  data: {
    cameras: Array<any>,
    model: {
      ground: Array<string>,
      vertices: Array<IVertex>,
      faces: Array<IFace>
    },
    floorplan: {
      vertices: Array<{id: string, point: {x: number, y: number}}>,
      displacements: Array<{id: string, vector: {x: number, y: number}}>
      walls: Array<{
        wall: [string, string],
        sections: Array<[string, string]>,
        doors: Array<[string, string]>,
        windows: Array<[string, string]>
      }>
    }
};


}

export interface IPoint {
  x: number;
  y: number;
  z: number;
}

export interface IVertex {
  id: string;
  point: IPoint;
}

export interface IFace {
  id: string;
  vertices: Array<string>;
  doors: Array<Array<string>>;
  windows: Array<Array<string>>;
}
