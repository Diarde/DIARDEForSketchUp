import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProjectloadService, IGeometry, IModel } from '../../services/projectload.service';
import { ProjectService } from '../../services/project.service';
import { SketchupService } from '../../services/sketchup.service';
import { Subscription } from 'rxjs';
import { Option, none, some, fold, map } from 'fp-ts/lib/Option';

@Component({
  selector: 'app-geometry',
  templateUrl: './geometry.component.html',
  styleUrls: ['./geometry.component.scss']
})
export class GeometryComponent implements OnInit, OnDestroy {


  private subscription: Option<Subscription> = none;

  selected: IGeometry;
  geometries: IGeometry[];

  constructor(
    private projectService: ProjectService,
    private projectloadService: ProjectloadService,
    private sketchupService: SketchupService) {
  }

  ngOnInit() {

    this.subscription = some(this.projectService.roomIDSubject.subscribe(message => {
      fold(
        () => { this.geometries = []; },
        (ids: {projectID: string, roomID: string}) => {
          this.projectloadService.getGeometries(ids.projectID, ids.roomID).then(result => {
            result.sort((a, b) => a.name > b.name ? 1 : -1);
            this.geometries = result;
          });
        })(message);
    }));
  }

  ngOnDestroy() {
    map((subscription: Subscription) => {subscription.unsubscribe(); })(this.subscription);
  }

  select(row: IGeometry) {
    this.selected = row;
    this.projectService.GeometryID = row._id;
  }

}
