import { Component, OnInit, OnDestroy } from '@angular/core';
import { IPhoto } from '../../services/projectload.service';
import { Subscription } from 'rxjs';
import { ProjectService } from '../../services/project.service';
import { ConfigService } from 'src/app/services/config.service';
import { Option, none, some, map } from 'fp-ts/lib/Option';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
})
export class ImageComponent implements OnDestroy {
  public base = '';
  public images: Array<IPhoto> = [];
  private subscription: Option<Subscription> = none;

  constructor(
    private projectService: ProjectService,
    private config: ConfigService
  ) {
    this.subscription = some(projectService.imageListSubject.subscribe(list => {
      this.images = list;
    }));
  }

  ngOnDestroy() {
    map((subscription: Subscription) => {subscription.unsubscribe(); })(this.subscription);
  }
}
