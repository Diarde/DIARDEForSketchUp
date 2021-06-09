import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProjectloadService, IRoom } from '../../services/projectload.service';
import { ProjectService } from '../../services/project.service';
import { Subscription } from 'rxjs';
import { Option, none, some, fold, map } from 'fp-ts/lib/Option';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {

  selected: IRoom;
  rooms: IRoom[];

  private subscription: Option<Subscription> = none;

  constructor(private projectService: ProjectService, private projectloadService: ProjectloadService) {
  }


  ngOnInit() {

    this.subscription = some(this.projectService.projectIDSubject.subscribe(message => {
      fold(
        () => { this.rooms = []; },
        (id: string) => {
          this.projectloadService.getRooms(id).then((rooms: IRoom[]) => {
            rooms.sort((a, b) => a.name > b.name ? 1 : -1);
            this.rooms = rooms;
          });
        })(message);
    }));

  }

  ngOnDestroy() {
    map((subscription: Subscription) => {subscription.unsubscribe(); })(this.subscription);
  }

  select(room: IRoom) {
    this.selected = room;
    this.projectService.RoomID = room._id;
    this.projectService.imageList = room.fotos;
  }




}
