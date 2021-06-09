import { Component, OnInit, OnDestroy } from '@angular/core';
import { IRevision, ProjectloadService, IModel } from '../../services/projectload.service';
import { ProjectService } from '../../services/project.service';
import { Subscription } from 'rxjs';
import { SketchupService } from '../../services/sketchup.service';
import { inflateModel, inflateFloorplan } from 'src/app/logic/inflatemodel';
import { Option, none, some,  fold, map } from 'fp-ts/lib/Option';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-revision',
  templateUrl: './revision.component.html',
  styleUrls: ['./revision.component.scss'],
})
export class RevisionComponent implements OnInit, OnDestroy {

  revisions = [];
  private subscription: Option<Subscription> = none;

  constructor(
    private projectService: ProjectService,
    private projectloadService: ProjectloadService,
    private sketchupService: SketchupService
  ) {
  }

  ngOnInit() {

    this.subscription = some(this.projectService.geometryIDSubject.subscribe(message => {
      fold(
        () => {
          this.revisions = [];
        },
        (ids: {projectID: string, roomID: string, geometryID: string}) => {
          this.projectloadService.getRevisions(ids.projectID, ids.roomID, ids.geometryID).then(revisions => {
            this.revisions = revisions.map(revision => {
              return {
                date: formatDate(revision.date, 'medium', 'en-Us'),
                model: revision.model,
                id: revision.id
              }; });
          });
          })(message);
    }));
  }

  ngOnDestroy() {
    map((subscription: Subscription) => {subscription.unsubscribe(); })(this.subscription);
  }

  open(modelID: string) {
    this.projectloadService.loadModel(modelID).then((model: IModel) => {
      const vertices: Map<string, [number, number, number]> = new Map();
      model.data.model.vertices.forEach((vertex) =>
        vertices.set(vertex.id, [
          vertex.point.x,
          vertex.point.z,
          vertex.point.y,
        ])
      );

      const offset = Array.from(vertices.values()).map(vertex => vertex[0]).reduce((acc, val) => {
        acc = (acc === undefined || val > acc) ? val : acc;
        return acc;
      }, 0) + 2;

      const floorplan = inflateFloorplan(model);

      // tslint:disable-next-line:no-shadowed-variable
      const data = {
        faces: inflateModel(model).map((x) => {
          return {
            // tslint:disable-next-line:no-shadowed-variable
            face: x.face.map((x) => [x.x, x.z, x.y]),
            windows: x.windows.map((window) =>
              // tslint:disable-next-line:no-shadowed-variable
              window.map((x) => [x.x, x.z, x.y])
            ),
            // tslint:disable-next-line:no-shadowed-variable
            doors: x.doors.map((door) => door.map((x) => [x.x, x.z, x.y])),
          };
        }),
        ground: model.data.model.ground.map((x) => {
          return vertices.get(x);
        }),
        floorplan: {
          sections: floorplan.sections.map(section => section.map(x => [x.x + offset, -x.y, 0])),
          doors: floorplan.doors.map(door => door.map(x => [x.x + offset, -x.y, 0])),
          windows: floorplan.windows.map(window => window.map(x => [x.x + offset, -x.y, 0]))
        }
      };
      this.sketchupService.addFaces = data;
    });
  }

}
