import { Injectable, EventEmitter, Output } from '@angular/core';
import {
  IGeometry, IPhoto, ProjectloadService, IRevision, IModel,
} from './projectload.service';
import { Subject } from 'rxjs';
import { Option, none, some, fold } from 'fp-ts/lib/Option';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  projectID: Option<string> = none;
  roomID: Option<string> = none;
  geometryID: Option<string> = none;

  public projectIDSubject: Subject<Option<string>> = new Subject();
  public roomIDSubject: Subject<Option<{ projectID: string; roomID: string }>> = new Subject();
  public geometryIDSubject: Subject<Option<{ projectID: string; roomID: string; geometryID: string }>> = new Subject();
  public renderModelSubject: Subject<IModel> = new Subject();
  public imageListSubject: Subject<Array<IPhoto>> = new Subject();

  constructor() {}

  set ProjectID(id: string) {
    this.projectID = id !== null ? some(id) : none;
    this.projectIDSubject.next(this.projectID);
    this.clearRoomID();
  }

  set RoomID(id: string) {
    this.roomID = id !== null ? some(id) : none;
    this.clearGeometryID();
    this.arrayFold(
      (a: Array<string>) => {
        if (a.length === 2) {
          this.roomIDSubject.next(some({ projectID: a[0], roomID: a[1] }));
        } else {
          this.roomIDSubject.next(none);
        }
      },
      () => {
        this.roomIDSubject.next(none);
      }
    )([this.projectID, this.roomID]);
  }

  set GeometryID(id: string) {
    this.geometryID = id !== null ? some(id) : none;
    this.arrayFold(
      (a: Array<string>) => {
        if (a.length === 3) {
          this.geometryIDSubject.next(
            some({ projectID: a[0], roomID: a[1], geometryID: a[2] })
          );
        } else {
          this.geometryIDSubject.next(none);
        }
      },
      () => {
        this.geometryIDSubject.next(none);
      }
    )([this.projectID, this.roomID, this.geometryID]);
  }

  set imageList(list: Array<IPhoto>) {
    this.imageListSubject.next(list);
  }

  set Model(model: IModel) {
    this.renderModelSubject.next(model);
  }

  private clearRoomID = () => {
    this.roomID = none;
    this.roomIDSubject.next(none);
    this.clearGeometryID();
  }

  private clearGeometryID = () => {
    this.geometryID = none;
    this.geometryIDSubject.next(none);
  }

  private clearImageList = () => {
    this.imageListSubject.next([]);
  }

  private arrayFold = <T extends {}>(
    onSome: (a: Array<T>) => void,
    onNone: () => void
  ): ((array: Array<Option<T>>) => void) => {
    return (array: Array<Option<T>>) => {
      array.reverse();
      const recursive = (array2: Array<Option<T>>, out: Array<T>) => {
        const value = array2.pop();
        fold(
          () => {
            onNone();
          },
          (a: T) => {
            out.push(a);
            if (array2.length > 0) {
              recursive(array2, out);
            } else {
              onSome(out);
            }
          }
        )(value);
      };
      recursive(array, []);
    };
  }
}
